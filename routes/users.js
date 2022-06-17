// REQUIRE
const router = require('express').Router();
const {
  returnAllUsers,
  createUser,
  login,
  returnUserById,
  refreshUserInfo,
  refreshUserAvatar,
  getUserInfo,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

// ROUTE
router.post('/signin', login);
router.post('/signup', createUser);

router.get('/', auth, returnAllUsers);
router.get('/me', auth, getUserInfo);
router.get('/:userId', auth, returnUserById);
router.patch('/me', auth, refreshUserInfo);
router.patch('/me/avatar', auth, refreshUserAvatar);

// EXPORT
module.exports = router;
