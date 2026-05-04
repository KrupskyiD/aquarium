import asyncErrorHandler from '../../ErrorHandlers/asyncErrorHandler.js';
import * as BiotopeModel from '../model/biotopePrisma.js';
import { customError } from '../../ErrorHandlers/customError.js';


export const getBiotopes = asyncErrorHandler (async (req, res, next) => {
    const biotopes = await BiotopeModel.getAllBiotopes(req.body);
    if(!biotopes) return next(new customError('Bitopes with this name does not exist', 404));
    
    res.status(200).json({
        status: "success",
        data: biotopes
    });
});