/* eslint-disable object-curly-newline */
const Card = require('../models/card').cardModel;
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const RightsViolationError = require('../errors/RightsViolationError');

// ---

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link, owner = req.user.id } = req.body;

  if (!name || !link) { next(new ValidationError('No name or link')); }

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch(() => next(new ServerError('Server error')));
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((test) => {
      if (!test) { throw new NotFoundError(); }
      if (test.owner.toString() !== req.user.id) { throw new RightsViolationError(); }
      Card.findByIdAndDelete(req.params.cardId)
        .then((card) => res.status(200).send(card))
        .catch(() => next(new ServerError('Server error')));
    })
    .catch((err) => {
      switch (err.name) {
        case 'RightsViolationError':
          next(new RightsViolationError('Its not yours to delete'));
          break;
        case 'TypeError':
          next(new NotFoundError('This card doesnt exist'));
          break;
        case 'NotFoundError':
          next(new NotFoundError('There is no such card'));
          break;
        default:
          next(new ServerError('Server error'));
      }
    });
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user.id } }, { new: true })
    .then((card) => {
      if (!card) { throw new NotFoundError(); }
      res.status(201).send(card);
    })
    .catch((err) => {
      switch (err.name) {
        case 'NotFoundError':
          next(new NotFoundError('This card doesnt exist'));
          break;
        default:
          next(new ServerError('Server error'));
      }
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user.id } }, { new: true })
    .then((card) => {
      if (!card) { throw new NotFoundError(); }
      res.status(200).send(card);
    })
    .catch((err) => {
      switch (err.name) {
        case 'NotFoundError':
          next(new NotFoundError('This card doesnt exist'));
          break;
        default:
          next(new ServerError('Server error'));
      }
    });
};

// ---

module.exports = { getCards, createCard, deleteCard, putLike, deleteLike };
