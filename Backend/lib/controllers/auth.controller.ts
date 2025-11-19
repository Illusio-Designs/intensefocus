import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from '../constants/prisma';
import authService from '../services/auth.service';
class AuthController {
    /**
     * Get MSG91 widget configuration for LOGIN
     */
    async getMSG91Config(req: Request, res: Response) {
        try {
            const { phone } = req.body;

            if (!phone) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Phone number is required'
                });
            }

            const user = await prisma.user.findUnique({
                where: {
                    mobile: phone,
                    flag: 1
                }
            });

            if (!user) {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: 'No account found with this phone number'
                });
            }

            const config = authService.getMSG91Config(phone);

            res.status(httpStatus.OK).json({
                success: true,
                message: 'Widget configuration retrieved successfully',
                data: config
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Error getting widget configuration',
                    error: error.message
                });
            } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Error getting widget configuration',
                    error: error
                });
            }
        }
    }

    /**
     * Login with MSG91 OTP token
     */
    async loginWithMSG91(req: Request, res: Response) {
        try {
            const { phone, accessToken } = req.body;

            if (!phone || !accessToken) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Phone number and access token are required'
                });
            }

            const result = await authService.loginWithMSG91Token(phone, accessToken);

            res.status(httpStatus.OK).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: 'Error logging in',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Register with mobile number (Direct - No OTP)
     */
    async register(req: Request, res: Response) {
        try {
            const { phone, name, role_id } = req.body;

            // Validate required fields
            if (!phone || !name) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Phone number and name are required'
                });
            }

            // Validate mobile number (10 digits)
            if (!/^\d{10}$/.test(phone)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Phone number must be 10 digits'
                });
            }

            const result = await authService.registerUser(phone, name, role_id);

            res.status(httpStatus.CREATED).json({
                success: true,
                message: 'Registration successful',
                data: result
            });
        } catch (error: any) {
            res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Get all available roles
     */
    async getAvailableRoles(req: Request, res: Response) {
        try {
            const roles = await prisma.roleType.findMany({
                select: {
                    id: true,
                    type: true,
                    flag: true
                },
                orderBy: {
                    flag: 'desc',
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                message: 'Available roles retrieved successfully',
                data: {
                    roles: roles,
                    role_hierarchy: {
                        10: 'System Administrator',
                        8: 'Senior Manager',
                        7: 'Manager',
                        6: 'Sales Manager',
                        4: 'Distributor',
                        3: 'Retailor',
                        2: 'Salesman',
                        1: 'Basic User'
                    },
                    total_roles: roles.length
                }
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to retrieve roles',
                error: error.message
            });
        }
    }
}

const authController = new AuthController();
export default authController;