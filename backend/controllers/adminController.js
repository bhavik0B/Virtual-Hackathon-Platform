const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// POST /api/admin/auth
async function adminAuth(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    // Find user by email or username (assuming email for now)
    const user = await User.findOne({ email: username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Check if user is an active admin
    const admin = await Admin.findOne({ user: user._id, isActive: true });
    if (!admin) {
      return res.status(401).json({ message: 'Not an active admin' });
    }
    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate tokens
    const accessTokenPayload = {
      id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: true,
      type: 'access'
    };
    const refreshTokenPayload = {
      id: user._id,
      type: 'refresh'
    };
    const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
    user.refreshToken = refreshToken;
    await user.save();
    return res.json({ user, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: 'Admin login failed', error: err.message });
  }
}

module.exports = { adminAuth }; 