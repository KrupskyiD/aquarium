import { body, param, validationResult } from "express-validator";

const AQUARIUM_TYPES = ["marine", "freshwater"];
const UPDATE_FIELDS = [
    "name",
    "volume",
    "type",
    "device_serial",
    "min_salt",
    "max_salt",
    "min_temp",
    "max_temp",
];

const sendValidationErrors = (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) return next();

    return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: result.array(),
    });
};

export const createAquariumValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Aquarium name is required.")
        .isLength({ max: 100 })
        .withMessage("Aquarium name can have max 100 characters."),
    body("volume")
        .notEmpty()
        .withMessage("Aquarium volume is required.")
        .isInt({ min: 1, max: 100000 })
        .withMessage("Aquarium volume must be a positive integer."),
    body("type")
        .notEmpty()
        .withMessage("Aquarium type is required.")
        .isIn(AQUARIUM_TYPES)
        .withMessage("Aquarium type must be either marine or freshwater."),
    body("device_serial")
        .trim()
        .notEmpty()
        .withMessage("Device serial is required.")
        .isLength({ max: 100 })
        .withMessage("Device serial can have max 100 characters."),
    body("min_salt")
        .optional()
        .isFloat()
        .withMessage("Minimum salt value must be a number."),
    body("max_salt")
        .optional()
        .isFloat()
        .withMessage("Maximum salt value must be a number.")
        .custom((value, { req }) => {
            if (req.body.min_salt == null) return true;
            return Number(value) >= Number(req.body.min_salt);
        })
        .withMessage("Maximum salt must be greater than or equal to minimum salt."),
    body("min_temp")
        .optional()
        .isFloat()
        .withMessage("Minimum temperature must be a number."),
    body("max_temp")
        .optional()
        .isFloat()
        .withMessage("Maximum temperature must be a number.")
        .custom((value, { req }) => {
            if (req.body.min_temp == null) return true;
            return Number(value) >= Number(req.body.min_temp);
        })
        .withMessage("Maximum temperature must be greater than or equal to minimum temperature."),
    sendValidationErrors,
];

export const updateAquariumValidation = [
    param("id").isInt({ min: 1 }).withMessage("Aquarium id must be a positive integer."),
    body().custom((_, { req }) => {
        const hasAnyField = UPDATE_FIELDS.some((field) => req.body[field] !== undefined);
        if (!hasAnyField) {
            throw new Error("At least one updatable field is required.");
        }
        return true;
    }),
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Aquarium name cannot be empty.")
        .isLength({ max: 100 })
        .withMessage("Aquarium name can have max 100 characters."),
    body("volume")
        .optional()
        .isInt({ min: 1, max: 100000 })
        .withMessage("Aquarium volume must be a positive integer."),
    body("type")
        .optional()
        .isIn(AQUARIUM_TYPES)
        .withMessage("Aquarium type must be either marine or freshwater."),
    body("device_serial")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Device serial cannot be empty.")
        .isLength({ max: 100 })
        .withMessage("Device serial can have max 100 characters."),
    body("min_salt")
        .optional()
        .isFloat()
        .withMessage("Minimum salt value must be a number."),
    body("max_salt")
        .optional()
        .isFloat()
        .withMessage("Maximum salt value must be a number.")
        .custom((value, { req }) => {
            if (req.body.min_salt == null) return true;
            return Number(value) >= Number(req.body.min_salt);
        })
        .withMessage("Maximum salt must be greater than or equal to minimum salt."),
    body("min_temp")
        .optional()
        .isFloat()
        .withMessage("Minimum temperature must be a number."),
    body("max_temp")
        .optional()
        .isFloat()
        .withMessage("Maximum temperature must be a number.")
        .custom((value, { req }) => {
            if (req.body.min_temp == null) return true;
            return Number(value) >= Number(req.body.min_temp);
        })
        .withMessage("Maximum temperature must be greater than or equal to minimum temperature."),
    sendValidationErrors,
];
