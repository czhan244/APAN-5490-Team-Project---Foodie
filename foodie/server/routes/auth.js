const express = require('express');
const router = express.Router();
const { register, login, getMe, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get current user
router.get('/me', protect, getMe);

// Delete account
router.delete('/delete-account', protect, deleteAccount);

module.exports = router; 