const router = require('express').Router();

const {
  updateUser,
  getMyUser,
} = require('../controllers/users');

const {
  validateUpdateUser,
} = require('../middlewares/validation');

router.get('/me', getMyUser);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
