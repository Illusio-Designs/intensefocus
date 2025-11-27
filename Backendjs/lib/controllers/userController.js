const { Op } = require('sequelize');
const User = require('../models/User');
const Role = require('../models/Role');
const AuditLog = require('../models/AuditLog');

class UserController {
    async getUsers(req, res) {
        try {
            const roles = await Role.findAll(
                {
                    where: {
                        is_office_role: true
                    }
                }
            );
            const roleIds = roles.map(role => role.role_id);
            console.log("roleIds", roleIds);
            const users = await User.findAll(
                {
                    where: {
                        role_id: {
                            [Op.in]: roleIds
                        }
                    }
                }
            );
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await user.destroy();
            await AuditLog.create({
                user_id: user.user_id,
                action: 'delete',
                description: 'User deleted',
                table_name: 'users',
                record_id: user.user_id,
                old_values: user.toJSON(),
                new_values: null,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'User deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, is_active, phone, role_id, image_url } = req.body;
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const role = await Role.findByPk(role_id);
            if (!role) {
                return res.status(404).json({ error: 'Role not found' });
            }
            await user.update({
                full_name: name,
                phone: phone,
                role_id: role_id,
                is_active: is_active,
                profile_image: image_url,
                updated_at: new Date()
            });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'update',
                description: 'User updated',
                table_name: 'users',
                record_id: user.user_id,
                old_values: user.toJSON(),
                new_values: {
                    full_name: name,
                    phone: phone,
                    role_id: role_id,
                    is_active: is_active,
                    updated_at: new Date()
                },
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'User updated successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UserController();