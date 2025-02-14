const globalErrorHandler = (err, req, res, next) => {
    console.error('🔥 ERROR:', err); // Logs error in the console

    // Set a default status code if not provided
    const statusCode = err.statusCode || 500;
    const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    res.status(statusCode).json({
        status,
        message: err.message || "Something went wrong!",
    });
};

export default globalErrorHandler;
