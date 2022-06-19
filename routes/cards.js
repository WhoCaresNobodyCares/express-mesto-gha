/* eslint-disable object-curly-newline */
const router = require('express').Router();
const { getCards, createCard, deleteCard, putLike, deleteLike } = require('../controllers/cards');
const auth = require('../middlewares/auth');

// --- get

router.get('/', auth, getCards);

router.post('/', auth, createCard);
router.delete('/:cardId', auth, deleteCard);

router.put('/:cardId/likes', auth, putLike);
router.delete('/:cardId/likes', auth, deleteLike);

// ---

module.exports = router;
