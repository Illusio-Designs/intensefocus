const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { profileUpload } = require('../constants/multer');
const { authenticateToken } = require('../middleware/auth');

router.get('/', userController.getUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// 📸 Profile Image Upload (requires auth)
router.post('/:id/upload-profile', authenticateToken, profileUpload, userController.uploadProfileImage);

module.exports = router;