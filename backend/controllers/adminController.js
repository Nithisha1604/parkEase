const User = require('../models/User');
const ParkingSpot = require('../models/ParkingSpot');
const Booking = require('../models/Booking');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'driver' });
    const pendingSpots = await ParkingSpot.countDocuments({ status: 'Inactive' }); // Assuming Inactive means pending
    const bookings = await Booking.find({ status: 'Completed' });
    const totalVolume = bookings.reduce((acc, curr) => acc + curr.amount, 0);
    
    res.json({
      totalUsers,
      pendingSpots,
      totalVolume,
      reports: 0 // Mock for now
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const users = await User.find({}, 'name email transactions');
    let allTransactions = [];
    
    users.forEach(user => {
      user.transactions.forEach(tx => {
        allTransactions.push({
          ...tx.toObject(),
          userName: user.name,
          userEmail: user.email,
          userId: user._id
        });
      });
    });

    // Sort by date descending
    allTransactions.sort((a, b) => b.date - a.date);

    res.json(allTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingSpots = async (req, res) => {
  try {
    const spots = await ParkingSpot.find({ status: 'Inactive' }).populate('owner', 'name email');
    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveSpot = async (req, res) => {
  try {
    const spot = await ParkingSpot.findById(req.params.id);
    if (!spot) return res.status(404).json({ message: 'Spot not found' });
    spot.status = 'Active';
    await spot.save();
    res.json(spot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectSpot = async (req, res) => {
    try {
      const spot = await ParkingSpot.findById(req.params.id);
      if (!spot) return res.status(404).json({ message: 'Spot not found' });
      // For now just keep it Inactive or delete? Let's keep it Inactive.
      res.json({ message: 'Spot rejected' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // If the user is an owner, delete all their parking spots
    if (user.role === 'owner') {
      await ParkingSpot.deleteMany({ owner: user._id });
    }
    
    await user.deleteOne();
    res.json({ message: 'User deleted and associated spots removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSpots = async (req, res) => {
  try {
    const spots = await ParkingSpot.find().populate('owner', 'name email');
    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats, getAllTransactions, getPendingSpots, approveSpot, rejectSpot, getAllUsers, deleteUser, getAllSpots };
