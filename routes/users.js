// REQUIRE
const router = require('express').Router();
const { returnAllUsers, returnUserById, createUser } = require('../controllers/users');

// ROUTES
router.get('/users', returnAllUsers);
router.get('/users/:userId', returnUserById);
router.post('/users', createUser);

// EXPORTS
module.exports = router;
