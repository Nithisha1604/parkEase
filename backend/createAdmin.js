const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    const adminExists = await User.findOne({ email: 'Admin@gmail.com' });
    if (adminExists) {
      console.log('Admin user already exists.');
    } else {
      await User.create({
        name: 'Admin',
        email: 'Admin@gmail.com',
        password: 'Admin123',
        role: 'admin'
      });
      console.log('Admin user created successfully!');
    }
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
