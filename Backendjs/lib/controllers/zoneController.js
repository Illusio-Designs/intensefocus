const Zone = require('../models/Zone');
const AuditLog = require('../models/AuditLog');
class ZoneController {

    async getZones(req, res) {
        try {
            const { city_id } = req.body;
            const zones = await Zone.findAll({ where: { is_active: true, city_id: city_id } });
            if (!zones || zones.length === 0) {
                return res.status(404).json({ error: 'Zones not found' });
            }
            res.status(200).json(zones);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createZone(req, res) {
        try {
            const user = req.user;
            const { name, description, city_id, state_id, country_id, zone_code } = req.body;
            const zone = await Zone.create({
                name,
                description,
                city_id,
                state_id,
                country_id,
                zone_code,
                created_by: user.user_id,
                created_at: new Date(),
                updated_at: new Date(),
                is_active: true
            });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'create',
                description: 'Zone created',
                table_name: 'zones',
                record_id: zone.id,
                old_values: null,
                new_values: zone,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(201).json(zone);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateZone(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'Zone ID is required' });
            }
            const { name, description, city_id, state_id, country_id, zone_code } = req.body;
            const user = req.user;
            const zone = await Zone.update({
                name,
                description,
                city_id,
                state_id,
                country_id,
                zone_code,
                updated_at: new Date(),
                updated_by: user.user_id
            }, { where: { id: id } });
            if (!zone) {
                return res.status(404).json({ error: 'Zone not found' });
            }
            await AuditLog.create({
                user_id: user.user_id,
                action: 'update',
                description: 'Zone updated',
                table_name: 'zones',
                record_id: id,
                old_values: zone,
                new_values: req.body,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'Zone updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteZone(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'Zone ID is required' });
            }
            const zone = await Zone.destroy({ where: { id: id } });
            if (!zone) {
                return res.status(404).json({ error: 'Zone not found' });
            }
            const user = req.user;
            await AuditLog.create({
                user_id: user.user_id,
                action: 'delete',
                description: 'Zone deleted',
                table_name: 'zones',
                record_id: id,
                old_values: zone,
                new_values: null,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'Zone deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new ZoneController();