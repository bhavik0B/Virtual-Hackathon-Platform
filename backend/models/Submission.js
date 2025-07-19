const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  repositoryLink: {
    type: String,
    required: true,
  },
  liveDemoLink: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['Submitted', 'Judged', 'Approved', 'Rejected'],
    default: 'Submitted',
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  awardWon: {
    type: Boolean,
    default: false,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  hackathon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team', // Or 'User', if it's a solo submission
    required: true,
  }
});

module.exports = mongoose.model('Submission', submissionSchema);
