const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  distance: { type: String },
  rating: { type: Number, default: 0 },
  image: { type: String },
  availableSpots: { type: Number, required: true },
  totalSpots: { type: Number, required: true },
  type: { type: String, enum: ['Indoor', 'Underground', 'Open Space'], required: true },
  amenities: [{ type: String }],
  liveFeedURL: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ParkingSpot', parkingSpotSchema);
