/* eslint-disable object-curly-newline */
const Card = require('../models/models').cardModel;
const { ValidationError, NotFoundError, UnauthorizedError, ServerError } = require('../errors/errors');

// ---

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link, owner = req.user.id } = req.body;

  if (!name || !link) { next(new ValidationError('No name or link')); }

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new ValidationError('One of fields doesnt pass validation'); }
      throw new ServerError('Server error');
    })
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((test) => {
      if (test.owner.toString() !== req.user.id) { throw new UnauthorizedError(); }
      Card.findByIdAndDelete(req.params.cardId)
        .then((card) => {
          if (!card) { throw new NotFoundError(); }
          res.status(200).send({ card });
        })
        .catch((err) => { if (err.name === 'NotFoundError') { throw new NotFoundError('This card doesnt exist'); } })
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new ValidationError('Invalid card id'); }
      if (err.name === 'UnauthorizedError') { throw new UnauthorizedError('Its not yours to delete'); }
      if (err.name === 'TypeError') { throw new NotFoundError('This card doesnt exist'); }
      throw new ServerError('Server error');
    })
    .catch((err) => next(err));
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user.id } }, { new: true })
    .then((card) => {
      if (!card) { throw new NotFoundError(); }
      res.status(201).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new ValidationError('Invalid card id'); }
      if (err.name === 'NotFoundError') { throw new NotFoundError('This card doesnt exist'); }
      throw new ServerError('Server error');
    })
    .catch((err) => next(err));
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user.id } }, { new: true })
    .then((card) => {
      if (!card) { throw new NotFoundError(); }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new ValidationError('Invalid card id'); }
      if (err.name === 'NotFoundError') { throw new NotFoundError('This card doesnt exist'); }
      throw new ServerError('Server error');
    })
    .catch((err) => next(err));
};

// ---

module.exports = { getCards, createCard, deleteCard, putLike, deleteLike };
