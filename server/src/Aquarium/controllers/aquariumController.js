import asyncErrorHandler from '../../ErrorHandlers/asyncErrorHandler.js';
import * as AquariumModel from '../model/aquariumPrisma.js';
import { customError } from '../../ErrorHandlers/customError.js';

export const getAll = asyncErrorHandler(async (req, res) => {
    const aquariums = await AquariumModel.getAllAquariums(req.user.id);
    res.status(200).json({ status: "success", data: aquariums });
});

export const create = asyncErrorHandler(async (req, res) => {
    const aquarium = await AquariumModel.createAquarium(req.body, req.user.id);
    res.status(201).json({ status: "success", data: aquarium });
});

export const remove = asyncErrorHandler(async (req, res) => {
    const aquarium = await AquariumModel.getAquariumById(req.params.id, req.user.id);
    if (!aquarium) {
        return res.status(404).json({status: "error", message: "Aquarium not found or access denied"});
    }

    await AquariumModel.deleteAquarium(req.params.id, req.user.id);
    res.status(204).send();
});

export const update = asyncErrorHandler(async (req, res) => {
    const aquarium = await AquariumModel.getAquariumById(req.params.id, req.user.id);
    if (!aquarium) {
        return res.status(404).json({status: "error", message: "Aquarium not found or access denied"});
    }

    const updatedAquarium = await AquariumModel.updateAquarium(req.params.id, req.body);

    res.status(200).json({ status: "success", data: updatedAquarium });
})

export const getAquariumById = asyncErrorHandler(async (req, res, next) => {
    const getById = await AquariumModel.getAquariumById(req.params.id, req.user.id);

    if(!getById) return next(new customError("Your aqarium have not found!", 404));
    
    res.status(200).json({ status: "success", data: getById });
});


