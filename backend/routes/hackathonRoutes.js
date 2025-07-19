const express = require('express');
const router = express.Router();
const { markHackathonWinner, getAllHackathons } = require('../controllers/hackathonController');
const authenticate = require('../middleware/auth');

// Controller placeholders
router.get('/', getAllHackathons);
router.post('/', (req, res) => res.send('Create hackathon'));
router.get('/:id', (req, res) => res.send('Get hackathon by ID'));
router.put('/:id', (req, res) => res.send('Update hackathon'));
router.delete('/:id', (req, res) => res.send('Delete hackathon'));
router.post('/:id/winner', authenticate, markHackathonWinner);

module.exports = router; 