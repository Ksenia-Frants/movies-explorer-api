require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { limiter, dataBaseURL } = require('./utils/config');
const router = require('./routes');
const errorHandler = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DATABASE_URL, NODE_ENV } = process.env;

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : dataBaseURL, {
  useNewUrlParser: true,
});

app.use(cors({
  origin: [
    'https://moviesexplorer.nomoredomains.rocks',
    'http://moviesexplorer.nomoredomains.rocks',
    'https://localhost:3001',
    'http://localhost:3001',
  ],
  credentials: true,
}));

app.use(helmet());
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
