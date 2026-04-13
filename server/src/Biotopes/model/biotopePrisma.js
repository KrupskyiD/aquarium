import asyncErrorHandler from '../../ErrorHandlers/asyncErrorHandler.js';
import * as BiotopeModel from '../model/biotopePrisma.js';

export const getBiotopes = asyncErrorHandler(async(res,req) => {
    const biotopes = await BiotopeModel.getAllBiotopes();
    res.status(200).json({status: "success", data: biotopes});
})