import { getLimits } from './db/aquariumLimits.js';
import { saltLimits } from './controllers/saltLimits.js';
import { tempLimits } from './controllers/tempLimits.js';

export const limits = async (data) => {

    //getting needed data from gateway through gateway
    const { device_serial, temperature, salt } = data;

    //get range limits (min and max for temperature and salinity) from user's aquarium
    const aquariumLimits = await getLimits(device_serial);
    if(!aquariumLimits) return "WRONG_DEVICE";

    //Check if salt is in limits
    const saltStatus = saltLimits(aquariumLimits, salt);

    //check if temp is in limits
    const tempStatus = tempLimits(aquariumLimits, temperature);
    
    //return object with difference for limits and status(text) for each metric
    return {
        salt: saltStatus,
        temp: tempStatus
    }
}