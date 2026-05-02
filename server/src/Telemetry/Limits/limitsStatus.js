import { getLimits } from './db/aquariumLimits.js';
import { saltLimits } from './controllers/saltLimits.js';
import { tempLimits } from './controllers/tempLimits.js';

export const limits = async (data) => {

    const { device_number, temperature, salt, temp } = data;
    const temperatureValue = temperature ?? temp;

    const aquariumLimits = await getLimits(device_number);
    if(!aquariumLimits) return "WRONG_DEVICE";

    //Check if salt is in limits
    const saltStatus = saltLimits(aquariumLimits, salt);

    //check if temp is in limits
    const tempStatus = tempLimits(aquariumLimits, temperatureValue);
    
    //return object with difference for limits and status(text) for each metric
    return {
        salt: saltStatus,
        temp: tempStatus
    }
}