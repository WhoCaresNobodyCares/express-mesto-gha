// REQUIRE
const router = require('express').Router();
const {
  returnAllCards,
  createCard,
  deleteCard,
  putLike,
  removeLike,
} = require('../controllers/cards');

// ROUTE
router.get('/', returnAllCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', removeLike);

// EXPORT
module.exports = router;
