const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');

// Public routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Protected route
router.get('/me', protect, authController.getMe);

router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
module.exports = router;