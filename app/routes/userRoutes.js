const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { profileUpload } = require('../config/multer');

// 🔐 Authentication Routes (No auth required)
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logout);

// 👤 User Management Routes (Requires auth)
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/search', authenticateToken, userController.searchUsers);
router.get('/me', authenticateToken, userController.getCurrentUser);
router.get('/:id', authenticateToken, userController.getUserById);
router.post('/', authenticateToken, userController.createUser);
router.put('/:id', authenticateToken, userController.updateUser);

// 📸 Profile Image Upload (requires auth)
router.post('/:id/upload-profile', authenticateToken, profileUpload, userController.uploadProfileImage);

module.exports = router; 