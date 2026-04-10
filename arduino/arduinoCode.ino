#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 2

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

DeviceAddress sensorAddress;

String addressToString(DeviceAddress deviceAddress) {
  String result = "";
  for (uint8_t i = 0; i < 8; i++) {
    if (deviceAddress[i] < 16) result += "0";
    result += String(deviceAddress[i], HEX);
  }
  result.toUpperCase();
  return result;
}

void setup() {
  Serial.begin(9600);
  sensors.begin();

  if (sensors.getDeviceCount() == 0) {
    Serial.println("NO_SENSOR:0.00:0.00");
    return;
  }

  if (!sensors.getAddress(sensorAddress, 0)) {
    Serial.println("NO_ADDRESS:0.00:0.00");
    return;
  }
}

void loop() {
  sensors.requestTemperatures();
  float tempC = sensors.getTempC(sensorAddress);

  String sensorId = addressToString(sensorAddress);

  if (tempC == DEVICE_DISCONNECTED_C) {
    Serial.print(sensorId);
    Serial.println(":0.00:0.00");
  } else {
    Serial.print(sensorId);
    Serial.print(":");
    Serial.print(tempC, 2);
    Serial.print(":");
    Serial.println("0.00"); // zagluska
  }

  delay(2000);
}