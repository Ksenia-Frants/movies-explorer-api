const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

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
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки.',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм с указанным _id не найден.'));
      }

      if (movie.owner._id.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError('Нельзя удалять чужие фильмы.'));
      }

      return movie.findByIdAndRemove(req.params.movieId).then((movieData) => {
        res.send(movieData);
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при удалении фильма.',
          ),
        );
      } else {
        next(err);
      }
    });
};
