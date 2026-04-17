import { getLimits } from './aquariumLimits.js';
import asyncError from '../../ErrorHandlers/asyncErrorHandler.js'

export const saltLimits = asyncError(async (req, res, next) => {
    const limits = req.body;
    const { device_serial } = req.body;

    //get limits from user's aquarium
    const aquariumLimits = await getLimits(device_serial);

    //Check if salt is in limits
    if (aquariumLimits.min_salt <= limits.salt && limits <= aquariumLimits.max_salt) {
        return {
            text: "v normě",
            number: 0
        };
    } else if (aquariumLimits.min >= limits.salt) {
        const saltDifference = aquariumLimits.min - limits.salt;
        return {
            text: "pod cílem",
            difference: saltDifference
        };
    } else {
        const saltDifference = aquariumLimits.min + limits.salt;
        return {
            text: "nad cílem",
            difference: saltDifference
        };
    }
})