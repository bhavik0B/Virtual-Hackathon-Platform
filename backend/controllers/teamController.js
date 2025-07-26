const Team = require('../models/Team');
const User = require('../models/User');

// Create a new team
async function createTeam(req, res) {
  try {
    console.log('Create team request:', req.body, req.user);
    const { name, description, skills, maxMembers, status } = req.body;
    const userId = req.user.id; // Always set by middleware
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    if (!name) return res.status(400).json({ message: 'Team name required' });

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Generate unique invite code
    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const team = await Team.create({
      name,
      description,
      skills,
      maxMembers,
      status,
      inviteCode,
      createdBy: userId,
      members: [userId], // Only userId, not an object
    });
    // Increment teamsJoined for the creator
    await User.findByIdAndUpdate(userId, { $inc: { teamsJoined: 1 } });
    res.status(201).json({ message: 'Team created', team });
  } catch (err) {
    console.error('Create team error:', err);
    res.status(500).json({ message: 'Failed to create team', error: err.message });
  }
}

// Join a team by invite code or team ID
async function joinTeam(req, res) {
  try {
    const userId = req.user.id; // Get from middleware
    const { teamId, inviteCode } = req.body;
    
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    
    let team;
    if (teamId) {
      team = await Team.findById(teamId);
    } else if (inviteCode) {
      team = await Team.findOne({ inviteCode });
    }
    
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    // Check if user is already a member (members is now array of user IDs)
    if (team.members.includes(userId)) {
      return res.status(400).json({ message: 'User already in team' });
    }
    
    if (team.members.length >= team.maxMembers) {
      console.log("Team members length", team.members.length);
      console.log("Team max members:", team.maxMembers);
      return res.status(400).json({ message: 'Team is full' });
    }
    
    // Add user ID to members array
    team.members.push(userId);
    await team.save();
    // Increment teamsJoined for the user
    await User.findByIdAndUpdate(userId, { $inc: { teamsJoined: 1 } });
    
    // Populate members for response
    await team.populate('members', 'name email avatar');
    
    res.json({ message: 'Joined team', team });
  } catch (err) {
    console.error('Join team error:', err);
    res.status(500).json({ message: 'Failed to join team', error: err.message });
  }
}

// Get live team members
async function getTeamMembers(req, res) {
  try {
    const { id } = req.params;
    const team = await Team.findById(id).populate('members', 'name email avatar');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json({ members: team.members });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get team members', error: err.message });
  }
}

// Get all teams
async function getAllTeams(req, res) {
  try {
    const teams = await Team.find().populate('members', 'name email');
    res.json({ teams });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch teams', error: err.message });
  }
}

// Search teams by invite code
async function searchTeamsByInviteCode(req, res) {
  try {
    const { inviteCode } = req.query;
    
    if (!inviteCode || inviteCode.trim() === '') {
      return res.status(400).json({ message: 'Invite code is required' });
    }
    
    // Search for teams with invite code (case-insensitive)
    const teams = await Team.find({
      inviteCode: { $regex: inviteCode.trim().toUpperCase(), $options: 'i' }
    }).populate('members', 'name email avatar');
    
    if (teams.length === 0) {
      return res.json({ 
        teams: [], 
        message: 'No teams found with this invite code' 
      });
    }
    
    res.json({ 
      teams, 
      message: `Found ${teams.length} team(s) with invite code "${inviteCode}"` 
    });
  } catch (err) {
    console.error('Search teams error:', err);
    res.status(500).json({ message: 'Failed to search teams', error: err.message });
  }
}

module.exports = { createTeam, joinTeam, getTeamMembers, getAllTeams, searchTeamsByInviteCode }; 