const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./src/app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
    console.log('Conexión exitosa con la base de datos...');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server en puerto ${port}...`)
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated!');
    });
});
