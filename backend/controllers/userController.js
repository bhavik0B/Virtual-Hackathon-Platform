// User controller functions placeholder
const User = require('../models/User');

// Get user profile by ID
async function getUserProfile(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-refreshToken'); // Exclude refreshToken
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
  }
}

module.exports = { getUserProfile }; 