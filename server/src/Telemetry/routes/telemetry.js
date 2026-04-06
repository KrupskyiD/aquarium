import { Router } from 'express';
import {telemetryController} from '../controllers/telemetryController.js'
const router = Router();

router.route('/').post(telemetryController);

export default router;