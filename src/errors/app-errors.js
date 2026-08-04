import { ERROR_CODES } from './error-codes.js';
import { errorsDictionary } from './errors-dictionary.js';

class AppError extends Error { //error es una clase nativa de js
    constructor(code = ERROR_CODES.INTERNAL_SERVER_ERROR, customMessage, details) {
        const errorDefinition = errorsDictionary[code] || errorsDictionary[ERROR_CODES.INTERNAL_SERVER_ERROR];
        const resolvedCode = errorsDictionary[code] ? code : ERROR_CODES.INTERNAL_SERVER_ERROR;


        super(customMessage || errorDefinition.message);
        this.code = code;
        this.statusCode = errorDefinition.statusCode;
        this.details = details;
        this.isOperational = true; 

        Error.captureStackTrace(this, this.constructor); // Captura la traza de la pila para este error
    }

}

export default AppError;