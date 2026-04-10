import {customError} from '../ErrorHandlers/customError.js';
import { findDeviceInDB } from './deviceFinder.js';

export const deviceChecker = async(req, res, next) =>{
    //check if the package has header
    const apiKey = req.headers['x-api-key'];
    if(!apiKey){
        console.warn('Rejected: missing X-API-KEY header');
        return next(new customError('Missing X-API-KEY header', 401));
    }
    //checking if the device is in db;
    const existedDevice = await findDeviceInDB(apiKey);

    if(!existedDevice) return next(new customError('This device is not registered. Please check your device number.'), 403);

    req.device = existedDevice;

    next();
}; 