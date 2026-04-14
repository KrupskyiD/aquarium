import { customError } from "./customError.js";

//This mode is for getting all infromation about error and anything else that can help developers. Uses in development mode

const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    })
}

//this error hanlder uses for catching invalid IDs. But I don't know how it's named in postgreSQL this type of erros. Later uncomment
/**
 * const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value} !`;
    return new customError(msg, 400);
} */

//it uses in production. Customers shouldn't know a lot of info about errors as developers. Its for security

const prodErrors = (res, error) => {
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        })
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Try again later.'
        })
    }
}


//exporting our handlers

export const globalErrorHandler = (error, req, res, next) =>{
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    //This part checks, which mode is installed in .env
    if(process.env.NODE_ENV === 'development'){
        devErrors(res, error);
    } else if(process.env.NODE_ENV === 'production') {
    //if(error.name === 'CastError') error = castErrorHandler(error);
    prodErrors(res, error);
}
}