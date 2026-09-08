import { ERROR_CODES } from './error-codes.js';
import { errorsDictionary } from './errors-dictionary.js';

class AppError extends Error {
    constructor(code = ERROR_CODES.INTERNAL_SERVER_ERROR, customMessage, details) {
        const errorDefinition = errorsDictionary[code] || errorsDictionary[ERROR_CODES.INTERNAL_SERVER_ERROR];
        const resolvedCode = errorsDictionary[code] ? code : ERROR_CODES.INTERNAL_SERVER_ERROR;


        super(customMessage || errorDefinition.message);
        this.code = resolvedCode;
        this.statusCode = errorDefinition.statusCode;
        this.details = details;
        this.isOperational = true; 

        Error.captureStackTrace(this, this.constructor); 
    }

}

export default AppError;