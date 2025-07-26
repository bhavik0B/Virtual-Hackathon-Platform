const express = require('express');
const router = express.Router();
const { markHackathonWinner, getAllHackathons, createHackathon, updateHackathon } = require('../controllers/hackathonController');
const authenticate = require('../middleware/auth');

// Controller placeholders
router.get('/', getAllHackathons);
router.post('/', createHackathon);
router.get('/:id', (req, res) => res.send('Get hackathon by ID'));
router.put('/:id', updateHackathon);
router.delete('/:id', (req, res) => res.send('Delete hackathon'));
router.post('/:id/winner', authenticate, markHackathonWinner);

module.exports = router; 