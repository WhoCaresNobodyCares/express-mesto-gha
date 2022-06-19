const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/errors');

// ---

const auth = (req, res, next) => {
  if (!req.headers.authorization) { next(new UnauthorizedError('Empty authorization token')); }

  let payload;

  try {
    payload = jwt.verify(req.headers.authorization, 'test-key');
  } catch (err) {
    next(new UnauthorizedError('Wrong authorization token'));
  }

  req.user = payload;
  next();
};

// ---

module.exports = auth;
