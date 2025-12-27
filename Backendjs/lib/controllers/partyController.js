const Party = require('../models/Party');
const AuditLog = require('../models/AuditLog');
const Distributor = require('../models/Distributor');
const User = require('../models/User');
const { Op } = require('sequelize');
class PartyController {
    async getParties(req, res) {
        try {
            const parties = await Party.findAll({ where: { is_active: true } });
            if (!parties || parties.length === 0) {
                return res.status(404).json({ error: 'Parties not found' });
            }
            res.status(200).json(parties);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPartiesByZoneId(req, res) {
        try {
            const user = req.user;

            // First, try to find distributor by user_id
            let distributor = await Distributor.findOne({
                where: { user_id: user.user_id }
            });

            // If not found, fetch user's email/phone and search for distributor
            if (!distributor) {
                const userDetails = await User.findOne({
                    where: { user_id: user.user_id }
                });

                if (!userDetails) {
                    return res.status(404).json({ error: 'User not found' });
                }

                // Search for distributor by email or phone
                const whereConditions = [];
                if (userDetails.email) whereConditions.push({ email: userDetails.email });
                if (userDetails.phone) whereConditions.push({ phone: userDetails.phone });

                if (whereConditions.length > 0) {
                    distributor = await Distributor.findOne({
                        where: {
                            [Op.or]: whereConditions
                        }
                    });
                }

                // If distributor found, link it to the user
                if (distributor) {
                    distributor.user_id = user.user_id;
                    await distributor.save();
                } else {
                    return res.status(404).json({ error: 'No distributor found for this user' });
                }
            }

            // Get zone_id from distributor
            const zone_id = distributor.zone_id;
            if (!zone_id) {
                return res.status(400).json({ error: 'Distributor does not have a zone assigned' });
            }

            const parties = await Party.findAll({ where: { zone_id: zone_id } });
            if (!parties || parties.length === 0) {
                return res.status(404).json({ error: 'Parties not found' });
            }
            res.status(200).json(parties);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createParty(req, res) {
        try {
            const user = req.user;
            const { party_name, trade_name, contact_person, email, phone, address, country_id, state_id, city_id, zone_id, pincode, gstin, pan, credit_days, prefered_courier } = req.body;
            const party = await Party.create({
                party_name,
                trade_name,
                contact_person,
                email,
                phone,
                address,
                country_id,
                state_id,
                city_id,
                zone_id,
                pincode,
                gstin,
                pan,
                created_by: user.user_id,
                created_at: new Date(),
                updated_at: new Date(),
                is_active: true,
                credit_days,
                prefered_courier
            });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'create',
                description: 'Party created',
                table_name: 'parties',
                record_id: party.party_id,
                old_values: null,
                new_values: party,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json(party);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateParty(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'Party ID is required' });
            }
            const user = req.user;
            const { party_name, trade_name, contact_person, email,
                phone, address, country_id, state_id, city_id, zone_id, pincode, gstin, pan, credit_days, prefered_courier } = req.body;
            const party = await Party.findOne({ where: { party_id: id } });
            if (!party) {
                return res.status(404).json({ error: 'Party not found' });
            }
            await Party.update({
                party_name: party_name || party.party_name,
                trade_name: trade_name || party.trade_name,
                contact_person: contact_person || party.contact_person,
                email: email || party.email,
                phone: phone || party.phone,
                address: address || party.address,
                country_id: country_id || party.country_id,
                state_id: state_id || party.state_id,
                city_id: city_id || party.city_id,
                zone_id: zone_id || party.zone_id,
                pincode: pincode || party.pincode,
                gstin: gstin || party.gstin,
                pan: pan || party.pan,
                credit_days: credit_days || party.credit_days,
                prefered_courier: prefered_courier || party.prefered_courier,
                updated_at: new Date(),
                updated_by: user.user_id
            }, { where: { party_id: id } });

            await AuditLog.create({
                user_id: user.user_id,
                action: 'update',
                description: 'Party updated',
                table_name: 'parties',
                record_id: id,
                old_values: party,
                new_values: req.body,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'Party updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteParty(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'Party ID is required' });
            }
            const party = await Party.destroy({ where: { party_id: id } });
            if (!party) {
                return res.status(404).json({ error: 'Party not found' });
            }
            const user = req.user;
            await AuditLog.create({
                user_id: user.user_id,
                action: 'delete',
                description: 'Party deleted',
                table_name: 'parties',
                record_id: id,
                old_values: party,
                new_values: null,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'Party deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PartyController();