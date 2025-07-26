const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
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
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  hackathonsWon: { type: Number, default: 0 },
  projectsCompleted: { type: Number, default: 0 },
  teamsJoined: { type: Number, default: 0 },
  hackathonsParticipated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' }], // Array of hackathon IDs
}, { strict: false });

module.exports = mongoose.model('User', userSchema); 