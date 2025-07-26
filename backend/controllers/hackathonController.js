// Hackathon controller functions placeholder
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');
const Team = require('../models/Team');

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

// Register user/team for a hackathon
async function registerForHackathon(req, res) {
  try {
    console.log('=== HACKATHON REGISTRATION REQUEST ===');
    console.log('Request body:', req.body);
    console.log('User from request:', req.user);
    
    const { hackathonId, teamId, userId } = req.body;
    
    // Use authenticated user's ID if not provided in body
    const finalUserId = userId || req.user?.id;

    
    if (!hackathonId || !finalUserId) {
      return res.status(400).json({ message: 'Hackathon ID and User ID are required' });
    }

    // Check if hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Check if user exists
    const user = await User.findById(finalUserId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already registered for this hackathon
    if (user.hackathonsParticipated && user.hackathonsParticipated.includes(hackathonId)) {
      return res.status(400).json({ message: 'User is already registered for this hackathon' });
    }

    // If teamId is provided, validate team
    if (teamId) {
      const team = await Team.findById(teamId);

      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }

      // Check if user is a member of the team
      if (!team.members.includes(finalUserId)) {
        return res.status(400).json({ message: 'User is not a member of this team' });
      }

      // Check if team is already registered for this hackathon
      if (team.hackathonsParticipated && team.hackathonsParticipated.includes(hackathonId)) {
        return res.status(400).json({ message: 'Team is already registered for this hackathon' });
      }

      // Update team's hackathonsParticipated
      await Team.findByIdAndUpdate(teamId, {
        $addToSet: { hackathonsParticipated: hackathonId }
      });

      // Update hackathon's teams array
      await Hackathon.findByIdAndUpdate(hackathonId, {
        $addToSet: { teams: teamId }
      });
    }

    // Update user's hackathonsParticipated
    await User.findByIdAndUpdate(finalUserId, {
      $addToSet: { hackathonsParticipated: hackathonId }
    });

    // Update hackathon's participants array
    await Hackathon.findByIdAndUpdate(hackathonId, {
      $addToSet: { participants: finalUserId }
    });

    res.json({ 
      message: 'Successfully registered for hackathon',
      hackathonId,
      userId: finalUserId,
      teamId: teamId || null
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register for hackathon', error: err.message });
  }
}

// Get hackathon by ID
async function getHackathonById(req, res) {
  try {
    const { id } = req.params;
    const hackathon = await Hackathon.findById(id)
      .populate('participants', 'name email avatar')
      .populate('teams', 'name description members inviteCode')
      .populate('organizer', 'name email');
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    res.json({ hackathon });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hackathon', error: err.message });
  }
}

// Check if user is registered for a hackathon
async function checkUserRegistration(req, res) {
  try {
    const { hackathonId } = req.params;
    const userId = req.user?.id;
    
    if (!hackathonId || !userId) {
      return res.status(400).json({ message: 'Hackathon ID and User ID are required' });
    }

    // Check if hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already registered for this hackathon
    const isRegistered = user.hackathonsParticipated && user.hackathonsParticipated.includes(hackathonId);
    
    res.json({ 
      isRegistered,
      message: isRegistered ? 'User is already registered for this hackathon' : 'User is not registered for this hackathon'
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check registration status', error: err.message });
  }
}

module.exports = { markHackathonWinner, getAllHackathons, createHackathon, updateHackathon, registerForHackathon, getHackathonById, checkUserRegistration }; 