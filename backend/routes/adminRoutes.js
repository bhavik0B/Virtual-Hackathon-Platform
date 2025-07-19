const express = require('express');
const router = express.Router();
const { adminAuth } = require('../controllers/adminController');

// Admin login
router.post('/auth', adminAuth);

module.exports = router; 