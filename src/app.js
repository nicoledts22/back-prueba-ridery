const path = require('path');
const swaggerDocs = require('./utils/swagger');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');


// importar rutas
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const brandRouter = require('./routes/brandRoutes');
const modelRouter = require('./routes/modelRoutes');
const vehicleTypeRouter = require('./routes/vehicleTypeRoutes');
const vehicleRouter = require('./routes/vehicleRoutes');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

// iniciar express
const app = express();

// app.enable('trust proxy');

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.options('*', cors());


// Set security HTTP headers
app.use(helmet());


// development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
};

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(
//     hpp({
//         whitelist: [

//         ]
//     })
// );

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use(compression());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// routes
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/models', modelRouter);
app.use('/api/v1/vehicles', vehicleRouter);
app.use('/api/v1/vehicleTypes', vehicleTypeRouter);
app.use('/api/v1/users', authRouter);
app.use('/api/v1/users', userRouter);

// habilitar swagger
swaggerDocs(app);

app.all('*', (req, res, next) => {
    next(new AppError(`No se puede encontrar ${req.originalUrl} en este servidor`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
