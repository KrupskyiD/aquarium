import { Router } from 'express';
import {telemetryController} from '../controllers/telemetryController'
const router = Router();

router.route('/').post(telemetryController);