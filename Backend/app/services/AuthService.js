const { User, RoleType } = require('../models');
const jwt = require('jsonwebtoken');
const MSG91Service = require('./MSG91Service');

class AuthService {
    /**
     * Get MSG91 widget configuration
     */
    getMSG91Config(phoneNumber) {
        return MSG91Service.getWidgetConfig(phoneNumber);
    }

    /**
     * Login with MSG91 OTP token
     */
    async loginWithMSG91Token(phoneNumber, accessToken) {
        try {
            // Verify the MSG91 access token
            await MSG91Service.verifyAccessToken(accessToken);

            // Find user by phone number
            const user = await User.findOne({
                where: { 
                    phone: phoneNumber,
                    flag: 1
                },
                include: [{
                    model: RoleType,
                    as: 'role',
                    attributes: ['type']
                }]
            });

            if (!user) {
                throw new Error('No account found with this phone number');
            }

            return this.generateAuthResponse(user);
        } catch (error) {
            throw new Error('OTP verification failed: ' + error.message);
        }
    }

    /**
     * Register user (Direct - No OTP verification)
     */
    async registerUser(phoneNumber, name, role_id = 3) {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({
                where: { 
                    phone: phoneNumber
                }
            });

            if (existingUser) {
                throw new Error('User already exists with this phone number');
            }

            // Create new user with mobile number
            const newUser = await User.create({
                name: name,
                phone: phoneNumber,
                mobile: phoneNumber, // Also set mobile field
                role_id: role_id || 3, // Default to Retailor role (role_id: 3)
                flag: 1, // Active user
                auth_provider: 'phone'
            });

            // Fetch user with role information
            const user = await User.findOne({
                where: { 
                    id: newUser.id
                },
                include: [{
                    model: RoleType,
                    as: 'role',
                    attributes: ['type']
                }]
            });

            return this.generateAuthResponse(user);
        } catch (error) {
            throw new Error('Registration failed: ' + error.message);
        }
    }

    /**
     * Generate authentication response with detailed role information
     */
    generateAuthResponse(user) {
        const token = jwt.sign(
            { 
                id: user.id,
                role: user.role?.type,
                role_id: user.role_id,
                permission_level: user.role?.flag || 1
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone || user.mobile,
                profile_image: user.profile_image,
                role: {
                    id: user.role_id,
                    name: user.role?.type || 'Unknown',
                    description: this.getRoleDescription(user.role?.type || 'Unknown'),
                    permission_level: user.role?.flag || 1,
                    status: 'active'
                },
                subrole: user.subrole || null,
                account_status: {
                    active: user.flag === 1,
                    flag: user.flag
                },
                last_login: user.last_login || null
            },
            token,
            login_info: {
                login_time: new Date().toISOString(),
                token_expires_in: '24h',
                role_hierarchy: this.getRoleHierarchy(user.role?.flag || 1),
                permissions: this.getRolePermissions(user.role?.type || 'Unknown')
            }
        };
    }

    /**
     * Get role hierarchy based on permission level
     */
    getRoleHierarchy(permissionLevel) {
        const hierarchy = {
            10: 'System Administrator',
            8: 'Senior Manager',
            7: 'Manager',
            6: 'Sales Manager',
            4: 'Distributor',
            3: 'Retailor',
            2: 'Salesman',
            1: 'Basic User'
        };
        return hierarchy[permissionLevel] || 'Unknown Level';
    }

    /**
     * Get role description
     */
    getRoleDescription(roleName) {
        const descriptions = {
            'Admin': 'System Administrator with full access',
            'Order Manager': 'Manages orders and order processing',
            'Inventory Manager': 'Manages inventory and stock',
            'Tray Manager': 'Manages tray allotments and transfers',
            'Retailor Manager': 'Manages retailor operations',
            'Distributor Manager': 'Manages distributor operations',
            'Sales Manager': 'Manages sales operations and targets',
            'Distributor': 'Distributor user with limited access',
            'Retailor': 'Retailor user with limited access',
            'Salesman': 'Salesman with subrole capabilities'
        };
        return descriptions[roleName] || 'Basic user role';
    }

    /**
     * Get role-specific permissions
     */
    getRolePermissions(roleName) {
        const permissions = {
            'Admin': [
                'full_system_access',
                'user_management',
                'role_management',
                'system_settings',
                'all_reports',
                'data_export_import'
            ],
            'Order Manager': [
                'order_management',
                'order_processing',
                'order_reports',
                'inventory_view'
            ],
            'Inventory Manager': [
                'inventory_management',
                'stock_management',
                'product_management',
                'inventory_reports'
            ],
            'Tray Manager': [
                'tray_management',
                'tray_allotment',
                'tray_transfer',
                'tray_reports'
            ],
            'Retailor Manager': [
                'retailor_management',
                'retailor_operations',
                'retailor_reports'
            ],
            'Distributor Manager': [
                'distributor_management',
                'distributor_operations',
                'distributor_reports'
            ],
            'Sales Manager': [
                'sales_management',
                'target_management',
                'sales_reports',
                'team_management'
            ],
            'Distributor': [
                'order_placement',
                'inventory_view',
                'sales_reports',
                'customer_management'
            ],
            'Retailor': [
                'order_placement',
                'product_catalog',
                'basic_reports'
            ],
            'Salesman': [
                'order_placement',
                'customer_management',
                'sales_tracking',
                'subrole_permissions'
            ]
        };
        return permissions[roleName] || ['basic_access'];
    }
}

module.exports = new AuthService();
