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

    async uploadProductImage(req, res) {
        try {
            const fileInfo = req.fileInfo;
            if (!fileInfo) {
                return res.status(400).json({ error: 'Image not found' });
            }
            const { originalName, path } = fileInfo;
            const product = await Product.findOne({ where: { model_no: originalName } });
            if (!product) {
                return res.status(200).json({ message: 'Product not found, but image saved successfully' });
            }
            await product.update({ image_url: path });
            await AuditLog.create({
                user_id: req.user.user_id,
                action: 'update',
                description: 'Product image saved',
                table_name: 'products',
                record_id: product.product_id,
                old_values: { image_url: product.image_url },
                new_values: { image_url: path },
                ip_address: req.ip,
                created_at: new Date()
            });
            res.status(200).json({ message: 'Product image saved successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async bulkProductUpload(data, user, req) {
        try {
            if (!Array.isArray(data)) {
                return { success: false, message: 'Data must be an array' };
            }

            const createdProducts = [];
            const updatedProducts = [];
            const errors = [];
            let successCount = 0;
            let errorCount = 0;

            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                try {
                    const { model_no, gender_id, color_code_id, shape_id, lens_color_id, frame_color_id,
                        frame_type_id, lens_material_id, frame_material_id, mrp, whp, size_mm,
                        warehouse_qty, tray_qty, total_qty, brand_id, collection_id } = item;

                    let { status, image_url } = item;

                    if (!model_no || !gender_id || !color_code_id || !shape_id || !lens_color_id
                        || !frame_color_id || !frame_type_id || !lens_material_id || !frame_material_id
                        || !mrp || !whp || !size_mm || warehouse_qty === undefined || tray_qty === undefined || total_qty === undefined
                        || !brand_id || !collection_id || !image_url) {
                        errors.push({ row: i + 1, model_no: model_no || 'N/A', error: 'All fields are required' });
                        errorCount++;
                        continue;
                    }

                    if (status === undefined) {
                        status = 'draft';
                    }
                    if (image_url) {
                        console.log('image_url', image_url);
                        const uploadPath = path.join(__dirname, '..', '..', 'uploads', PRODUCT_IMAGE_UPLOAD_DIR);
                        const imagePath = path.join(uploadPath, image_url);
                        console.log('imagePath', imagePath);
                        if (fs.existsSync(imagePath)) {
                            image_url = imagePath;
                        } else {
                            errors.push({ row: i + 1, model_no, error: 'Image not found' });
                            errorCount++;
                            continue;
                        }
                    }

                    const brand = await Brand.findOne({ where: { brand_id: brand_id } });
                    if (!brand) {
                        errors.push({ row: i + 1, model_no, error: 'Brand not found' });
                        errorCount++;
                        continue;
                    }

                    const collection = await Collection.findOne({ where: { collection_id: collection_id } });
                    if (!collection) {
                        errors.push({ row: i + 1, model_no, error: 'Collection not found' });
                        errorCount++;
                        continue;
                    }

                    const colorCode = await ColorCode.findOne({ where: { color_code_id: color_code_id } });
                    if (!colorCode) {
                        errors.push({ row: i + 1, model_no, error: 'Color code not found' });
                        errorCount++;
                        continue;
                    }

                    const shape = await Shape.findOne({ where: { shape_id: shape_id } });
                    if (!shape) {
                        errors.push({ row: i + 1, model_no, error: 'Shape not found' });
                        errorCount++;
                        continue;
                    }

                    const lensColor = await LensColor.findOne({ where: { lens_color_id: lens_color_id } });
                    if (!lensColor) {
                        errors.push({ row: i + 1, model_no, error: 'Lens color not found' });
                        errorCount++;
                        continue;
                    }

                    const frameColor = await FrameColor.findOne({ where: { frame_color_id: frame_color_id } });
                    if (!frameColor) {
                        errors.push({ row: i + 1, model_no, error: 'Frame color not found' });
                        errorCount++;
                        continue;
                    }

                    const frameType = await FrameType.findOne({ where: { frame_type_id: frame_type_id } });
                    if (!frameType) {
                        errors.push({ row: i + 1, model_no, error: 'Frame type not found' });
                        errorCount++;
                        continue;
                    }

                    const lensMaterial = await LensMaterial.findOne({ where: { lens_material_id: lens_material_id } });
                    if (!lensMaterial) {
                        errors.push({ row: i + 1, model_no, error: 'Lens material not found' });
                        errorCount++;
                        continue;
                    }

                    const frameMaterial = await FrameMaterial.findOne({ where: { frame_material_id: frame_material_id } });
                    if (!frameMaterial) {
                        errors.push({ row: i + 1, model_no, error: 'Frame material not found' });
                        errorCount++;
                        continue;
                    }

                    const gender = await Gender.findOne({ where: { gender_id: gender_id } });
                    if (!gender) {
                        errors.push({ row: i + 1, model_no, error: 'Gender not found' });
                        errorCount++;
                        continue;
                    }

                    // Check if product with same model_no already exists
                    const existingProduct = await Product.findOne({ where: { model_no } });
                    if (existingProduct) {
                        Product.update({
                            status: status,
                            warehouse_qty: warehouse_qty,
                            tray_qty: tray_qty,
                            total_qty: total_qty,
                            mrp: mrp,
                            whp: whp,
                            size_mm: size_mm,
                            brand_id: brand_id,
                            collection_id: collection_id,
                            gender_id: gender_id,
                            color_code_id: color_code_id,
                            shape_id: shape_id,
                            lens_color_id: lens_color_id,
                            frame_color_id: frame_color_id,
                            frame_type_id: frame_type_id,
                            lens_material_id: lens_material_id,
                            frame_material_id: frame_material_id,
                            image_url: image_url,
                            updated_at: new Date(),
                        }, { where: { product_id: existingProduct.product_id } });
                        await AuditLog.create({
                            user_id: user.user_id,
                            action: 'update',
                            description: 'Product updated via bulk upload',
                            table_name: 'products',
                            record_id: existingProduct.product_id,
                            old_values: existingProduct,
                            new_values: {
                                status: status,
                                warehouse_qty: warehouse_qty,
                                tray_qty: tray_qty,
                                total_qty: total_qty,
                                mrp: mrp,
                                whp: whp,
                                size_mm: size_mm,
                                brand_id: brand_id,
                                collection_id: collection_id,
                                gender_id: gender_id,
                                color_code_id: color_code_id,
                                shape_id: shape_id,
                                lens_color_id: lens_color_id,
                                frame_color_id: frame_color_id,
                                frame_type_id: frame_type_id,
                                lens_material_id: lens_material_id,
                                frame_material_id: frame_material_id,
                                image_url: image_url,
                                updated_at: new Date(),
                            },
                            ip_address: req.ip || 'N/A',
                            created_at: new Date()
                        });
                        updatedProducts.push(existingProduct);
                        successCount++;
                        continue;
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
                        image_url,
                        created_at: new Date(),
                        updated_at: new Date(),
                    });

                    createdProducts.push(product);

                    // Create audit log if user is provided
                    if (user && req) {
                        await AuditLog.create({
                            user_id: user.user_id,
                            action: 'create',
                            description: 'Product created via bulk upload',
                            table_name: 'products',
                            record_id: product.product_id,
                            old_values: null,
                            new_values: product,
                            ip_address: req.ip || 'N/A',
                            created_at: new Date()
                        });
                    }

                    successCount++;
                } catch (error) {
                    errors.push({ row: i + 1, model_no: item.model_no || 'N/A', error: error.message });
                    errorCount++;
                }
            }

            return {
                success: successCount > 0,
                message: `Bulk upload completed. ${successCount} products created, ${errorCount} errors.`,
                data: {
                    created: createdProducts,
                    errors: errors,
                    successCount,
                    errorCount,
                    total: data.length
                }
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

module.exports = new ProductController();