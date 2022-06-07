// REQUIRE
const { User } = require('../models/models');
const { ValidationError, NotFoundError, CastError } = require('../errors/errors');

// HANDLER
const handleDefaultError = (err, res) => {
  res.status(500).send({ message: err.message });
};

const handleCustomError = (err, res) => {
  res.status(err.statusCode).send({ message: err.message });
};

// USER CONTROLLER
const returnAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => { handleDefaultError(err, res); });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => { res.send(user); })
    .catch((err) => { if (err.name === 'ValidationError') { throw new ValidationError('Validation error'); } })
    .catch((err) => { handleCustomError(err, res); });
};

const returnUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) { throw new NotFoundError(); }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new CastError('Cast error'); }
      if (err.name === 'NotFoundError') { throw new NotFoundError('User not found'); }
    })
    .catch((err) => { handleCustomError(err, res); });
};

const refreshUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => { if (err.name === 'ValidationError') { throw new ValidationError('ValidationError'); } })
    .catch((err) => { handleCustomError(err, res); });
};

const refreshUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => { if (err.name === 'ValidationError') { throw new ValidationError('ValidationError'); } })
    .catch((err) => { handleCustomError(err, res); });
};

// EXPORT
module.exports = {
  returnAllUsers,
  createUser,
  returnUserById,
  refreshUserInfo,
  refreshUserAvatar,
};
