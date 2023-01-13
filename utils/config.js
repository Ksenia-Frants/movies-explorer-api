const { NODE_ENV = 'development', JWT_SECRET } = process.env;
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const dataBaseURL = 'mongodb://localhost:27017/bitfilmsdb';

module.exports = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  limiter,
  dataBaseURL,
};
