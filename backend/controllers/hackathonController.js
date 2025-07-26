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

// Create a new hackathon
async function createHackathon(req, res) {
  try {
    const {
      name,
      description,
      customerId,
      customerName,
      organizer,
      startDate,
      endDate,
      registrationDeadline,
      maxTeamSize,
      prizes,
      status,
      eligibility,
      levels,
      problem_statements,
      contactEmail
    } = req.body;

    if (!name || !description || !startDate || !endDate || !registrationDeadline || !maxTeamSize || !problem_statements) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hackathon = await Hackathon.create({
      name,
      description,
      customerId,
      customerName,
      organizer,
      startDate,
      endDate,
      registrationDeadline,
      maxTeamSize,
      prizes,
      status,
      eligibility,
      levels,
      problem_statements,
      contactEmail
    });
    res.status(201).json({ message: 'Hackathon created', hackathon });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create hackathon', error: err.message });
  }
}

// Update an existing hackathon
async function updateHackathon(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      customerId,
      customerName,
      organizer,
      startDate,
      endDate,
      registrationDeadline,
      maxTeamSize,
      prizes,
      status,
      eligibility,
      levels,
      problem_statements,
      contactEmail
    } = req.body;

    if (!name || !description || !startDate || !endDate || !registrationDeadline || !maxTeamSize || !problem_statements) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hackathon = await Hackathon.findByIdAndUpdate(
      id,
      {
        name,
        description,
        customerId,
        customerName,
        organizer,
        startDate,
        endDate,
        registrationDeadline,
        maxTeamSize,
        prizes,
        status,
        eligibility,
        levels,
        problem_statements,
        contactEmail
      },
      { new: true }
    );
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.json({ message: 'Hackathon updated', hackathon });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update hackathon', error: err.message });
  }
}

module.exports = { markHackathonWinner, getAllHackathons, createHackathon, updateHackathon }; 