const router = require('express').Router();
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

const {
  validateCreateMovie,
  validateWithMovieId,
} = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateWithMovieId, deleteMovie);

module.exports = router;
