import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swaggerConfig';
import authenticateToken from './middlewares/authenticateToken';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Added cookieParser import

dotenv.config();

// Setup Express
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: 'https://human-participant-system-frontend.vercel.app',
    credentials: true,
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://human-participant-system-frontend.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true'); // Added this line
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cookieParser()); // Added cookieParser

// Setup log4js
const log4js = require('./utils/log4js');

// app.use(authenticateToken);
import routes from './routes/index.js';
app.use('/', routes);

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })
    .then(() => app.listen(port, () => log4js.info(`App server listening on port ${port}!`)));
