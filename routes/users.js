/* eslint-disable object-curly-newline */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUserById, getUserInfo, changeUserInfo, changeUserAvatar } = require('../controllers/users');
const auth = require('../middlewares/auth');

// ---

router.get('/', auth, getUsers);
router.get('/me', auth, getUserInfo);

router.get('/:userId', celebrate({
  params: {
    userId: Joi.string().length(24).hex().required(),
  },
}), auth, getUserById);

router.patch('/me', celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  },
}), auth, changeUserInfo);

router.patch('/me/avatar', celebrate({
  body: {
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/),
  },
}), auth, changeUserAvatar);

// ---

module.exports = router;
