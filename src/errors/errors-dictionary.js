import { ERROR_CODES } from './error-codes.js';

export const errorsDictionary = {
    [ERROR_CODES.VALIDATION_ERROR]: {
        statusCode: 400,
        message: 'Los datos enviados no son validos'
    },
    [ERROR_CODES.USER_NOT_FOUND]: {
        statusCode: 404,
        message: 'El usuario no fue encontrado'
    },
    [ERROR_CODES.ORDER_NOT_FOUND]: {
        statusCode: 404,
        message: 'La orden no fue encontrada'
    },
    [ERROR_CODES.DELIVERY_NOT_FOUND]: {
        statusCode: 404,
        message: 'La entrega no fue encontrada'
    },
    [ERROR_CODES.INVALID_ORDER_STATUS]: {
        statusCode: 400,
        message: 'El estado indicado no es valido para un pedido'
    },
    [ERROR_CODES.INVALID_DELIVERY_STATUS]: {
        statusCode: 400,
        message: 'El estado indicado no es valido para una entrega'
    },
    [ERROR_CODES.DRIVER_NOT_AVAILABLE]: {
        statusCode: 400,
        message: 'El repartidor no esta disponible'
    },
    [ERROR_CODES.INVALID_MOCK_AMOUNT]: {
        statusCode: 400,
        message: 'La cantidad de registros a generar debe ser un numero entero positivo'
    },
    [ERROR_CODES.PRODUCT_NOT_FOUND]: {
        statusCode: 404,
        message: 'Producto no encontrado'
    },
    [ERROR_CODES.INVALID_ID]: {
        statusCode: 400,
        message: 'El id proporcionado no tiene un formato valido'
    },
    [ERROR_CODES.MOCK_GENERATION_ERROR]: {
        statusCode: 500,
        message: 'Error al generar o guardar los datos de prueba'
    },
    [ERROR_CODES.ROUTE_NOT_FOUND]: {
        statusCode: 404,
        message: 'La ruta solicitada no existe'
    },
    [ERROR_CODES.DUPLICATE_KEY]: {
        statusCode: 409,
        message: 'Ya existe un registro con ese valor'
    },
    [ERROR_CODES.FILE_REQUIRED]: {
        statusCode: 400,
        message: 'Debe adjuntar un archivo'
    },
    [ERROR_CODES.INVALID_FILE_TYPE]: {
        statusCode: 400,
        message: 'El tipo de archivo no esta permitido'
    },
    [ERROR_CODES.FILE_TOO_LARGE]: {
        statusCode: 400,
        message: 'El archivo supera el tamaño maximo permitido (5MB)'
    },
    [ERROR_CODES.INVALID_DOCUMENT_TYPE]: {
        statusCode: 400,
        message: 'El tipo de documento indicado no es valido'
    },
    [ERROR_CODES.UPLOAD_ERROR]: {
        statusCode: 500,
        message: 'Error al procesar la carga del archivo'
    },
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
        statusCode: 500,
        message: 'Error interno del servidor'
    }
}