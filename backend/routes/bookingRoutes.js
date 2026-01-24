const express = require('express');
const { createBooking, getUserBookings, getOwnerBookings, cancelBooking, completeBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/owner', protect, getOwnerBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/complete', protect, completeBooking);

module.exports = router;
