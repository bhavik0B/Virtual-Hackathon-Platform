const express = require('express');
const router = express.Router();
const { saveFile, loadFile, listFiles, deleteFile, createDirectory } = require('../controllers/fileController');
const authenticate = require('../middleware/auth');

// File management routes
router.post('/save', authenticate, saveFile);
router.get('/team/:teamId/files', authenticate, listFiles);
router.get('/team/:teamId/file/:fileName', authenticate, loadFile);
router.delete('/team/:teamId/file/:fileName', authenticate, deleteFile);
router.post('/directory', authenticate, createDirectory);

module.exports = router;
