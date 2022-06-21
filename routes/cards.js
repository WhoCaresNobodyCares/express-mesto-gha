/* eslint-disable object-curly-newline */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, createCard, deleteCard, putLike, deleteLike } = require('../controllers/cards');
const auth = require('../middlewares/auth');

// --- get

router.get('/', auth, getCards);

router.post('/', celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    link: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/),
  },
}), auth, createCard);

router.delete('/:cardId', celebrate({
  params: {
    cardId: Joi.string().length(24).hex().required(),
  },
}), auth, deleteCard);

router.put('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().length(24).hex().required(),
  },
}), auth, putLike);

router.delete('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().length(24).hex().required(),
  },
}), auth, deleteLike);

// ---

module.exports = router;
