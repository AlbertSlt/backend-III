import { AppError, ERROR_CODES } from '../../errors/index.js';

export const validateMockCountQuery = (req, res, next) => {
    const rawCount = req.query.count;

    if (rawCount === undefined) {
        req.mockCount = 10; // valor por defecto
        return next();
    }

    const count = Number(rawCount);

    if (!Number.isInteger(count) || count <= 0 || count > 1000) {
        return next(new AppError(
            ERROR_CODES.INVALID_MOCK_AMOUNT,
            "El parametro 'count' debe ser un numero entero entre 1 y 1000"
        ));
    }

    req.mockCount = count;
    next();
};

export const validateMockDataBody = (req, res, next) => {
    const { users, couriers, orders, deliveries } = req.body;
    const fields = { users, couriers, orders, deliveries };

    for (const [key, value] of Object.entries(fields)) {
        if (value === undefined) continue;

        if (!Number.isInteger(value) || value < 0 || value > 1000) {
            return next(new AppError(
                ERROR_CODES.INVALID_MOCK_AMOUNT,
                `El campo '${key}' debe ser un numero entero entre 0 y 1000`
            ));
        }
    }

    next();
};

export const validateMockProductsBody = (req, res, next) => {
    const { count, saveToDatabase } = req.body;

    if (count === undefined || !Number.isInteger(count) || count <= 0 || count > 1000) {
        return next(new AppError(
            ERROR_CODES.INVALID_MOCK_AMOUNT,
            "count es obligatorio y debe ser un numero entero entre 1 y 1000"
        ));
    }

    if (saveToDatabase !== undefined && typeof saveToDatabase !== "boolean") {
        return next(new AppError(
            ERROR_CODES.VALIDATION_ERROR,
            "saveToDatabase debe ser un booleano (true o false)"
        ));
    }

    next();
};