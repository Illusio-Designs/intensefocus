const TrayProducts = require('../models/TrayProducts');
const AuditLog = require('../models/AuditLog');
const Tray = require('../models/Tray');
const Product = require('../models/Product');

class TrayProductsController {
    async getProductsInTray(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Tray ID is required' });
            }
            const trayProducts = await TrayProducts.findAll({ where: { tray_id: id } });
            if (!trayProducts || trayProducts.length === 0) {
                return res.status(404).json({ error: 'Tray products not found' });
            }
            res.status(200).json(trayProducts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addProductToTray(req, res) {
        try {
            const { tray_id, product_id, qty, status } = req.body;
            if (!tray_id || !product_id || !qty) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const user = req.user;
            const trayProduct = await TrayProducts.create({
                tray_id,
                product_id,
                qty,
                status,
                created_at: new Date(),
                updated_at: new Date(),
                assigned_at: new Date(),
            });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'create',
                description: 'Tray product created',
                table_name: 'tray_products',
                record_id: trayProduct.id,
                old_values: null,
                new_values: trayProduct,
                ip_address: req.ip,
                created_at: new Date(),
            });
            res.status(200).json(trayProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProductInTray(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Tray product ID is required' });
            }
            const { tray_id, product_id, qty, status } = req.body;
            const user = req.user;
            const trayProduct = await TrayProducts.findOne({ where: { id } });
            if (!trayProduct) {
                return res.status(404).json({ error: 'Tray product not found' });
            }
            await trayProduct.update({
                tray_id: tray_id || trayProduct.tray_id,
                product_id: product_id || trayProduct.product_id,
                qty: qty || trayProduct.qty,
                status: status || trayProduct.status,
                updated_at: new Date(),
            });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'update',
                description: 'Tray product updated',
                table_name: 'tray_products',
                record_id: id,
                old_values: trayProduct,
                new_values: {
                    tray_id,
                    product_id,
                    qty,
                    updated_at: new Date(),
                },
                ip_address: req.ip,
                created_at: new Date(),
            });
            res.status(200).json({ message: 'Tray product updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProductFromTray(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Tray product ID is required' });
            }
            const user = req.user;
            const trayProduct = await TrayProducts.findOne({ where: { id } });
            if (!trayProduct) {
                return res.status(404).json({ error: 'Tray product not found' });
            }
            await TrayProducts.destroy({ where: { id } });
            await AuditLog.create({
                user_id: user.user_id,
                action: 'delete',
                description: 'Tray product deleted',
                table_name: 'tray_products',
                record_id: id,
                old_values: trayProduct,
                new_values: null,
                ip_address: req.ip,
                created_at: new Date(),
            });
            res.status(200).json({ message: 'Tray product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TrayProductsController();