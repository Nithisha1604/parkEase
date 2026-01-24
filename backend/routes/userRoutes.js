const express = require('express');
const { getUserProfile, addMoney, updateUserProfile, toggleFavorite, getFavorites } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/add-money', protect, addMoney);
router.get('/favorites', protect, getFavorites);
router.post('/favorites/toggle', protect, toggleFavorite);

module.exports = router;
