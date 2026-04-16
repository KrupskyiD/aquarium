import asyncErrorHandler from '../../errorHandlers/asyncErrorHandler.js';
import { saveMetricsToDB } from '../model/telemetryPrisma.js';
import { getIO } from '../../../Socket/socket.js';
import { customError } from '../../ErrorHandlers/customError.js';

export const telemetryController = asyncErrorHandler(async (req, res, next) => {
    //getting the data object from gateway
    const data = req.body;

    //saving data to database
    const sendMetricsToDB = await saveMetricsToDB(data);
    if(!sendMetricsToDB) return next(new customError('Your aqaurium did not find. Check if you created aquarium with this device', 404));

    //get only metricks from the package for sending to frontend
    const metrics = {
        temp: data.temperature,
        salt: data.salt
    };

    // send metricks to client to endpoint 'dashboard-metricks'
    getIO().emit('dashboard-metrics', metrics);

    //response to gateway
    res.sendStatus(201);
})

