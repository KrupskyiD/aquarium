import asyncErrorHandler from '../../ErrorHandlers/asyncErrorHandler.js';
import {io} from '../../../index.js';
import telemetryPrisma from '../model/telemetryPrisma.js'


export const telemetryController = asyncErrorHandler(async (req, res, next) => {
    //getting the data object from gateway 
    const data = req.body;

    //get only metricks from the package for sending to frontend
    const metrics = {
        temp: data.temperature,
        salt: data.salt
    };

    //send metricks to client to endpoint 'dashboard-metricks' 
    // io.emit('dashboard-metricks', metrics);
    // res.sendStatus(200);

    //saving new data and return a status
    const savingMetrics = await telemetryPrisma(data);
    res.status(201).json(savingMetrics);
})

