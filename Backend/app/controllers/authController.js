const AuthService = require('../services/AuthService');
const { User } = require('../models');

class AuthController {
    /**
     * Get MSG91 widget configuration for LOGIN
     */
    async getMSG91Config(req, res) {
        try {
            const { phone } = req.body;

            if (!phone) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number is required'
                });
            }

            // Check if user exists with this phone number
            const user = await User.findOne({ 
                where: { 
                    phone: phone,
                    flag: 1
                }
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'No account found with this phone number'
                });
            }

            const config = AuthService.getMSG91Config(phone);
            
            res.status(200).json({
                success: true,
                message: 'Widget configuration retrieved successfully',
                data: config
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error getting widget configuration',
                error: error.message
            });
        }
    }

    /**
     * Login with MSG91 OTP token
     */
    async loginWithMSG91(req, res) {
        try {
            const { phone, accessToken } = req.body;

            if (!phone || !accessToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number and access token are required'
                });
            }

            const result = await AuthService.loginWithMSG91Token(phone, accessToken);
            
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Register with mobile number (Direct - No OTP)
     */
    async register(req, res) {
        try {
            const { phone, name, role_id } = req.body;

            // Validate required fields
            if (!phone || !name) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number and name are required'
                });
            }

            // Validate mobile number (10 digits)
            if (!/^\d{10}$/.test(phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number must be 10 digits'
                });
            }

            const result = await AuthService.registerUser(phone, name, role_id);
            
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all available roles
     */
    async getAvailableRoles(req, res) {
        try {
            const RoleType = require('../models').RoleType;
            const roles = await RoleType.findAll({
                attributes: ['id', 'type', 'flag'],
                order: [['flag', 'DESC'], ['type', 'ASC']]
            });

            res.status(200).json({
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
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve roles',
                error: error.message
            });
        }
    }
}

module.exports = new AuthController();
