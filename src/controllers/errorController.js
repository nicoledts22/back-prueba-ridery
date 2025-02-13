const AppError = require('./../utils/appError');

// Manejo de errores de validación de Mongoose
const handleCastErrorDB = (err, res) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err, res) => {
    const message = `Valor duplicado: ${err.keyValue.name}. Por favor use otro.`
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err, res) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Data Inválida. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// Manejo de errores de autenticación
const handleJWTError = (err, res) => new AppError('Token Inválido. Inicie sesión de nuevo!', 401);

const handleJWTExpiredError = (err, res) => new AppError('Tu sesión ha expirado! Acceda nuevamente.', 401);

// Manejo de errores en desarrollo
const sendErrorDev = (err, res) => {
    // Mostrar error completo
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Manejo de errores en producción
const sendErrorProd = (err, res) => {
    // Es un error operacional, enviar mensaje al usuario
    if (err.isOperational === true) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        // Error de programación o de otro tipo, no mostrar al cliente
    } else {
        // 1) Log error
        console.error('ERROR:', err);

        // 2) Enviar mensaje generico
        res.status(500).json({
            status: 'error',
            message: 'Algo ha salido mal!'
        });
    }

}

module.exports = (err, req, res, next) => {
    console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        console.log('dev error');
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        console.log('production error');
        let error = { ...err };

        if (err.name === 'CastError') error = handleCastErrorDB(error, res);
        if (err.code === 11000) error = handleDuplicateFieldsDB(error, res);
        if (err.name === 'ValidationError') error = handleValidationErrorDB(error, res);
        if (err.name === 'JsonWebTokenError') error = handleJWTError(error, res);
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(error, res);

        sendErrorProd(error, res);
    };

};
