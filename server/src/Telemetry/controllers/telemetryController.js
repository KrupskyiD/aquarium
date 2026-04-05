import { asyncErrorHandler } from '../../ErrorHandlers/asyncErrorHandler';
import io from '../../../index';

export default telemetry = asyncErrorHandler(async (req, res, next) => {
    //getting the data object from gateway 
    const data = req.body;

    //get only metricks from the package for sending to frontend
    const metrics = {
        temp: data.temperature,
        salt: data.salt
    };

    //send metricks to client to endpoint 'dashboard-metricks' 
    io.emit('dashboard-metricks', metrics);
    res.sendStatus(200);

    //space for saving new data
})