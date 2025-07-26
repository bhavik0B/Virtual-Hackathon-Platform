require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Admin = require('./models/Admin');

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdmin() {
  await mongoose.connect(MONGODB_URI);

  const email = 'admin@example.com'; // Change as needed
  const password = 'pass@1234';   // Change as needed
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create User
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      firstName: 'Admin',
      lastName: 'User',
      name: 'Admin Example',
      password: hashedPassword,
      isAdmin: true
    });
  }

  // 2. Create Admin
  let admin = await Admin.findOne({ user: user._id });
  if (!admin) {
    admin = await Admin.create({
      user: user._id,
      role: 'superadmin',
      permissions: ['manage_users', 'manage_hackathons', 'view_reports', 'manage_teams'],
      isActive: true
    });
  }
  
  mongoose.disconnect();
}

createAdmin();