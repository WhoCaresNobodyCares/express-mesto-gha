/* eslint-disable object-curly-newline */
const router = require('express').Router();
const { getCards, createCard, deleteCard, putLike, deleteLike } = require('../controllers/cards');
const auth = require('../middlewares/auth');

// --- get

router.get('/cards/', auth, getCards);

router.post('/cards/', auth, createCard);
router.delete('/cards/:cardId', auth, deleteCard);

router.put('/cards/:cardId/likes', auth, putLike);
router.delete('/cards/:cardId/likes', auth, deleteLike);

// ---

module.exports = router;
