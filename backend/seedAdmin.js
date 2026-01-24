const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clean any existing user with this email just in case
    await User.deleteOne({ email: 'Admin@gmail.com' });

    const admin = new User({
      name: 'System Admin',
      email: 'Admin@gmail.com',
      password: 'Admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Username: Admin@gmail.com');
    console.log('Password: Admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
