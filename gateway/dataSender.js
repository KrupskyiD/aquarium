export const sendSaltToServer = async function (){
    try{
        if(parsedData.length === 3) {
           const dataObject = {
                device_serial: parsedData[0].trim(),
                // temperature: parseFloat(parsedData[1]),
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
}

export const sendTempToServer = async function (){
    try{
        if(parsedData.length === 3) {
           const dataObject = {
                device_serial: parsedData[0].trim(),
                temperature: parseFloat(parsedData[1]),
                // salt: parseFloat(parsedData[2]),
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
}