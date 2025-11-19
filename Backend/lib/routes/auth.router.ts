import express, { Router } from 'express';
import authController from '../controllers/auth.controller';

const authRouter: Router = express.Router();

authRouter.post('/register', authController.register);

authRouter.post('/login/msg91/config', authController.getMSG91Config);
authRouter.post('/login/msg91/verify', authController.loginWithMSG91);

authRouter.get('/roles', authController.getAvailableRoles);

export default authRouter;