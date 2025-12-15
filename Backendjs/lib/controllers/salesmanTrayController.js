const SalesmanTray = require('../models/SalesmanTray');
const AuditLog = require('../models/AuditLog');
const Salesman = require('../models/Salesman');
const Tray = require('../models/Tray');
const { TrayStatus } = require('../constants/enums');

class SalesmanTrayController {
    async getAssignedTrays(req, res) {
        try {
            const { salesman_id } = req.body;
            if (!salesman_id) {
                return res.status(400).json({ error: 'Salesman ID is required' });
            }
            const salesmanTrays = await SalesmanTray.findAll({ where: { salesman_id }, include: [Salesman, Tray] });
            if (!salesmanTrays || salesmanTrays.length === 0) {
                return res.status(404).json({ error: 'Salesman trays not found' });
            }
            res.status(200).json(salesmanTrays);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async assignSalesmanTray(req, res) {
        try {
            const { salesman_id, tray_id } = req.body;
            if (!salesman_id || !tray_id) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const tray = await Tray.findOne({ where: { tray_id } });
            if (!tray) {
                return res.status(404).json({ error: 'Tray not found' });
            }

            if (tray.tray_status != TrayStatus.AVAILABLE) {
                return res.status(400).json({ error: 'Tray is not available' });
            }
            await Tray.update({
                tray_status: TrayStatus.ASSIGNED,
                updated_at: new Date(),
            }, { where: { tray_id: tray_id } });

            const salesmanTray = await SalesmanTray.create({
                salesman_id,
                tray_id,
                created_at: new Date(),
                updated_at: new Date(),
                assigned_at: new Date(),
            });
            await AuditLog.create({
                user_id: req.user.user_id,
                action: 'create',
                description: 'Salesman tray created',
                table_name: 'salesman_tray',
                record_id: salesmanTray.id,
                old_values: null,
                new_values: salesmanTray,
                ip_address: req.ip,
                created_at: new Date(),
            });
            const updatedTray = await SalesmanTray.findOne({ where: { tray_id, salesman_id }, include: [Tray] });
            res.status(200).json({ message: 'Salesman tray assigned successfully', data: updatedTray });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async unassignSalesmanTray(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Salesman tray ID is required' });
            }
            const user = req.user;
            const salesmanTray = await SalesmanTray.findOne({ where: { id } });
            if (!salesmanTray) {
                return res.status(404).json({ error: 'Salesman tray not found' });
            }
            console.log(salesmanTray.tray_id);
            const tray = await Tray.findOne({ where: { tray_id: salesmanTray.tray_id } });
            if (!tray) {
                return res.status(404).json({ error: 'Tray not found' });
            }
            if (tray.tray_status != TrayStatus.ASSIGNED) {
                return res.status(400).json({ error: 'Tray is not assigned' });
            }
            await Tray.update({
                tray_status: TrayStatus.AVAILABLE,
                updated_at: new Date(),
            }, { where: { tray_id: salesmanTray.tray_id } });
            await SalesmanTray.destroy({ where: { id } });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'delete',
                description: 'Salesman tray deleted',
                table_name: 'salesman_tray',
                record_id: id,
                old_values: salesmanTray,
                new_values: null,
                ip_address: req.ip,
                created_at: new Date(),
            });
            res.status(200).json({ message: 'Salesman tray unassigned successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new SalesmanTrayController();