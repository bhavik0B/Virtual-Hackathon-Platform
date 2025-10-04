const Team = require('../models/Team');
const User = require('../models/User');
const nodemailer = require('nodemailer');

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

// Get single team by ID
async function getTeamById(req, res) {
  try {
    const { id } = req.params;
    const team = await Team.findById(id).populate('members', 'name email avatar');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ team });
  } catch (err) {
    console.error('Get team by ID error:', err);
    res.status(500).json({ message: 'Failed to fetch team', error: err.message });
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

// Leave a team
async function leaveTeam(req, res) {
  try {
    const userId = req.user.id; // Get from middleware
    const { id } = req.params; // Team ID from URL

    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    // Find the team
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is a member of the team
    if (!team.members.includes(userId)) {
      return res.status(400).json({ message: 'You are not a member of this team' });
    }

    // Check if user is the team creator
    if (team.createdBy.toString() === userId) {
      return res.status(400).json({
        message: 'Team creator cannot leave the team. Please delete the team instead or transfer ownership first.'
      });
    }

    // Remove user from team members
    team.members = team.members.filter(memberId => memberId.toString() !== userId);
    await team.save();

    // Decrement teamsJoined for the user
    await User.findByIdAndUpdate(userId, { $inc: { teamsJoined: -1 } });

    // Populate members for response
    await team.populate('members', 'name email avatar');

    res.json({
      message: 'Successfully left the team',
      team
    });
  } catch (err) {
    console.error('Leave team error:', err);
    res.status(500).json({ message: 'Failed to leave team', error: err.message });
  }
}

// Send team invite email
async function sendTeamInvite(req, res) {
  try {
    const inviterId = req.user.id;
    const { id } = req.params; // team id
    const { emails, message } = req.body;

    if (!inviterId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!id) {
      return res.status(400).json({ message: 'Team ID is required' });
    }

    // Normalize recipient list
    let recipients = [];
    if (Array.isArray(emails)) {
      recipients = emails.filter(Boolean).map(e => String(e).trim()).filter(e => e.length > 0);
    } else if (typeof emails === 'string') {
      recipients = emails.split(',').map(e => e.trim()).filter(e => e.length > 0);
    }

    if (!recipients.length) {
      return res.status(400).json({ message: 'At least one recipient email is required' });
    }

    // Fetch team and inviter
    const [team, inviter] = await Promise.all([
      Team.findById(id),
      User.findById(inviterId)
    ]);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Ensure inviter is a member of the team
    if (!team.members.map(m => String(m)).includes(String(inviterId))) {
      return res.status(403).json({ message: 'Only team members can send invites' });
    }

    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
    const joinUrl = `${frontendBaseUrl}/teams/join?inviteCode=${encodeURIComponent(team.inviteCode)}&teamId=${team._id}`;

    // Configure transporter from environment
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,       // or 587 with secure: false
      secure: true,    // true for port 465, false for port 587
      auth: {
        user: process.env.GMAIL_USER_EMAIL, // your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const fromAddress = inviter.email;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height:1.6;">
        <h2>You have been invited to join the team "${team.name}"</h2>
        <p>${message ? String(message).slice(0, 1000) : `${inviter?.name || inviter?.email || 'A teammate'} invited you to join their team.`}</p>
        <p><strong>Invite Code:</strong> ${team.inviteCode}</p>
        <p>
          <a href="${joinUrl}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Join Team</a>
        </p>
        <p>If the button does not work, copy and paste this URL into your browser:<br/>
          <a href="${joinUrl}">${joinUrl}</a>
        </p>
      </div>
    `;

    const mailOptions = {
      from: fromAddress,
      to: recipients.join(', '),
      subject: `Invitation to join team "${team.name}"`,
      text: `You have been invited to join the team "${team.name}"\n\nInvite code: ${team.inviteCode}\nJoin link: ${joinUrl}\n\n${message || ''}`,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Invites sent successfully', recipients });
  } catch (err) {
    console.error('Send team invite error:', err);
    return res.status(500).json({ message: 'Failed to send invites', error: err.message });
  }
}

module.exports = { createTeam, joinTeam, getTeamMembers, getAllTeams, searchTeamsByInviteCode, getTeamById, leaveTeam, sendTeamInvite };