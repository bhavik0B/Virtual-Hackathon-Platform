const express = require('express');
const router = express.Router();
const { markHackathonWinner, getAllHackathons, createHackathon, updateHackathon, registerForHackathon, getHackathonById, checkUserRegistration } = require('../controllers/hackathonController');
const authenticate = require('../middleware/auth');

// Controller placeholders
router.get('/', getAllHackathons);
router.post('/', createHackathon);
router.get('/:id', getHackathonById);
router.put('/:id', updateHackathon);
router.delete('/:id', (req, res) => res.send('Delete hackathon'));
router.post('/:id/winner', authenticate, markHackathonWinner);
router.post('/register', authenticate, registerForHackathon);
router.get('/:hackathonId/check-registration', authenticate, checkUserRegistration);

module.exports = router; 