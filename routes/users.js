// REQUIRE
const router = require('express').Router();
const {
  returnAllUsers,
  createUser,
  returnUserById,
  refreshUserInfo,
  refreshUserAvatar,
} = require('../controllers/users');

// ROUTE
router.get('/users', returnAllUsers);
router.post('/users', createUser);
router.get('/users/:userId', returnUserById);
router.patch('/users/me', refreshUserInfo);
router.patch('/users/me/avatar', refreshUserAvatar);

// EXPORT
module.exports = router;
