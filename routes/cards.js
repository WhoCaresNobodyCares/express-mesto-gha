// REQUIRE
const router = require('express').Router();
const {
  returnAllCards, createCard, deleteCard, putLike, removeLike,
} = require('../controllers/cards');

// ROUTE
router.get('/cards', returnAllCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', putLike);
router.delete('/cards/:cardId/likes', removeLike);

// EXPORT
module.exports = router;
