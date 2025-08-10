const express = require('express');
const router = express.Router();
const { createTeam, joinTeam, getTeamMembers, getAllTeams, searchTeamsByInviteCode, getTeamById, leaveTeam } = require('../controllers/teamController');
const authenticate = require('../middleware/auth');

router.post('/', authenticate, (req, res, next) => {
  console.log('Create team request:', req.body, req.user);
  createTeam(req, res, next);
});
router.post('/join', authenticate, joinTeam);
router.post('/:id/leave', authenticate, leaveTeam); // Leave team
router.get('/search', searchTeamsByInviteCode); // Search teams by invite code
router.get('/:id', getTeamById); // Get single team by ID
router.get('/:id/members', authenticate, getTeamMembers);
router.get('/', getAllTeams); // Public route to get all teams

module.exports = router; 