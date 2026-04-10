import { Router } from 'express';
import {telemetryController} from '../controllers/telemetryController.js'
const router = Router();

router.route('/').post(telemetryController);

export default router;

/**
 * if it'l be needed to add some validation
 * const {validationResult, body, Result} = require('express-validator');

//For Team in table teams we can validate only one attribute name, max 100 symbols.
exports.teamValidation = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Write name for a new team.')
    .isLength({max: 100})
    .withMessage('Write team name shorter.'),

    
    (req, res, next)=>{
        const result = validationResult(req);
        if (!result.isEmpty()) {
    return res.status(400).json({
        errors: result.array()
    });
  }
        next();
    }
];

or

const express = require('express');
const { query, validationResult } = require('express-validator');
const app = express();

app.use(express.json());
app.get('/hello', query('person').notEmpty().escape(), (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return res.send(`Hello, ${req.query.person}!`);
  }

  res.send({ errors: result.array() });
});

app.listen(3000);
 */