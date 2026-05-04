#include <OneWire.h>
#include <DallasTemperature.h>
#include <EEPROM.h>
#include "DFRobot_EC10.h"

#define ONE_WIRE_BUS 2
#define EC_PIN A1
#define SEND_INTERVAL_MS 2000

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensors(&oneWire);
DFRobot_EC10 ec;

DeviceAddress tempSensorAddress;
bool hasTempAddress = false;

unsigned long lastSendTime = 0;

void printSensorAddress(DeviceAddress deviceAddress) {
  for (uint8_t i = 0; i < 8; i++) {
    if (deviceAddress[i] < 16) {
      Serial.print("0");
    }
    Serial.print(deviceAddress[i], HEX);
  }
}

float readWaterTemperature() {
  tempSensors.requestTemperatures();
  float tempC = tempSensors.getTempC(tempSensorAddress);

  // Fallback if DS18B20 is temporarily disconnected
  if (tempC == DEVICE_DISCONNECTED_C) {
    return 25.0;
  }

  return tempC;
}

void setup() {
  Serial.begin(9600);

  tempSensors.begin();
  ec.begin();

  if (tempSensors.getDeviceCount() > 0 && tempSensors.getAddress(tempSensorAddress, 0)) {
    hasTempAddress = true;
  }
}

void loop() {
  // Read current temperature from DS18B20
  float temperature = hasTempAddress ? readWaterTemperature() : 25.0;

  // Read EC sensor voltage exactly in the style of the official sample
  float voltage = analogRead(EC_PIN) / 1024.0 * 5000.0;

  // Convert voltage to EC (ms/cm) with temperature compensation
  float ecValue = ec.readEC(voltage, temperature);

  // Keeps calibration support active if you send commands over Serial
  ec.calibration(voltage, temperature);

  if (millis() - lastSendTime >= SEND_INTERVAL_MS) {
    lastSendTime = millis();

    if (hasTempAddress) {
      printSensorAddress(tempSensorAddress);
    } else {
      Serial.print("NO_ADDRESS");
    }

    Serial.print(":");
    Serial.print(temperature, 2);
    Serial.print(":");
    Serial.println(ecValue, 2);
  }
}