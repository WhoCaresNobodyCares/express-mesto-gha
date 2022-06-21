/* eslint-disable object-curly-newline */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user').userModel;
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ServerError = require('../errors/ServerError');
const ConflictError = require('../errors/ConflictError');

// ---

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => res.status(200).send(user))
    .catch(() => next(new ServerError('Server error')));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) { throw new NotFoundError(); }
      res.status(200).send(user);
    })
    .catch((err) => {
      switch (err.name) {
        case 'NotFoundError':
          next(new NotFoundError('User is not found'));
          break;
        default:
          next(new ServerError('Server error'));
      }
    });
};

// ---

const signup = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) { next(new ValidationError('No email or password')); }

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, about, avatar, email, password: hash })
      .then(() => res.status(201).send({ data: { name, about, avatar, email } }))
      .catch((err) => {
        switch (err.name) {
          case 'MongoServerError':
            next(new ConflictError('This user is already registered, please signin'));
            break;
          default:
            next(new ServerError('Server error'));
        }
      });
  });
};

const signin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { throw new UnauthorizedError(); }
      return bcrypt.compare(password, user.password).then((match) => ({ match, user }));
    })
    .then(({ match, user }) => {
      if (!match) { throw new UnauthorizedError(); }
      const token = jwt.sign({ id: user._id }, 'test-key', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      switch (err.name) {
        case 'UnauthorizedError':
          next(new UnauthorizedError('Wrong email or password'));
          break;
        default:
          next(new ServerError('Server error'));
      }
    });
};

// ---

const changeUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  if (!name && !about) { next(new ValidationError('Insert name, about or both')); }

  User.findByIdAndUpdate(req.user.id, { name, about }, { runValidators: true, new: true })
    .then((user) => res.status(200).send(user))
    .catch(() => next(new ServerError('Server error')));
};

const changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user.id, { avatar }, { runValidators: true, new: true })
    .then((user) => res.status(200).send(user))
    .catch(() => next(new ServerError('Server error')));
};

// ---

module.exports = {
  getUsers,
  getUserById,
  getUserInfo,
  signup,
  signin,
  changeUserInfo,
  changeUserAvatar,
};
