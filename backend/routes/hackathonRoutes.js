const express = require('express');
const router = express.Router();

// Controller placeholders
router.get('/', (req, res) => res.send('Get all hackathons'));
router.post('/', (req, res) => res.send('Create hackathon'));
router.get('/:id', (req, res) => res.send('Get hackathon by ID'));
router.put('/:id', (req, res) => res.send('Update hackathon'));
router.delete('/:id', (req, res) => res.send('Delete hackathon'));

module.exports = router; 