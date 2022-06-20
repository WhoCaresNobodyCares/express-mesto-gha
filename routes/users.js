/* eslint-disable object-curly-newline */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUserById, getUserInfo, signup, signin, changeUserInfo, changeUserAvatar } = require('../controllers/users');
const auth = require('../middlewares/auth');

// ---

router.get('/users/', auth, getUsers);
router.get('/users/me', auth, getUserInfo);
router.get('/users/:userId', auth, getUserById);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
  }),
}), signup);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
  }),
}), signin);

router.patch('/users/me', auth, changeUserInfo);
router.patch('/users/me/avatar', auth, changeUserAvatar);

// ---

module.exports = router;
