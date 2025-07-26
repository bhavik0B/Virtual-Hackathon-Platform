const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs
  inviteCode: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{ type: String }],
  maxMembers: { type: Number, default: 5 },
  hackathonsParticipated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' }], // Array of hackathon IDs
}, { timestamps: true });

// Custom validator to ensure members.length <= maxMembers
teamSchema.pre('save', function(next) {
  if (this.members.length > this.maxMembers) {
    return next(new Error('Team members exceed maxMembers'));
  }
  next();
});

// Drop the unique index on name field if it exists
const Team = mongoose.model('Team', teamSchema);


module.exports = Team;