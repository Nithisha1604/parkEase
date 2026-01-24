const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.set('dbConnected', true);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    app.set('dbConnected', false);
  });

// Middleware to check DB connection
app.use((req, res, next) => {
  if (!app.get('dbConnected') && req.path.startsWith('/api/')) {
    return res.status(503).json({ 
      message: 'Database connection is not established. Please check your MONGODB_URI in .env' 
    });
  }
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const spotRoutes = require('./routes/spotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/spots', spotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frountend_final/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frountend_final', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('ParkMate API is running...');
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
