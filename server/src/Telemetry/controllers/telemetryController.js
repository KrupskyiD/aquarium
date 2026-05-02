import asyncErrorHandler from '../../ErrorHandlers/asyncErrorHandler.js';
import { saveMetricsToDB } from '../model/telemetryPrisma.js';
import { customError } from '../../ErrorHandlers/customError.js';

export const telemetryController = asyncErrorHandler(async (req, res, next) => {
    const { device_number, salt, temp } = req.body ?? {};
    const apiKey = req.headers['x-api-key'];

    if (device_number == null || salt == null || temp == null) {
        return next(new customError('Request body must include device_number, salt, and temp', 400));
    }

    if (String(device_number) !== String(apiKey)) {
        return next(new customError('device_number must match X-API-KEY', 403));
    }

    const saved = await saveMetricsToDB({
        device_number: String(device_number),
        temperature: Number(temp),
        salt: Number(salt),
    });

    if (!saved) {
        return next(new customError('Aquarium not found for this device_number', 404));
    }

    res.sendStatus(201);
});
