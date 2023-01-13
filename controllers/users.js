const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const {
  INCORRECT_DATA_USER_CREATE,
  EMAIL_ALREADY_EXISTS,
  NOT_FOUND_USER,
  INCORRECT_DATA_USER_GET,
  INCORRECT_DATA_PROFILE_UPDATE,
  AUTHORIZATION_REQUIRED,
  VALIDATION_ERROR,
  CAST_ERROR,
} = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send(user.toJSON()))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        next(
          new BadRequestError(
            INCORRECT_DATA_USER_CREATE,
          ),
        );
      } else if (err.code === 11000) {
        next(new ConflictError(EMAIL_ALREADY_EXISTS));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(
          new NotFoundError(NOT_FOUND_USER),
        );
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(
          new BadRequestError(
            INCORRECT_DATA_USER_GET,
          ),
        );
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return next(
          new NotFoundError(NOT_FOUND_USER),
        );
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        next(
          new BadRequestError(
            INCORRECT_DATA_PROFILE_UPDATE,
          ),
        );
      } else if (err.code === 11000) {
        next(new ConflictError(EMAIL_ALREADY_EXISTS));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)

    .then((user) => {
      if (!user) {
        return next(
          new UnauthorizedError(AUTHORIZATION_REQUIRED),
        );
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      return res.send({ token });
    })
    .catch(next);
};
