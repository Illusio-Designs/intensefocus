const AuditLog = require('../models/AuditLog');
const Event = require('../models/event');
const { EventStatus } = require('../constants/enums');
class EventController {
    async getEvents(req, res) {
        try {
            const events = await Event.findAll();
            if (!events || events.length === 0) {
                return res.status(404).json({ error: 'Events not found' });
            }
            for (const event of events) {
                let eventStatus;
                const startDate = new Date(event.start_date);
                const endDate = new Date(event.end_date);
                if (startDate < new Date()) {
                    eventStatus = EventStatus.PAST;
                } else if (startDate > new Date() && endDate < new Date()) {
                    eventStatus = EventStatus.ONGOING;
                } else {
                    eventStatus = EventStatus.UPCOMING;
                }
                event.event_status = eventStatus;
                await event.save();
            }
            const updatedEvents = await Event.findAll();
            res.status(200).json(updatedEvents);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createEvent(req, res) {
        try {
            // no location
            const { event_name, start_date, end_date, event_location } = req.body;
            if (!event_name || !start_date || !end_date || !event_location) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            if (startDate > endDate) {
                return res.status(400).json({ error: 'Start date must be before end date' });
            }
            let eventStatus;
            if (startDate < new Date()) {
                eventStatus = EventStatus.PAST;
            } else if ((startDate > new Date() && endDate < new Date()) || startDate == new Date()) {
                eventStatus = EventStatus.ONGOING;
            } else {
                eventStatus = EventStatus.UPCOMING;
            }

            const event = await Event.create({
                event_name,
                start_date: startDate,
                end_date: endDate,
                event_status: eventStatus,
                event_location,
            });
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
            const { event_name, start_date, end_date, event_location } = req.body;
            let eventStatus;
            if (start_date && end_date) {
                const startDate = new Date(start_date);
                const endDate = new Date(end_date);
                if (startDate > endDate) {
                    return res.status(400).json({ error: 'Start date must be before end date' });
                }
                if (startDate < new Date()) {
                    eventStatus = EventStatus.PAST;
                } else if ((startDate > new Date() && endDate < new Date()) || startDate == new Date()) {
                    eventStatus = EventStatus.ONGOING;
                } else {
                    eventStatus = EventStatus.UPCOMING;
                }
            }
            if (start_date && start_date != event.start_date) {
                const startDate = new Date(start_date);
                const endDate = new Date(event.end_date);
                if (startDate > endDate) {
                    return res.status(400).json({ error: 'Start date must be before end date' });
                }
                if (startDate < new Date()) {
                    eventStatus = EventStatus.PAST;
                } else if ((startDate > new Date() && endDate < new Date()) || startDate == new Date()) {
                    eventStatus = EventStatus.ONGOING;
                } else {
                    eventStatus = EventStatus.UPCOMING;
                }
            }
            if (end_date && end_date != event.end_date) {
                const startDate = new Date(event.start_date);
                const endDate = new Date(end_date);
                if (startDate > endDate) {
                    return res.status(400).json({ error: 'Start date must be before end date' });
                }
                if (endDate < new Date()) {
                    eventStatus = EventStatus.PAST;
                } else if ((startDate > new Date() && endDate < new Date()) || startDate == new Date()) {
                    eventStatus = EventStatus.ONGOING;
                } else {
                    eventStatus = EventStatus.UPCOMING;
                }
            }
            const updatedEvent = await Event.update({
                event_name: event_name || event.event_name,
                start_date: start_date || event.start_date,
                end_date: end_date || event.end_date,
                event_location: event_location || event.event_location,
                updated_at: new Date(),
                event_status: eventStatus || event.event_status,
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