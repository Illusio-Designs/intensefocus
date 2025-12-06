const Product = require('../models/Product');
const AuditLog = require('../models/AuditLog');
const Brand = require('../models/Brand');
const Collection = require('../models/Collection');
class ProductController {
    async getProducts(req, res) {
        try {
            const products = await Product.findAll();
            if (!products || products.length === 0) {
                return res.status(404).json({ error: 'Products not found' });
            }
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createProduct(req, res) {
        try {
            const user = req.user;
            const { model_no, gender_id, color_code_id, shape_id, lens_color_id,
                frame_color_id, frame_type_id, lens_material_id, frame_material_id,
                mrp, whp, size_mm, warehouse_qty, tray_qty, total_qty, status, brand_id, collection_id } = req.body;
            if (!model_no || !gender_id || !color_code_id || !shape_id || !lens_color_id
                || !frame_color_id || !frame_type_id || !lens_material_id || !frame_material_id
                || !mrp || !whp || !size_mm || !warehouse_qty || !tray_qty || !total_qty
                || !status || !brand_id || !collection_id) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const brand = await Brand.findOne({ where: { brand_id: brand_id } });
            if (!brand) {
                return res.status(404).json({ error: 'Brand not found' });
            }
            const collection = await Collection.findOne({ where: { collection_id: collection_id } });
            if (!collection) {
                return res.status(404).json({ error: 'Collection not found' });
            }
            const product = await Product.create({
                model_no,
                gender_id,
                color_code_id,
                shape_id,
                lens_color_id,
                frame_color_id,
                frame_type_id,
                lens_material_id,
                frame_material_id,
                mrp,
                whp,
                size_mm,
                warehouse_qty,
                tray_qty,
                total_qty,
                status,
                brand_id,
                collection_id,
                created_at: new Date(),
                updated_at: new Date(),
            });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'create',
                description: 'Product created',
                table_name: 'products',
                record_id: product.product_id,
                old_values: null,
                new_values: product,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateProduct(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'Product ID is required' });
            }
            const user = req.user;
            const { model_no, gender_id, color_code_id, shape_id, lens_color_id, frame_color_id,
                frame_type_id, lens_material_id, frame_material_id, mrp, whp, size_mm,
                warehouse_qty, tray_qty, total_qty, status, brand_id, collection_id } = req.body;
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const brand = await Brand.findOne({ where: { brand_id: brand_id } });
            if (!brand) {
                return res.status(404).json({ error: 'Brand not found' });
            }
            const collection = await Collection.findOne({ where: { collection_id: collection_id } });
            if (!collection) {
                return res.status(404).json({ error: 'Collection not found' });
            }
            await Product.update({
                model_no: model_no || product.model_no,
                gender_id: gender_id || product.gender_id,
                color_code_id: color_code_id || product.color_code_id,
                shape_id: shape_id || product.shape_id,
                lens_color_id: lens_color_id || product.lens_color_id,
                frame_color_id: frame_color_id || product.frame_color_id,
                frame_type_id: frame_type_id || product.frame_type_id,
                lens_material_id: lens_material_id || product.lens_material_id,
                frame_material_id: frame_material_id || product.frame_material_id,
                mrp: mrp || product.mrp,
                whp: whp || product.whp,
                size_mm: size_mm || product.size_mm,
                warehouse_qty: warehouse_qty || product.warehouse_qty,
                tray_qty: tray_qty || product.tray_qty,
                total_qty: total_qty || product.total_qty,
                status: status || product.status,
                brand_id: brand_id || product.brand_id,
                collection_id: collection_id || product.collection_id,
                updated_at: new Date(),
            }, { where: { product_id: id } });

            await AuditLog.create({
                user_id: user.user_id,
                action: 'update',
                description: 'Product updated',
                table_name: 'products',
                record_id: id,
                old_values: product,
                new_values: req.body,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'Product updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteProduct(req, res) {
        try {
            const user = req.user;
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'Product ID is required' });
            }
            const product = await Product.destroy({ where: { product_id: id } });
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            await AuditLog.create({
                user_id: user.user_id,
                action: 'delete',
                description: 'Product deleted',
                table_name: 'products',
                record_id: id,
                old_values: product,
                new_values: null,
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();