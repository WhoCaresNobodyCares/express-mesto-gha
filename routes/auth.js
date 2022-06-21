const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { signup, signin } = require('../controllers/users');

// ---

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), signup);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), signin);

// ---

module.exports = router;
