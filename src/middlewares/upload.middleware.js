import multer from 'multer';
import path from 'path';
import { AppError, ERROR_CODES } from '../errors/index.js';
import { DOCUMENT_TYPES } from '../utils/constants.js';

// Carpetas de destino según el archivo recibido:
// - 'proof' (comprobantes de pedido) -> uploads/proofs
// - 'document' con type=driver_license -> uploads/licenses
// - 'document' con cualquier otro type (o sin type) -> uploads/documents
//
// IMPORTANTE: para que esto funcione, el campo 'type' debe enviarse ANTES
// que el archivo en el formulario multipart/form-data (así Multer ya lo
// tiene parseado en req.body cuando decide la carpeta). Si el cliente envía
// el archivo primero, el documento cae en 'uploads/documents' por defecto:
// no es un error, solo pierde la sub-clasificación por carpeta (el `type`
// igual queda bien guardado en los metadatos, que es la fuente de verdad).
const resolveDestinationFolder = (req, file) => {
    if (file.fieldname === 'proof') {
        return 'uploads/proofs';
    }
    if (req.body?.type === DOCUMENT_TYPES.DRIVER_LICENSE) {
        return 'uploads/licenses';
    }
    return 'uploads/documents';
};

const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, resolveDestinationFolder(req, file));
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(null, true);
    }
    cb(new AppError(
        ERROR_CODES.INVALID_FILE_TYPE,
        `El tipo de archivo '${file.mimetype}' no esta permitido. Tipos permitidos: ${ALLOWED_MIME_TYPES.join(', ')}`
    ));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
});

export default upload;