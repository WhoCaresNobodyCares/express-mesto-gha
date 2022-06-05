// REQUIRE
const router = require('express').Router();
const { returnAllCards, createCard, deleteCard } = require('../controllers/cards');

// ROUTES
router.get('/cards', returnAllCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);

// EXPORTS
module.exports = router;
