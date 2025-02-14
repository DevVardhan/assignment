class AppError extends Error {
    constructor(errorMessage, statusCode) {
        // super method calls constructor for extended classes
        super(errorMessage);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

}

export default AppError ; 