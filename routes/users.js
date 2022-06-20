/* eslint-disable object-curly-newline */
const router = require('express').Router();
const { getUsers, getUserById, getUserInfo, signup, signin, changeUserInfo, changeUserAvatar } = require('../controllers/users');
const auth = require('../middlewares/auth');

// ---

router.get('/', auth, getUsers);
router.get('/me', auth, getUserInfo);
router.get('/:userId', auth, getUserById);

router.post('/signup', signup);
router.post('/signin', signin);

router.patch('/me', auth, changeUserInfo);
router.patch('/me/avatar', auth, changeUserAvatar);

// ---

module.exports = router;
