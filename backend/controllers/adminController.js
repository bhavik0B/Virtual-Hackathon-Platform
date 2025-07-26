const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Hackathon = require('../models/Hackathon');
const Customer = require('../models/Customer');

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

// Get all hackathons (for admin)
async function getAllHackathons(req, res) {
  try {
    const hackathons = await Hackathon.find();
    res.json({ hackathons });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hackathons', error: err.message });
  }
}

// Get all customers
async function getAllCustomers(req, res) {
  try {
    const customers = await Customer.find();
    res.json({ customers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers', error: err.message });
  }
}

// Create a customer
async function createCustomer(req, res) {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ message: 'Customer created', customer });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create customer', error: err.message });
  }
}

// Update a customer
async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Customer updated', customer });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update customer', error: err.message });
  }
}

// Delete a customer
async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    await Customer.findByIdAndDelete(id);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete customer', error: err.message });
  }
}

module.exports = {
  adminAuth,
  getAllHackathons,
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
}; 