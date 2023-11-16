const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const miningDataRoute = require('./routes/miningDataRoutes');
const analysisRoute = require('./routes/analysisRoutes');

const {
  createUser,
  authenticateToken
} = require('./controllers/authController');
const {
  batchInsertMiningHardwareData
} = require('./controllers/miningDataController');
const app = express();

const dotenv = require('dotenv');
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(cors());
dotenv.config({ path: './config.env' });

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cookieParser());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// 3) ROUTES

app.use('/api/v1/users', userRouter);
app.use('/api/v1/hardwares', authenticateToken, miningDataRoute);
app.use('/api/v1/analysis', authenticateToken, analysisRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
// initialize admin user and password
createUser('dmg', '123456');
// initialize mining hardware data
batchInsertMiningHardwareData(
  './dev-data/data/mining-hardware-data.json',
  'utf-8'
);
const port = process.env.PORT || 3001;

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  app.close(() => {
    process.exit(1);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
