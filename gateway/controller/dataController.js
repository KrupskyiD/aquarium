import { storage } from "../storage/storage.js";
import { limits } from "../model/limits.js";

export function sendDataToServer(newData) {
    const currentTime = Date.now();

    //If it's first data to send 
    if(storage.salt === null) return true;

    //if it gets 5 minute then send the data
    if(currentTime - storage.timestamp >= limits.timer) return true;

    //check if the one of metrics get above limit or equal to them
    const temp = Math.abs(newData.temperature - storage.temperature) >= limits.tempConst;
    const salt = Math.abs(newData.salt - storage.salt) >= limits.saltConst;

    //return temp or salt if one of them get their limits
    return temp || salt;

}