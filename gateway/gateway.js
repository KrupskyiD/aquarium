const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');
require('dotenv').config();

const parser = new ReadlineParser({
    delimiter: '\r\n'
});


let port = new SerialPort('/*copy the path from arduino editor. On mac it will be started from dev, but on pc itll be a com*/',{
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

port.pipe(parser);

parser.on('data',async function(data){

    try {
        const parsedData = data.split(':');

        if(parsedData.length === 2) {
           const dataObject = {
                device_serial: process.env.DEVICE_SERIAL,
                temperature: parseFloat(parsedData[0]),
                salt: parseFloat(parsedData[1]),
                timestamp: new Date().toISOString(),
            }
            await axios.post(process.env.BACKEND_URL, dataObject);
        } else {
            console.log('Failed to parse the string:', data);
        }

    } catch (error) {
        console.error('Error while sending to the backend:', error.message);
    }

})















// io.on('connection', function(data){
//     console.log('Node.js is listening!')
// });
//
// parser.on('data', function(data){
//
//     console.log(data);
//
//     io.emit('data', data)
// });
//
// app.listen(3002);
//
// serialApp.on('serial-data', async (serialData) => {
//
//     try {
//             const parsedData = serialData.split(':');
//
//             if(parsedData.length === 2) {
//                 dataObject = {
//                     device_servial: DEVICE_SERIAL,
//                     tempature: parseFloat(parsedData[0]),
//                     salt: parseFloat(parsedData[1]),
//                     timestamp: new Date().toISOString(),
//                 }
//
//             const response = await axios.post(BACKEND_URL, payload);
//
//         } else {
//             console.log('Failed to parse the string:', serialData);
//         }
//
//     } catch (error) {
//         console.error('Error while sending to the backend:', error.message);
//     }
// });