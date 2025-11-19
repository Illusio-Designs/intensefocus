import express, { Router } from 'express';

const userRouter: Router = express.Router();

// 🔐 Authentication Routes (No auth required)
// userRouter.post('/register', userController.registerUser);
// userRouter.post('/login', userController.loginUser);
// userRouter.post('/logout', userController.logout);

// // 👤 User Management Routes (Requires auth)
// userRouter.get('/', authenticateToken, userController.getAllUsers);
// userRouter.get('/search', authenticateToken, userController.searchUsers);
// userRouter.get('/me', authenticateToken, userController.getCurrentUser);
// userRouter.get('/:id', authenticateToken, userController.getUserById);
// userRouter.post('/', authenticateToken, userController.createUser);
// userRouter.put('/:id', authenticateToken, userController.updateUser);

// 📸 Profile Image Upload (requires auth)
// userRouter.post('/:id/upload-profile', authenticateToken, profileUpload, userController.uploadProfileImage);

export default userRouter;