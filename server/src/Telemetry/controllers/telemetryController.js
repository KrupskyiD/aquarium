import asyncErrorHandler from '../../errorHandlers/asyncErrorHandler.js';
import { saveMetricsToDB } from '../model/telemetryPrisma.js';
import { getIO } from '../../../Socket/socket.js';
import { customError } from '../../ErrorHandlers/customError.js';
import { limits } from '../Limits/limitsStatus.js';
import { userDb } from '../model/telemetryPrisma.js';

export const telemetryController = asyncErrorHandler(async (req, res, next) => {
    //getting the data object from gateway
    const data = req.body;

    //saving data to database
    const sendMetricsToDB = await saveMetricsToDB(data);
    if(!sendMetricsToDB) return next(new customError('Your aqaurium did not find. Check if you created aquarium with this device', 404));

    //get limits status and return error if the device isn't correct(aquarium haven't found)
    const getLimitsStatus = await limits(data);
    if(getLimitsStatus === "WRONG_DEVICE") return next(new customError("Aqaurium didn't find out. Check if you write the right device", 404));

    //get user's id for room
    const getUsersId = await userDb(data.device_serial);
    if(!getUsersId) return next(new customError("This user doesn't exist", 404));

    //get only metricks from the package for sending to frontend. And adding device_serial for sorting metrics by serial number on dashboard(prehled) on each aquarium
    const metrics = {
        device_serial: data.device_serial,
        limits: getLimitsStatus,
        temp: data.temperature,
        salt: data.salt
    };

    //create room for the user using his id as the name for room. Socket doesn't understand integer. so we need make a string from number
    const userRoomId = getUsersId.user_id.toString();

    // send metricks to client to endpoint 'dashboard-metricks' to user's room
    getIO().to(userRoomId).emit('dashboard-metrics', metrics);

    //response to gateway
    res.sendStatus(201);
})

