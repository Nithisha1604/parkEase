const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vehicleSchema = new mongoose.Schema({
  model: String,
  plateNumber: String,
  color: String,
  isDefault: { type: Boolean, default: false }
});

const paymentMethodSchema = new mongoose.Schema({
  cardType: String,
  last4: String,
  expiry: String,
  isDefault: { type: Boolean, default: false }
});

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['Credit', 'Debit'], required: true },
  amount: { type: Number, required: true },
  description: String,
  status: { type: String, default: 'Completed' },
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.googleId; } },
  googleId: { type: String },
  role: { type: String, enum: ['driver', 'owner', 'admin'], default: 'driver' },
  wallet: { type: Number, default: 0 },
  phone: { type: String },
  location: { type: String },
  vehicles: [vehicleSchema],
  paymentMethods: [paymentMethodSchema],
  transactions: [transactionSchema],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot' }],
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
