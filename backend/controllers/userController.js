const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);
    user.wallet += amount;
    
    // Add transaction record
    user.transactions.push({
      type: 'Credit',
      amount: amount,
      description: 'Added funds to wallet',
      date: new Date()
    });
    
    await user.save();
    res.json({ wallet: user.wallet, transactions: user.transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.location = req.body.location || user.location;
      
      if (req.body.vehicles) {
        user.vehicles = req.body.vehicles;
        user.markModified('vehicles');
      }

      if (req.body.paymentMethods) {
        user.paymentMethods = req.body.paymentMethods;
        user.markModified('paymentMethods');
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        wallet: updatedUser.wallet,
        phone: updatedUser.phone,
        location: updatedUser.location,
        vehicles: updatedUser.vehicles,
        paymentMethods: updatedUser.paymentMethods,
        transactions: updatedUser.transactions,
        favorites: updatedUser.favorites,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const { spotId } = req.body;
    const user = await User.findById(req.user.id);
    
    const index = user.favorites.indexOf(spotId);
    if (index === -1) {
      user.favorites.push(spotId);
    } else {
      user.favorites.splice(index, 1);
    }
    
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, addMoney, updateUserProfile, toggleFavorite, getFavorites };
