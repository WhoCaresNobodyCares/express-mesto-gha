const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthorizedError('Empty authorization header');
  }

  let payload;

  try {
    payload = jwt.verify(authorization, 'test-secret-key');
  } catch (err) {
    throw new UnauthorizedError('Authorization header doesnt match');
  }

  req.user = payload;
  next();
};

module.exports = {
  auth,
};
