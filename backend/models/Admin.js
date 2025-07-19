const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  role: { 
    type: String, 
    enum: ['superadmin', 'event_manager', 'support', 'reviewer'], 
    default: 'event_manager' 
  },
  permissions: [{ type: String }],
  assignedHackathons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);