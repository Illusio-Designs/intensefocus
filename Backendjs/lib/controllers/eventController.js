const AuditLog = require('../models/AuditLog');
const Event = require('../models/event');

class EventController {
    async getEvents(req, res) {
        try {
            const events = await Event.findAll();
            if (!events || events.length === 0) {
                return res.status(404).json({ error: 'Events not found' });
            }
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createEvent(req, res) {
        try {
            const { event_name, latitude, longitude, event_date, event_status } = req.body;
            if (!event_name || !latitude || !longitude || !event_date || !event_status) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const event = await Event.create({ event_name, latitude, longitude, event_date, event_status });
            await AuditLog.create({
                user_id: req.user.user_id,
                action: 'create',
                description: 'Event created',
                table_name: 'events',
                record_id: event.event_id,
                old_values: null,
                new_values: event,
                ip_address: req.ip,
                created_at: new Date(),
            });
            res.status(201).json(event);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateEvent(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Event ID is required' });
            }
            const event = await Event.findOne({ where: { event_id: id } });
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            const { event_name, latitude, longitude, event_date, event_status } = req.body;
            const updatedEvent = await Event.update({
                event_name: event_name || event.event_name,
                latitude: latitude || event.latitude,
                longitude: longitude || event.longitude,
                event_date: event_date || event.event_date,
                event_status: event_status || event.event_status,
                updated_at: new Date(),
            }, { where: { event_id: id } });
            await AuditLog.create({
                user_id: req.user.user_id,
                action: 'update',
                description: 'Event updated',
                table_name: 'events',
                record_id: id,
                old_values: event,
                new_values: updatedEvent,
                ip_address: req.ip,
                created_at: new Date(),
            });
            res.status(200).json({ message: 'Event updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Event ID is required' });
            }
            const event = await Event.findOne({ where: { event_id: id } });
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            await event.destroy();
            await AuditLog.create({
                user_id: req.user.user_id,
                action: 'delete',
                description: 'Event deleted',
                table_name: 'events',
                record_id: id,
                old_values: event,
                new_values: null,
                ip_address: req.ip,
                created_at: new Date(),
            });
            res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new EventController();