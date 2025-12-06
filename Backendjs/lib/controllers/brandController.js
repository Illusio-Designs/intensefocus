const Brand = require('../models/Brand');
const AuditLog = require('../models/AuditLog');
class BrandController {
    async getBrands(req, res) {
        try {
            const brands = await Brand.findAll();
            if (!brands || brands.length === 0) {
                return res.status(404).json({ error: 'Brands not found' });
            }
            res.status(200).json(brands);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createBrand(req, res) {
        try {
            const user = req.user;
            const { brand_name } = req.body;
            if (!brand_name) {
                return res.status(400).json({ error: 'Brand name is required' });
            }
            const brand = await Brand.create({
                brand_name: brand_name,
                created_at: new Date(),
                updated_at: new Date(),
            });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'create',
                table_name: 'brand',
                record_id: brand.brand_id,
                old_values: null,
                new_values: brand,
                ip_address: req.ip
            });
            res.status(201).json(brand);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateBrand(req, res) {
        try {
            const user = req.user;
            const { brand_name } = req.body;
            const { id } = req.params;
            if (!id || !brand_name) {
                return res.status(400).json({ error: 'Brand ID and brand name are required' });
            }
            const brand = await Brand.update({
                brand_name: brand_name,
                updated_at: new Date(),
            }, { where: { brand_id: id } });
            if (!brand) {
                return res.status(404).json({ error: 'Brand not found' });
            }
            await AuditLog.create({
                user_id: user.user_id,
                action: 'update',
                table_name: 'brand',
                record_id: id,
                old_values: brand,
                new_values: { brand_name },
                ip_address: req.ip
            });
            res.status(200).json({ message: 'Brand updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteBrand(req, res) {
        try {
            const user = req.user;
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Brand ID is required' });
            }
            const brand = await Brand.destroy({ where: { brand_id: id } });
            if (!brand) {
                return res.status(404).json({ error: 'Brand not found' });
            }
            await AuditLog.create({
                user_id: user.user_id,
                action: 'delete',
                table_name: 'brand',
                record_id: id,
                old_values: brand,
                new_values: null,
                ip_address: req.ip
            });
            res.status(200).json({ message: 'Brand deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new BrandController();