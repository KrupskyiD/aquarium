import express from 'express';
import * as AquariumController from "../controllers/aquariumController.js";

const router = express.Router();

router.get('/', AquariumController.getAll)
router.post('/', AquariumController.create)
router.delete(':id', AquariumController.remove )

export default router;