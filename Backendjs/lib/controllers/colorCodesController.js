const ColorCode = require('../models/ColorCode');
const AuditLog = require('../models/AuditLog');

class ColorCodesController {
    async getColorCodes(req, res) {
        try {
            const colorCodes = await ColorCode.findAll();
            if (!colorCodes || colorCodes.length === 0) {
                return res.status(404).json({ error: 'Color codes not found' });
            }
            res.status(200).json(colorCodes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createColorCode(req, res) {
        try {
            const user = req.user;
            const { color_code } = req.body;
            if (!color_code) {
                return res.status(400).json({ error: 'Color code is required' });
            }
            const colorCode = await ColorCode.create({
                color_code: color_code,
                created_at: new Date(),
                updated_at: new Date(),
            });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'create',
                description: 'Color code created',
                table_name: 'color_code',
                record_id: colorCode.color_code_id,
                old_values: null,
                new_values: colorCode,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json(colorCode);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateColorCode(req, res) {
        try {
            const user = req.user;
            const { color_code } = req.body;
            const { id } = req.params;
            if (!id || !color_code) {
                return res.status(400).json({ error: 'Color code ID and color code are required' });
            }
            const colorCode = await ColorCode.update({
                color_code: color_code,
                updated_at: new Date(),
            }, { where: { color_code_id: id } });
            if (!colorCode) {
                return res.status(404).json({ error: 'Color code not found' });
            }
            await AuditLog.create({
                user_id: user.user_id,
                action: 'update',
                description: 'Color code updated',
                table_name: 'color_code',
                record_id: id,
                old_values: colorCode,
                new_values: req.body,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'Color code updated successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteColorCode(req, res) {
        try {
            const user = req.user;
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Color code ID is required' });
            }
            const colorCode = await ColorCode.destroy({ where: { color_code_id: id } });
            if (!colorCode) {
                return res.status(404).json({ error: 'Color code not found' });
            }
            await AuditLog.create({
                user_id: user.user_id,
                action: 'delete',
                description: 'Color code deleted',
                table_name: 'color_code',
                record_id: id,
                old_values: colorCode,
                new_values: null,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'Color code deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ColorCodesController();  