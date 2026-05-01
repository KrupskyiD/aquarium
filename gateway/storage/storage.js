// saves last send data from microcontroller after it sent to server
 let storage = {
    temperature: null,
    salt: null,
    timestamp: 0, //will saves new date after sending data, what annul the timer 
    
}

module.exports = storage;