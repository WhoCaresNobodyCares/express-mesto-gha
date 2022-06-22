/* eslint-disable object-curly-newline */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, createCard, deleteCard, putLike, deleteLike } = require('../controllers/cards');

// --- get

router.get('/', getCards);

router.post('/', celebrate({
  body: {
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/).required(),
  },
}), createCard);

router.delete('/:cardId', celebrate({
  params: {
    cardId: Joi.string().length(24).hex().required(),
  },
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().length(24).hex().required(),
  },
}), putLike);

router.delete('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().length(24).hex().required(),
  },
}), deleteLike);

// ---

module.exports = router;
