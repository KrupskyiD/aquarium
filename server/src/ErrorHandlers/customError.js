//for errors handling. This is for error, which we can predict. For e.g. User didn't fill out forms as it must be.
export class customError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >=400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
};