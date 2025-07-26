const express = require('express');
const router = express.Router();
const { submitProject } = require('../controllers/submissionController');
const authenticate = require('../middleware/auth');

// Controller placeholders
router.get('/', (req, res) => res.send('Get all submissions'));
router.post('/', authenticate, submitProject);
router.get('/:id', (req, res) => res.send('Get submission by ID'));
router.put('/:id', (req, res) => res.send('Update submission'));
router.delete('/:id', (req, res) => res.send('Delete submission'));
router.post('/:id/review', (req, res) => res.send('Review submission'));

module.exports = router; 