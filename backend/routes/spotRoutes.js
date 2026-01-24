const express = require('express');
const {
  getParkingSpots,
  getOwnerParkingSpots,
  getOwnerStats,
  createParkingSpot,
  updateParkingSpot,
  deleteParkingSpot
} = require('../controllers/spotController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getParkingSpots);
router.get('/owner', protect, authorize('owner', 'admin'), getOwnerParkingSpots);
router.get('/stats', protect, authorize('owner', 'admin'), getOwnerStats);
router.post('/', protect, authorize('owner', 'admin'), createParkingSpot);
router.put('/:id', protect, authorize('owner', 'admin'), updateParkingSpot);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteParkingSpot);

module.exports = router;
