const Tray = require('../models/Tray');
const AuditLog = require('../models/AuditLog');

class TrayController {
    async getTrays(req, res) {
        try {
            const trays = await Tray.findAll();
            if (!trays || trays.length === 0) {
                return res.status(404).json({ error: 'Trays not found' });
            }
            res.status(200).json(trays);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createTray(req, res) {
        try {
            const { tray_name, tray_status } = req.body;
            if (!tray_name || !tray_status) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const tray = await Tray.create({
                tray_name,
                tray_status,
                created_at: new Date(),
                updated_at: new Date(),
            });
            await AuditLog.create({
                user_id: req.user.user_id,
                action: 'create',
                description: 'Tray created',
                table_name: 'tray',
                record_id: tray.tray_id,
                old_values: null,
                new_values: tray,
                ip_address: req.ip,
                created_at: new Date(),
            });
            res.status(200).json(tray);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateTray(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Tray ID is required' });
            }
            const { tray_name, tray_status } = req.body;
            const tray = await Tray.findByPk(id);
            if (!tray) {
                return res.status(404).json({ error: 'Tray not found' });
            }
            const user = req.user;
            await tray.update({
                tray_name: tray_name || tray.tray_name,
                tray_status: tray_status || tray.tray_status,
                updated_at: new Date(),
            }, { where: { tray_id: id } });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'update',
                description: 'Tray updated',
                table_name: 'tray',
                record_id: id,
                old_values: tray,
                new_values: {
                    tray_name,
                    tray_status,
                    updated_at: new Date(),
                },
                ip_address: req.ip,
                created_at: new Date(),
            });
            res.status(200).json({ message: 'Tray updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteTray(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Tray ID is required' });
            }
            const tray = await Tray.findByPk(id);
            if (!tray) {
                return res.status(404).json({ error: 'Tray not found' });
            }
            await tray.destroy();
            const user = req.user;
            await AuditLog.create({
                user_id: user.user_id,
                action: 'delete',
                description: 'Tray deleted',
                table_name: 'tray',
                record_id: id,
                old_values: tray,
                new_values: null,
                ip_address: req.ip,
                created_at: new Date(),
            });
            res.status(200).json({ message: 'Tray deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TrayController();