const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, // Reference to Customer
  customerName: { type: String },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrationDeadline: { type: Date, required: true },
  maxTeamSize: { type: Number, required: true },
  prizes: [{ type: String }],
  status: { type: String, enum: ['upcoming', 'active', 'completed', 'cancelled'], default: 'upcoming' },
  eligibility: { type: String, enum: ['students', 'professionals', 'both'], default: 'both' },
  levels: [{
    name: { type: String, required: true },
    deadline: { type: Date, required: true },
  }],
  problem_statements: [{
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
  }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
  winners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  contactEmail: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Hackathon', hackathonSchema); 