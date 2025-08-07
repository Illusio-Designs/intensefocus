const express = require('express');
const router = express.Router();
const msg91Controller = require('../controllers/msg91Controller');

// MSG91 OTP Verification Routes
router.post('/verify-token', msg91Controller.verifyAccessToken);
router.post('/send-otp', msg91Controller.sendOTP);
router.post('/verify-otp', msg91Controller.verifyOTP);
router.post('/retry-otp', msg91Controller.retryOTP);

module.exports = router; 