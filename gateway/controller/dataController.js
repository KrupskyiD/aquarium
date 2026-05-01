const  storage  = require( "../storage/storage.js");
const  limits  = require( "../model/limits.js");

function sendDataToServer(newData) {
    const currentTime = Date.now();

    //If it's first data to send 
    if(storage.salt === null) {
        // console.log("Those what came:", newData);
        return true};

    //if it gets 5 minute then send the data
    if(currentTime - storage.timestamp >= limits.timer) {
        // console.log("Those what came:", newData);
        return true};

    //check if the one of metrics get above limit or equal to them
    const temp = Math.abs(newData.temperature - storage.temperature) >= limits.tempConst;
    const salt = Math.abs(newData.salt - storage.salt) >= limits.saltConst;
    // console.log("Those what came:", newData);

    //return temp or salt if one of them get their limits
    return temp || salt;

}
module.exports = sendDataToServer;