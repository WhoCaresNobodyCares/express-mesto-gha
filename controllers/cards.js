// REQUIRE
const { Card } = require('../models/models');
const { ValidationError, NotFoundError, CastError } = require('../errors/errors');

// HANDLER
const handleDefaultError = (err, res) => {
  res.status(500).send({ message: err.message });
};

const handleCustomError = (err, res) => {
  res.status(err.statusCode).send({ message: err.message });
};

// CARD CONTROLLER
const returnAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => { handleDefaultError(err, res); });
};

const createCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => { if (err.name === 'ValidationError') { throw new ValidationError('Validation error'); } })
    .catch((err) => { handleCustomError(err, res); });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) { throw new NotFoundError(); }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new CastError('Cast error'); }
      if (err.name === 'NotFoundError') { throw new NotFoundError('Card not found'); }
    })
    .catch((err) => { handleCustomError(err, res); });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) { throw new NotFoundError(); }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new CastError('Cast error'); }
      if (err.name === 'NotFoundError') { throw new NotFoundError('Card not found'); }
    })
    .catch((err) => { handleCustomError(err, res); });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) { throw new NotFoundError(); }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new CastError('Cast error'); }
      if (err.name === 'NotFoundError') { throw new NotFoundError('Card not found'); }
    })
    .catch((err) => { handleCustomError(err, res); });
};

// EXPORT
module.exports = {
  returnAllCards,
  createCard,
  deleteCard,
  putLike,
  removeLike,
};
