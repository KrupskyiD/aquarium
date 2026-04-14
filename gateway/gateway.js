const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');
require('dotenv').config();

const parser = new ReadlineParser({
    delimiter: '\r\n'
});

/*copy the path from arduino editor. On mac it will be started from dev, but on pc itll be a com*/
let port = new SerialPort({
    path: 'COM9',
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

        if(parsedData.length === 3) {
           const dataObject = {
                device_serial: parsedData[0].trim(),
                temperature: parseFloat(parsedData[1]),
                salt: parseFloat(parsedData[2]),
                // timestamp: new Date().toISOString(),
            }
            await axios.post(process.env.BACKEND_URL, dataObject, {
                headers: {
                    'X-API-KEY': dataObject.device_serial
                }
            });
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