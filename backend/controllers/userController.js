// User controller functions placeholder
const User = require('../models/User');

// Get user profile by ID
async function getUserProfile(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-refreshToken'); // Exclude refreshToken
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
  }
}

// Get user's hackathon participation
async function getUserHackathons(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate('hackathonsParticipated', 'name description startDate endDate status')
      .select('-refreshToken');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hackathonsParticipated: user.hackathonsParticipated,
        hackathonsWon: user.hackathonsWon,
        projectsCompleted: user.projectsCompleted,
        teamsJoined: user.teamsJoined
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user hackathons', error: err.message });
  }
}

module.exports = { getUserProfile, getUserHackathons }; 