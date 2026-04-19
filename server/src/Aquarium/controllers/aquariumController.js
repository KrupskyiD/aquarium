import asyncErrorHandler from '../../ErrorHandlers/asyncErrorHandler.js';
import * as AquariumModel from '../model/aquariumPrisma.js';
import { customError } from '../../ErrorHandlers/customError.js';

/**
 * Strict positive integer for volume (no decimals, no letters); JSON number must be integer.
 */
function parseStrictPositiveIntVolume(raw) {
  if (raw === undefined || raw === null) return NaN;
  if (typeof raw === 'number') {
    if (!Number.isInteger(raw) || raw < 1) return NaN;
    return raw;
  }
  const s = String(raw).trim();
  if (s === '') return NaN;
  if (!/^\d+$/.test(s)) return NaN;
  const n = parseInt(s, 10);
  return n >= 1 ? n : NaN;
}

/**
 * Normalize request body keys (dashboard, REST aliases, IoT legacy).
 */
function pickCreatePayload(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const volume = parseStrictPositiveIntVolume(body.volume ?? body.volumeLiters);

  let water_type =
    body.type ??
    body.water_type ??
    (body.biotope === 'freshwater'
      ? 'freshwater'
      : body.biotope === 'marine'
        ? 'marine'
        : undefined);

  const notes = body.notes ?? body.note ?? null;

  const device_number = (
    body.device_number ??
    body.device_serial ??
    body.device_id ??
    body.deviceAddress ??
    ''
  ).trim();

  return { name, volume, water_type, notes, device_number };
}

/**
 * Public JSON shape for API consumers (matches DB column names conceptually).
 */
function serializeAquariumPublic(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    volume: row.volume,
    type: row.water_type,
    notes: row.notes,
    device_number: row.device_number,
    status: row.connection_status,
  };
}

export const getAll = asyncErrorHandler(async (req, res) => {
    const aquariums = await AquariumModel.getAllAquariums(req.user.id);
    res.status(200).json({
      status: "success",
      data: aquariums.map(serializeAquariumPublic),
    });
});

export const create = asyncErrorHandler(async (req, res) => {
    const { name, volume, water_type, notes, device_number } = pickCreatePayload(req.body);

    if (!name.length) {
      return res.status(400).json({ status: 'error', message: 'Zadejte název akvária.' });
    }
    if (!Number.isFinite(volume)) {
      return res.status(400).json({
        status: 'error',
        message: 'Objem musí být kladné celé číslo (bez písmen a symbolů).',
      });
    }
    if (water_type !== 'marine' && water_type !== 'freshwater') {
      return res.status(400).json({
        status: 'error',
        message: 'Typ akvária musí být marine nebo freshwater.',
      });
    }
    if (!device_number.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Zadejte číslo zařízení nebo IP adresu.',
      });
    }

    const connection_status = Math.random() > 0.12 ? 'online' : 'offline';

    const aquarium = await AquariumModel.createAquarium(
      {
        name,
        volume,
        water_type,
        notes: typeof notes === 'string' && notes.length ? notes.trim() : null,
        device_number,
        connection_status,
      },
      req.user.id,
    );
    res.status(201).json({ status: "success", data: serializeAquariumPublic(aquarium) });
});

export const remove = asyncErrorHandler(async (req, res) => {
    const aquarium = await AquariumModel.getAquariumById(req.params.id, req.user.id);
    if (!aquarium) {
        return res.status(404).json({status: "error", message: "Aquarium not found or access denied"});
    }

    const removed = await AquariumModel.deleteAquarium(req.params.id, req.user.id);
    if (!removed) {
        return res.status(404).json({status: "error", message: "Aquarium not found or access denied"});
    }
    res.status(204).send();
});

export const update = asyncErrorHandler(async (req, res) => {
    const aquarium = await AquariumModel.getAquariumById(req.params.id, req.user.id);
    if (!aquarium) {
        return res.status(404).json({status: "error", message: "Aquarium not found or access denied"});
    }

    const updatedAquarium = await AquariumModel.updateAquarium(req.params.id, req.body, req.user.id);
    if (!updatedAquarium) {
      return res.status(404).json({ status: "error", message: "Aquarium not found or access denied" });
    }

    res.status(200).json({ status: "success", data: serializeAquariumPublic(updatedAquarium) });
})

export const getAquariumById = asyncErrorHandler(async (req, res, next) => {
    const getById = await AquariumModel.getAquariumById(req.params.id, req.user.id);

    if(!getById) return next(new customError("Your aqarium have not found!", 404));

    res.status(200).json({ status: "success", data: serializeAquariumPublic(getById) });
});

