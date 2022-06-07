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
router.get('/', returnAllUsers);
router.post('/', createUser);
router.get('/:userId', returnUserById);
router.patch('/me', refreshUserInfo);
router.patch('/me/avatar', refreshUserAvatar);

// EXPORT
module.exports = router;
