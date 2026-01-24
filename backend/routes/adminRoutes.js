const express = require('express');
const { getAdminStats, getAllTransactions, getPendingSpots, approveSpot, rejectSpot, getAllUsers, deleteUser, getAllSpots } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/stats', protect, admin, getAdminStats);
router.get('/transactions', protect, admin, getAllTransactions);
router.get('/pending-spots', protect, admin, getPendingSpots);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/spots', protect, admin, getAllSpots);
router.put('/spots/:id/approve', protect, admin, approveSpot);
router.put('/spots/:id/reject', protect, admin, rejectSpot);

module.exports = router;
