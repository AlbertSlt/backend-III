import { AppError, ERROR_CODES } from '../errors/index.js';
import { USER_DOCUMENT_TYPES } from '../utils/constants.js';

// Se ejecuta DESPUES de multer (upload.single('document')), porque el campo
// 'type' viaja en el body multipart y recien esta disponible una vez que
// multer terminó de parsear la petición.
export const validateDocumentType = (req, res, next) => {
    const { type } = req.body;

    if (!type || !USER_DOCUMENT_TYPES.includes(type)) {
        return next(new AppError(
            ERROR_CODES.INVALID_DOCUMENT_TYPE,
            `El campo 'type' es obligatorio y debe ser uno de: ${USER_DOCUMENT_TYPES.join(', ')}`
        ));
    }

    next();
};