import cookieParser from 'cookie-parser';

import morgan from 'morgan';
import helmet from 'helmet';

import express, { Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import 'express-async-errors';

import BaseRouter from './routes';
import logger from '@shared/logger';
import Db from './services/Db';


// Init express
const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Connect to MongoDB
const db = new Db(process.env.MONGODB_URI);
db.connect();

// Add APIs
app.use('/', BaseRouter);

// Export express instance
export default app;
