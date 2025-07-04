const express = require('express');
const router = express.Router();

// Controller placeholders
router.get('/', (req, res) => res.send('Get all submissions'));
router.post('/', (req, res) => res.send('Submit project'));
router.get('/:id', (req, res) => res.send('Get submission by ID'));
router.put('/:id', (req, res) => res.send('Update submission'));
router.delete('/:id', (req, res) => res.send('Delete submission'));
router.post('/:id/review', (req, res) => res.send('Review submission'));

module.exports = router; 