const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  name: { type: String },
  avatar: { type: String },
  bio: { type: String },
  location: { type: String },
  website: { type: String },
  github: { type: String },
  linkedin: { type: String },
  skills: [{ type: String }],
  interests: [{ type: String }],
  experience: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'beginner' },
  isAdmin: { type: Boolean, default: false },
  isMentor: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model('User', userSchema); 