import express from 'express';
import * as AquariumController from "../controllers/aquariumController.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', authenticate, AquariumController.getAll)
router.post('/', authenticate, AquariumController.create)
router.put('/:id', authenticate, AquariumController.update);
router.delete('/:id',authenticate, AquariumController.remove)

export default router;