const ParkingSpot = require('../models/ParkingSpot');
const Booking = require('../models/Booking');

const getParkingSpots = async (req, res) => {
  try {
    const spots = await ParkingSpot.find({ status: 'Active' });
    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerParkingSpots = async (req, res) => {
  try {
    const spots = await ParkingSpot.find({ owner: req.user.id });
    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createParkingSpot = async (req, res) => {
  try {
    const spot = new ParkingSpot({
      ...req.body,
      owner: req.user.id
    });
    await spot.save();
    res.status(201).json(spot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateParkingSpot = async (req, res) => {
  try {
    let spot = await ParkingSpot.findById(req.params.id);
    if (!spot) return res.status(404).json({ message: 'Spot not found' });
    
    if (spot.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    spot = await ParkingSpot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(spot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteParkingSpot = async (req, res) => {
  try {
    const spot = await ParkingSpot.findById(req.params.id);
    if (!spot) return res.status(404).json({ message: 'Spot not found' });

    if (spot.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await spot.deleteOne();
    res.json({ message: 'Spot removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerStats = async (req, res) => {
  try {
    const spots = await ParkingSpot.find({ owner: req.user.id });
    const spotIds = spots.map(s => s._id);
    
    const bookings = await Booking.find({ parkingSpot: { $in: spotIds } });
    
    const totalRevenue = bookings
      .filter(b => b.status === 'Completed')
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    const activeBookings = bookings.filter(b => b.status === 'Active').length;
    
    const totalSpots = spots.reduce((acc, curr) => acc + curr.totalSpots, 0);
    const occupiedSpots = spots.reduce((acc, curr) => acc + (curr.totalSpots - curr.availableSpots), 0);
    const utilization = totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0;

    res.json({
      totalSpots: spots.length,
      totalRevenue,
      activeBookings,
      utilization: `${utilization}%`,
      recentActivity: bookings.slice(-5).reverse() // Last 5 bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getParkingSpots,
  getOwnerParkingSpots,
  getOwnerStats,
  createParkingSpot,
  updateParkingSpot,
  deleteParkingSpot
};
