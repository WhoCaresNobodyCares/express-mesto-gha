// REQUIRE
const router = require('express').Router();
const {
  returnAllCards,
  createCard,
  deleteCard,
  putLike,
  removeLike,
} = require('../controllers/cards');
const { auth } = require('../middlewares/auth');

// ROUTE
router.get('/', auth, returnAllCards);
router.post('/', auth, createCard);
router.delete('/:cardId', auth, deleteCard);
router.put('/:cardId/likes', auth, putLike);
router.delete('/:cardId/likes', auth, removeLike);

// EXPORT
module.exports = router;
