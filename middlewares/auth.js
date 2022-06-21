const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

// ---

const auth = (req, res, next) => {
  if (!req.headers.authorization) { next(new UnauthorizedError('Empty authorization token')); }

  const token = req.headers.authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'test-key');
  } catch (err) {
    next(new UnauthorizedError('Wrong authorization token'));
  }

  req.user = payload;

  next();
};

// ---

module.exports = auth;
