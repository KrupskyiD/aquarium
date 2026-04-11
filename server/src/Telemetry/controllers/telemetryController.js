import asyncErrorHandler from '../../errorHandlers/asyncErrorHandler.js';
import { saveMetricsToDB } from '../model/telemetryPrisma.js';
import { getIO } from '../../../Socket/socket.js';
import { customError } from '../../ErrorHandlers/customError.js';

export const telemetryController = asyncErrorHandler(async (req, res, next) => {
    //getting the data object from gateway
    const data = req.body;

    //saving new data and return a status
    const savingMetrics = await saveMetricsToDB(data);
    if(!savingMetrics) return next(new customError('Your data are not valid. Please, check your input data', 400))

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

