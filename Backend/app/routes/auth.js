const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration route (Direct - No OTP)
router.post('/register', authController.register);

// Login routes (MSG91 OTP required)
router.post('/login/msg91/config', authController.getMSG91Config);
router.post('/login/msg91/verify', authController.loginWithMSG91);

// Get available roles
router.get('/roles', authController.getAvailableRoles);

module.exports = router;
