class ApiError extends Error {
    constructor(
        statusCode = 500,
        message = "Internal Server Error",
        errors = [],
        stack = ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.succes = false;
        if(stack){
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;