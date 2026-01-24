const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const ParkingSpot = require('./models/ParkingSpot');
const Booking = require('./models/Booking');

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Booking.deleteMany({});
    console.log('Cleared Bookings');

    await ParkingSpot.deleteMany({});
    console.log('Cleared Parking Spots');

    await User.deleteMany({});
    console.log('Cleared Users');

    console.log('Database cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
