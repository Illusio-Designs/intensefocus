const { User, RoleType } = require('../models');

/**
 * Role-based Authorization Middleware
 * Checks if user has required role(s)
 * @param {string|string[]} roles - Required role(s)
 */
const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Get user with role
            const user = await User.findOne({
                where: { id: req.user.id },
                include: [{
                    model: RoleType,
                    as: 'roleType',
                    attributes: ['type']
                }]
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const userRole = user.roleType?.type;
            const allowedRoles = Array.isArray(roles) ? roles : [roles];

            if (!userRole || !allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied - insufficient permissions'
                });
            }

            // Add role to request for convenience
            req.userRole = userRole;
            next();
        } catch (error) {
            console.error('Role Authorization Error:', error);
            res.status(500).json({
                success: false,
                message: 'Authorization error',
                error: error.message
            });
        }
    };
};

/**
 * Middleware to check if user has admin privileges
 */
const isAdmin = checkRole(['Admin']);

/**
 * Middleware to check if user has manager privileges
 */
const isManager = checkRole(['Admin', 'Manager']);

/**
 * Middleware to check if user is a salesman
 */
const isSalesman = checkRole(['Salesman']);

module.exports = {
    checkRole,
    isAdmin,
    isManager,
    isSalesman
};
