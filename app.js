import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';

import superadminRouter from './routes/superadmin.js'
import companyRouter from './routes/companyadmin.js'
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js'

import dbConnect from './config/db.js';
import cors from 'cors';


const app = express();

/* __dirname fix for ES modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: [
     "http://localhost:3000",
    "https://frontend-job-tracker.vercel.app",
   
  ],
  credentials: true
}));
app.use('/companyadmin', companyRouter);
app.use('/user', usersRouter);
app.use('/superadmin',superadminRouter)
app.use('/auth',authRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});
dbConnect();
// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

export default app;
