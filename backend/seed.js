const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const ParkingSpot = require('./models/ParkingSpot');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await ParkingSpot.deleteMany({});

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@parkmate.com',
      password: 'password123',
      role: 'admin'
    });

    const owner = await User.create({
      name: 'Owner User',
      email: 'owner@parkmate.com',
      password: 'password123',
      role: 'owner'
    });

    const driver = await User.create({
      name: 'Driver User',
      email: 'driver@parkmate.com',
      password: 'password123',
      role: 'driver',
      wallet: 100
    });

    // Create parking spots
    await ParkingSpot.create([
      {
        owner: owner._id,
        name: "Neon Plaza Parking",
        location: "Downtown, Metro City",
        price: 5.50,
        distance: "0.8 km",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=400",
        availableSpots: 12,
        totalSpots: 50,
        type: "Indoor",
        amenities: ["CCTV", "EV Charging", "Disabled Access"]
      },
      {
        owner: owner._id,
        name: "Cyber Tower Garage",
        location: "Tech District",
        price: 3.20,
        distance: "1.2 km",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=400",
        availableSpots: 5,
        totalSpots: 30,
        type: "Underground",
        amenities: ["CCTV", "Valet"]
      }
    ]);

    console.log('Seed data created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
