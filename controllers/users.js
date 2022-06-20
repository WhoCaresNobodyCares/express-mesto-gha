/* eslint-disable object-curly-newline */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/models').userModel;
const { ValidationError, NotFoundError, UnauthorizedError, ConflictError, ServerError } = require('../errors/errors');

// ---

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) { throw new NotFoundError(); }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') { throw new NotFoundError('User is not found'); }
      if (err.name === 'CastError') { throw new ValidationError('Users id doesnt pass validation'); }
      throw new ServerError('Server error');
    })
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) { throw new NotFoundError(); }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') { throw new NotFoundError('User is not found'); }
      if (err.name === 'CastError') { throw new ValidationError('Users id doesnt pass validation'); }
      throw new ServerError('Server error');
    })
    .catch((err) => next(err));
};

// ---

const signup = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) { next(new ValidationError('No email or password')); }

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') { throw new ValidationError('One of fields doesnt pass validation'); }
        if (err.name === 'MongoServerError') { throw new ConflictError('This user is already registered, please signin'); }
        throw new ServerError('Server error');
      })
      .catch((err) => next(err));
  });
};

const signin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) { next(new ValidationError('No email or password')); }

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
      if (err.name === 'UnauthorizedError') { throw new UnauthorizedError('Wrong email or password'); }
      throw new ServerError('Server error');
    })
    .catch((err) => next(err));
};

// ---

const changeUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  if (!name && !about) { next(new ValidationError('Insert name, about or both')); }

  User.findByIdAndUpdate(req.user.id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) { throw new NotFoundError(); }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new ValidationError('One of fields doesnt pass validation'); }
      if (err.name === 'NotFoundError') { throw new NotFoundError('User is not found'); }
      throw new ServerError('Server error');
    })
    .catch((err) => next(err));
};

const changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  if (!avatar) { next(new ValidationError('Insert avatar')); }

  User.findByIdAndUpdate(req.user.id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) { throw new NotFoundError(); }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new ValidationError('One of fields doesnt pass validation'); }
      if (err.name === 'NotFoundError') { throw new NotFoundError('User is not found'); }
      throw new ServerError('Server error');
    })
    .catch((err) => next(err));
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
