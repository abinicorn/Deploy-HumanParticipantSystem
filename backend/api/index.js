import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../src/config/swaggerConfig';
import authenticateToken from '../src/middlewares/authenticateToken';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Added cookieParser import

dotenv.config();

// Setup Express
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: 'https://human-participant-system-frontend.vercel.app', // Allow requests from this origin
    methods: 'GET,PUT,POST,DELETE', // Allow the specified methods
    allowedHeaders: 'Content-Type,Authorization', // Allow the specified headers
 }));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cookieParser()); // Added cookieParser

// Setup log4js
const log4js = require('../src/utils/log4js');

// app.use(authenticateToken);
import routes from '../src/routes/index.js';
app.use('/', routes);

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })
    .then(() => app.listen(port, () => log4js.info(`App server listening on port ${port}!`)));
