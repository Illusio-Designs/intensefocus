const Shape = require('../models/Shape');
const AuditLog = require('../models/AuditLog');
class ShapesController {
    async getShapes(req, res) {
        try {
            const shapes = await Shape.findAll();
            if (!shapes || shapes.length === 0) {
                return res.status(404).json({ error: 'Shapes not found' });
            }
            res.status(200).json(shapes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createShape(req, res) {
        try {
            const user = req.user;
            const { shape_name } = req.body;
            if (!shape_name) {
                return res.status(400).json({ error: 'Shape name is required' });
            }
            const shape = await Shape.create({ shape_name: shape_name, created_at: new Date(), updated_at: new Date() });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'create',
                description: 'Shape created',
                table_name: 'shape',
                record_id: shape.shape_id,
                old_values: null,
                new_values: shape,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json(shape);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateShape(req, res) {
        try {
            const user = req.user;
            const { shape_name } = req.body;
            const { id } = req.params;
            if (!id || !shape_name) {
                return res.status(400).json({ error: 'Shape ID and shape name are required' });
            }
            const shape = await Shape.update({
                shape_name: shape_name,
                updated_at: new Date(),
            }, { where: { shape_id: id } });
            if (!shape) {
                return res.status(404).json({ error: 'Shape not found' });
            }
            await AuditLog.create({
                user_id: user.user_id,
                action: 'update',
                description: 'Shape updated',
                table_name: 'shape',
                record_id: id,
                old_values: shape,
                new_values: req.body,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'Shape updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteShape(req, res) {
        try {
            const user = req.user;
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Shape ID is required' });
            }
            const shape = await Shape.destroy({ where: { shape_id: id } });
            if (!shape) {
                return res.status(404).json({ error: 'Shape not found' });
            }
            await AuditLog.create({
                user_id: user.user_id,
                action: 'delete',
                description: 'Shape deleted',
                table_name: 'shape',
                record_id: id,
                old_values: shape,
                new_values: null,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'Shape deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ShapesController();