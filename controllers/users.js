// REQUIRE
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

const {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  CastError,
  ServerError,
} = require('../errors/errors');

// HANDLER
const handleDefaultError = (err, res) => {
  res.status(500).send({ message: err.message });
};

const handleCustomError = (err, res) => {
  res.status(err.statusCode).send({ message: err.message });
};

// USER CONTROLLER

const getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError('Cast error');
      }
      if (err.name === 'NotFoundError') {
        throw new NotFoundError('User not found');
      }
      throw new ServerError('Server error');
    })
    .catch((err) => {
      handleCustomError(err, res);
    });
};

const returnAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      handleDefaultError(err, res);
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          res.send(user);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new ValidationError('Validation error');
          }
          throw new ServerError('Server error');
        })
        .catch((err) => {
          handleCustomError(err, res);
        });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      return bcrypt.compare(password, user.password).then((match) => ({ match, user }));
    })
    .then(({ match, user }) => {
      if (!match) {
        throw new UnauthorizedError();
      }
      const token = jwt.sign({ _id: user._id }, 'test-secret-key', { expiresIn: '7d' });
      res.send(token);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        throw new NotFoundError('User not found');
      }
      if (err.name === 'UnauthorizedError') {
        throw new UnauthorizedError('Wrong email or password ');
      }
      throw new ServerError('Server error');
    })
    .catch((err) => {
      handleCustomError(err, res);
    });
};

const returnUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError('Cast error');
      }
      if (err.name === 'NotFoundError') {
        throw new NotFoundError('User not found');
      }
      throw new ServerError('Server error');
    })
    .catch((err) => {
      handleCustomError(err, res);
    });
};

const refreshUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('ValidationError');
      }
      if (err.name === 'NotFoundError') {
        throw new NotFoundError('User not found');
      }
      if (err.name === 'CastError') {
        throw new CastError('Cast error');
      }
      throw new ServerError('Server error');
    })
    .catch((err) => {
      handleCustomError(err, res);
    });
};

const refreshUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('ValidationError');
      }
      if (err.name === 'NotFoundError') {
        throw new NotFoundError('User not found');
      }
      if (err.name === 'CastError') {
        throw new CastError('Cast error');
      }
      throw new ServerError('Server error');
    })
    .catch((err) => {
      handleCustomError(err, res);
    });
};

// EXPORT
module.exports = {
  returnAllUsers,
  createUser,
  returnUserById,
  refreshUserInfo,
  refreshUserAvatar,
  login,
  getUserInfo,
};
