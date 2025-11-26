const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Send OTP route
router.post('/send-otp', authController.sendOtp);

// Verify OTP route
router.post('/verify-otp', authController.verifyOtp);

// Logout route
router.post('/logout', authController.logout);

// Refresh token route
router.post('/refresh-token', authController.refreshToken);

router.post('/check-user', authController.checkUser);

router.post('/login', authController.login);

router.post('/register', authController.register);

module.exports = router;