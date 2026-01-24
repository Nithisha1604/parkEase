const Booking = require('../models/Booking');
const ParkingSpot = require('../models/ParkingSpot');
const User = require('../models/User');

const getISTDate = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [h, m] = timeStr.split(':').map(Number);
  // Create Date object assuming the input h,m is already IST
  // We calculate the UTC equivalent by subtracting 5.5 hours (330 mins)
  const date = new Date(Date.UTC(year, month - 1, day, h, m));
  date.setMinutes(date.getMinutes() - 330);
  return date;
};

const createBooking = async (req, res) => {
  try {
    const { parkingSpotId, date, time, amount } = req.body;
    const spot = await ParkingSpot.findById(parkingSpotId);
    
    if (!spot) return res.status(404).json({ message: 'Parking spot not found' });
    if (spot.availableSpots <= 0) return res.status(400).json({ message: 'No spots available' });

    const user = await User.findById(req.user.id);
    if (user.wallet < amount) return res.status(400).json({ message: 'Insufficient funds' });

    const [startStr, endStr] = time.split(' - ');
    const startTime = getISTDate(date, startStr);
    const endTime = getISTDate(date, endStr);

    const booking = new Booking({
      user: req.user.id,
      parkingSpot: parkingSpotId,
      date,
      time,
      amount,
      startTime,
      endTime
    });

    await booking.save();

    // Update spot availability
    spot.availableSpots -= 1;
    await spot.save();

    // Deduct from wallet
    user.wallet -= amount;
    
    // Add transaction record for driver
    user.transactions.push({
      type: 'Debit',
      amount: amount,
      description: `Booking for ${spot.name}`,
      date: new Date()
    });

    await user.save();

    // Credit owner's wallet
    const owner = await User.findById(spot.owner);
    if (owner) {
      owner.wallet += amount;
      owner.transactions.push({
        type: 'Credit',
        amount: amount,
        description: `Revenue from booking at ${spot.name}`,
        date: new Date()
      });
      await owner.save();
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('parkingSpot');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const spots = await ParkingSpot.find({ owner: req.user.id });
    const spotIds = spots.map(s => s._id);
    const bookings = await Booking.find({ parkingSpot: { $in: spotIds } }).populate('user').populate('parkingSpot');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    booking.status = 'Cancelled';
    await booking.save();

    const spot = await ParkingSpot.findById(booking.parkingSpot);
    spot.availableSpots += 1;
    await spot.save();

    // Refund driver
    const user = await User.findById(req.user.id);
    user.wallet += booking.amount;
    
    // Add transaction record for driver
    user.transactions.push({
      type: 'Credit',
      amount: booking.amount,
      description: `Refund for booking at ${spot.name}`,
      date: new Date()
    });

    await user.save();

    // Deduct from owner's wallet
    const owner = await User.findById(spot.owner);
    if (owner) {
      owner.wallet -= booking.amount;
      owner.transactions.push({
        type: 'Debit',
        amount: booking.amount,
        description: `Refund deducted for cancelled booking at ${spot.name}`,
        date: new Date()
      });
      await owner.save();
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('parkingSpot');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'Active') return res.status(400).json({ message: 'Booking is not active' });

    const now = new Date();
    const scheduledEndTime = new Date(booking.endTime);
    
    let overtimeHours = 0;
    let overtimeFee = 0;
    
    // Check if current time exceeds scheduled end time
    if (now > scheduledEndTime) {
      const overtimeMs = now - scheduledEndTime;
      overtimeHours = Math.ceil(overtimeMs / (1000 * 60 * 60));
      overtimeFee = overtimeHours * booking.parkingSpot.price;
    }

    const user = await User.findById(booking.user);
    const owner = await User.findById(booking.parkingSpot.owner);

    if (overtimeFee > 0) {
      if (user.wallet < overtimeFee) {
        // In a real scenario, you might mark it as 'Payment Pending' or block the user
        // For now, we will deduct even if it goes negative or just alert
        console.log(`Overtime fee of ${overtimeFee} for user ${user.name}`);
      }
      
      user.wallet -= overtimeFee;
      user.transactions.push({
        type: 'Debit',
        amount: overtimeFee,
        description: `Overtime fee (${overtimeHours} hrs) for ${booking.parkingSpot.name}`,
        date: new Date()
      });
      await user.save();

      if (owner) {
        owner.wallet += overtimeFee;
        owner.transactions.push({
          type: 'Credit',
          amount: overtimeFee,
          description: `Overtime revenue for ${booking.parkingSpot.name}`,
          date: new Date()
        });
        await owner.save();
      }
    }

    booking.status = 'Completed';
    booking.actualEndTime = now;
    booking.overtimeFee = overtimeFee;
    booking.totalAmount = booking.amount + overtimeFee;
    await booking.save();

    // Free up spot
    const spot = await ParkingSpot.findById(booking.parkingSpot._id);
    spot.availableSpots += 1;
    await spot.save();

    res.json({
      message: 'Booking completed',
      overtimeHours,
      overtimeFee,
      totalAmount: booking.totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getUserBookings, getOwnerBookings, cancelBooking, completeBooking };
