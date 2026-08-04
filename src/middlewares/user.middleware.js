import { AppError, ERROR_CODES } from "../errors/index.js";

export const validateUser = (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return next(new AppError(
            ERROR_CODES.VALIDATION_ERROR,
            "first_name, last_name, email y password son obligatorios"
        ));
    }
    next();
};

export const validateUserUpdate = (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;

    const hasAtLeastOneField = first_name || last_name || email || password;

    if (!hasAtLeastOneField) {
        return next(new AppError(
            ERROR_CODES.VALIDATION_ERROR,
            "Debe enviar al menos un campo para actualizar (first_name, last_name, email o password)"
        ));
    }
    next();
};