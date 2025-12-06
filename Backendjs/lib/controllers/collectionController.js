const Collection = require('../models/Collection');
const AuditLog = require('../models/AuditLog');
const Brand = require('../models/Brand');
class CollectionController {
    async getCollections(req, res) {
        try {
            const collections = await Collection.findAll();
            if (!collections || collections.length === 0) {
                return res.status(404).json({ error: 'Collections not found' });
            }
            res.status(200).json(collections);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createCollection(req, res) {
        try {
            const user = req.user;
            const { collection_name, brand_id } = req.body;
            if (!collection_name || !brand_id) {
                return res.status(400).json({ error: 'Collection name and brand ID are required' });
            }
            const brand = await Brand.findOne({ where: { brand_id: brand_id } });
            if (!brand) {
                return res.status(404).json({ error: 'Brand not found' });
            }
            const collection = await Collection.create({
                collection_name: collection_name,
                brand_id: brand_id,
                created_at: new Date(),
                updated_at: new Date(),
            });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'create',
                table_name: 'collection',
                record_id: collection.collection_id,
                old_values: null,
                new_values: collection,
                ip_address: req.ip
            });
            res.status(201).json(collection);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateCollection(req, res) {
        try {
            const user = req.user;
            const { collection_name, brand_id } = req.body;
            const { id } = req.params;
            if (!id || !collection_name || !brand_id) {
                return res.status(400).json({ error: 'Collection ID, collection name and brand ID are required' });
            }
            const brand = await Brand.findOne({ where: { brand_id: brand_id } });
            if (!brand) {
                return res.status(404).json({ error: 'Brand not found' });
            }
            const collection = await Collection.update({
                collection_name: collection_name,
                brand_id: brand_id,
                updated_at: new Date(),
            }, { where: { collection_id: id } });
            if (!collection) {
                return res.status(404).json({ error: 'Collection not found' });
            }
            await AuditLog.create({
                user_id: user.user_id,
                action: 'update',
                table_name: 'collection',
                record_id: id,
                old_values: collection,
                new_values: { collection_name, brand_id },
                ip_address: req.ip
            });
            res.status(200).json({ message: 'Collection updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteCollection(req, res) {
        try {
            const user = req.user;
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Collection ID is required' });
            }
            const collection = await Collection.destroy({ where: { collection_id: id } });
            if (!collection) {
                return res.status(404).json({ error: 'Collection not found' });
            }
            await AuditLog.create({
                user_id: user.user_id,
                action: 'delete',
                table_name: 'collection',
                record_id: id,
                old_values: collection,
                new_values: null,
                ip_address: req.ip
            });
            res.status(200).json({ message: 'Collection deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CollectionController();