// Hackathon controller functions placeholder
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');

// Mark a user as winner of a hackathon
async function markHackathonWinner(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    await User.findByIdAndUpdate(userId, { $inc: { hackathonsWon: 1 } });
    res.status(200).json({ message: 'User marked as hackathon winner' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark winner', error: err.message });
  }
}

// Get all hackathons
async function getAllHackathons(req, res) {
  try {
    const hackathons = await Hackathon.find();
    res.json({ hackathons });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hackathons', error: err.message });
  }
}

module.exports = { markHackathonWinner, getAllHackathons }; 