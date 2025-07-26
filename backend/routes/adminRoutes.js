const express = require('express');
const router = express.Router();
const { adminAuth, getAllHackathons, getAllCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/adminController');

// Admin login
router.post('/auth', adminAuth);

// Get all hackathons (admin)
router.get('/hackathons', getAllHackathons);

// Customer management
router.get('/customers', getAllCustomers);
router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

module.exports = router; 