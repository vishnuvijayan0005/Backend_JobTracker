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
app.use(cors({
  origin: 'http://localhost:3000', // Next.js frontend
  credentials: true
}));
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
const allowedOrigins = [
  "http://localhost:3000",           // for local dev
  "https://frontend-job-tracker-ar8ytpjpq.vercel.app/" // production frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // allow cookies
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
