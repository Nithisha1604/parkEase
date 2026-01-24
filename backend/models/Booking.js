const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parkingSpot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active' },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  actualEndTime: { type: Date },
  overtimeFee: { type: Number, default: 0 },
  totalAmount: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
