import { config } from "../config/env.config.js";
import { AppError, ERROR_CODES } from "../errors/index.js";
import logger from "../config/logger.js";

export const notFoundHandler = (req, res, next) => {
    next(new AppError(ERROR_CODES.ROUTE_NOT_FOUND, `Ruta ${req.originalUrl} no encontrada`));
};

export function errorHandler(err, req, res, next) {
    const customError = err instanceof AppError ? err : mapToCustomError(err);

    const { statusCode, code, message } = customError;

    if (customError.code === ERROR_CODES.INTERNAL_SERVER_ERROR) {
        logger.error(`[INESPERADO] ${err.message} | ${req.method} ${req.originalUrl}`);
    } else {
        logger.warning(`${code}: ${message} | ${req.method} ${req.originalUrl}`);
    }

    const response = { status: 'error', error: code, message };

    if (config.NODE_ENV !== 'production' && customError.details) {
        response.details = customError.details;
    }

    res.status(statusCode).json(response);
}

function mapToCustomError(err) {
    if (err.name === 'CastError') {
        return new AppError(ERROR_CODES.INVALID_ID, `El id proporcionado no tiene un formato válido`);
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'campo';
        return new AppError(ERROR_CODES.DUPLICATE_KEY, `Ya existe un registro con ese ${field}`);
    }
    if (err.name === 'ValidationError') {
        const details = Object.values(err.errors).map((e) => e.message);
        return new AppError(ERROR_CODES.VALIDATION_ERROR, err.message, details);
    }
    return new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR);
}