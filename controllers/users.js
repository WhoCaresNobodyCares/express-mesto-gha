// REQUIRE
const { User } = require('../models/models');

// USER CONTROLLERS
const returnAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err }));
};

const returnUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err }));
};

// EXPORTS
module.exports = {
  returnAllUsers,
  returnUserById,
  createUser,
};
