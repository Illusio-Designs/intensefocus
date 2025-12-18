const Product = require('../models/Product');
const AuditLog = require('../models/AuditLog');
const Brand = require('../models/Brand');
const Collection = require('../models/Collection');
const ColorCode = require('../models/ColorCode');
const Shape = require('../models/Shape');
const LensColor = require('../models/LensColor');
const FrameColor = require('../models/FrameColor');
const FrameType = require('../models/FrameType');
const LensMaterial = require('../models/LensMaterial');
const FrameMaterial = require('../models/FrameMaterial');
const Gender = require('../models/Gender');
const { PRODUCT_IMAGE_UPLOAD_DIR } = require('../constants/multer');
const path = require('path');
const fs = require('fs');

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
                mrp, whp, size_mm, warehouse_qty, status, brand_id, collection_id, image_urls } = req.body;
            if (!model_no || !gender_id || !color_code_id || !shape_id || !lens_color_id
                || !frame_color_id || !frame_type_id || !lens_material_id || !frame_material_id
                || !mrp || !whp || !size_mm || !warehouse_qty
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
                image_urls,
                mrp,
                whp,
                size_mm,
                warehouse_qty,
                tray_qty: 0,
                total_qty: warehouse_qty,
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
                warehouse_qty, tray_qty, total_qty, status, brand_id, collection_id, image_urls } = req.body;
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
                image_urls: image_urls || product.image_urls,
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

    async uploadProductImage(req, res) {
        try {
            const fileInfos = req.fileInfos;
            const { product_id } = req.body;

            if (!fileInfos || fileInfos.length === 0) {
                return res.status(400).json({ error: 'Image not found' });
            }

            if (!product_id) {
                return res.status(200).json({
                    message: 'Product image uploaded successfully',
                    data: fileInfos,
                });
            }

            // Find the product
            const product = await Product.findOne({ where: { product_id: product_id } });
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Get existing image_urls or initialize empty array
            let image_urls = product.image_urls || [];
            const oldImageUrls = [...image_urls];

            // Add all uploaded image paths to the array
            for (const fileInfo of fileInfos) {
                image_urls.push(fileInfo.path);
            }

            // Update product with new image_urls
            await Product.update(
                { image_urls: image_urls, updated_at: new Date() },
                { where: { product_id: product_id } }
            );

            // Create audit log
            await AuditLog.create({
                user_id: req.user.user_id,
                action: 'update',
                description: 'Product image saved',
                table_name: 'products',
                record_id: product.product_id,
                old_values: { image_urls: oldImageUrls },
                new_values: { image_urls: image_urls },
                ip_address: req.ip,
                created_at: new Date()
            });

            // Fetch updated product
            const updatedProduct = await Product.findOne({ where: { product_id: product_id } });
            return res.status(200).json({
                message: 'Product image saved successfully',
                data: fileInfos,
                product: updatedProduct
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllUploadedImages(req, res) {
        try {
            const uploadsPath = path.join(__dirname, '..', '..', 'uploads', PRODUCT_IMAGE_UPLOAD_DIR);

            // Check if directory exists
            if (!fs.existsSync(uploadsPath)) {
                return res.status(404).json({
                    error: 'Upload directory not found',
                    images: []
                });
            }

            // Read all files from the directory
            const files = fs.readdirSync(uploadsPath);

            // Filter only image files and get their details
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            const images = files
                .filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return imageExtensions.includes(ext);
                })
                .map(file => {
                    const filePath = path.join(uploadsPath, file);
                    const stats = fs.statSync(filePath);
                    return {
                        filename: file,
                        path: filePath,
                        url: `/uploads/${PRODUCT_IMAGE_UPLOAD_DIR}/${file}`,
                        size: stats.size,
                        uploadedAt: stats.birthtime,
                        modifiedAt: stats.mtime
                    };
                })
                // Sort by upload date (newest first)
                .sort((a, b) => b.uploadedAt - a.uploadedAt);

            res.status(200).json({
                success: true,
                count: images.length,
                images: images
            });
        } catch (error) {
            res.status(500).json({
                error: error.message,
                success: false
            });
        }
    }

    async hasData(data) {
        if (!data || data === undefined || data === null || data === '') {
            return false;
        }
        return true;
    }

    async bulkProductUpload(data, user, req) {
    }
}

module.exports = new ProductController();