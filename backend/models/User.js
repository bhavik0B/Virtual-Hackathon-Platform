const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth users
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  name: { type: String },
  avatar: { type: String },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  skills: [{ type: String }],
  interests: [{ type: String }],
  experience: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'beginner' },
  isAdmin: { type: Boolean, default: false },
  isMentor: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model('User', userSchema); 