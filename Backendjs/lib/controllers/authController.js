const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const AuditLog = require('../models/AuditLog');
class AuthController {

    async logout(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ error: 'Token is required' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.userId);
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
            await user.update({ last_login: null });
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async refreshToken(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ error: 'Token is required' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.userId);
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
            const newToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            await user.update({ last_login: new Date() });
            res.status(200).json({ token: newToken });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async checkUser(req, res) {
        try {
            const { phoneNumber } = req.body;
            if (!phoneNumber) {
                return res.status(400).json({ error: 'Phone number is required' });
            }
            const user = await User.findOne({
                where: {
                    phone: phoneNumber,
                    is_active: true
                }
            });
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
            res.status(200).json({ message: 'User found' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { phoneNumber } = req.body;
            if (!phoneNumber) {
                return res.status(400).json({ error: 'Phone number is required' });
            }
            const user = await User.findOne({
                where: {
                    phone: phoneNumber,
                    is_active: true
                }
            });
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
            const userRole = await UserRole.findOne({
                where: {
                    user_id: user.user_id
                }
            });
            if (!userRole) {
                return res.status(400).json({ error: 'User role not found' });
            }
            const role = await Role.findOne({
                where: {
                    role_id: userRole.role_id
                }
            });
            if (!role) {
                return res.status(400).json({ error: 'Role not found' });
            }
            const token = jwt.sign(
                {
                    userId: user.user_id,
                    phone: user.phone,
                    email: user.email,
                    full_name: user.full_name,
                    role: role.role_name
                },
                process.env.JWT_SECRET || 'default_jwt_secret',
                { expiresIn: '24h' }
            );
            res.status(200).json({ message: 'Login successful', token: token, role: role.role_name });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async register(req, res) {
        try {
            const { phoneNumber, fullName, roleId } = req.body;
            if (!phoneNumber || !fullName || !roleId) {
                return res.status(400).json({ error: 'Phone number, full name and role id are required' });
            }

            const existingUser = await User.findOne({
                where: {
                    phone: phoneNumber,
                    is_active: true
                }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }
            const role = await Role.findOne({
                where: {
                    role_id: roleId
                }
            });
            if (!role) {
                return res.status(400).json({ error: 'Role not found' });
            }
            const user = await User.create({
                phone: phoneNumber,
                full_name: fullName,
                role_id: roleId,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            });
            console.log("user", user.toJSON());
            await UserRole.create({
                user_id: user.user_id,
                role_id: role.role_id
            });
            console.log("UserRole created");
            res.status(200).json(user.toJSON());
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();