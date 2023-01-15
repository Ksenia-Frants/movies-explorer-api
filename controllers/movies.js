const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  INCORRECT_DATA_MOVIE_CREATE,
  NOT_FOUND_MOVIE,
  ANOTHER_FILM,
  INCORRECT_DATA_MOVIE_DELETE,
  VALIDATION_ERROR,
  CAST_ERROR,
} = require('../utils/constants');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        next(
          new BadRequestError(
            INCORRECT_DATA_MOVIE_CREATE,
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError(NOT_FOUND_MOVIE));
      }

      if (movie.owner._id.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError(ANOTHER_FILM));
      }

      return Movie.findByIdAndRemove(req.params.movieId).then((movieData) => {
        res.send(movieData);
      });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(
          new BadRequestError(
            INCORRECT_DATA_MOVIE_DELETE,
          ),
        );
      } else {
        next(err);
      }
    });
};
