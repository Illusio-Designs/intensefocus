const XLSX = require('xlsx');
const { parse } = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');
const productController = require('../controllers/productController');

/**
 * Middleware to parse Excel/CSV files and create products
 * Expects req.file to be set by multer middleware
 */
const parseProductFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const filePath = req.file.path;
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        let products = [];

        // Parse file based on extension
        if (fileExt === '.csv') {
            // Read and parse CSV file
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            });

            // Map CSV records to product objects
            products = records.map(record => ({
                model_no: record.model_no || record.modelNo || record['Model No'] || record['Model Number'],
                gender_id: parseInt(record.gender_id || record.genderId || record['Gender ID'] || record.gender) || null,
                color_code_id: parseInt(record.color_code_id || record.colorCodeId || record['Color Code ID'] || record['Color Code']) || null,
                shape_id: parseInt(record.shape_id || record.shapeId || record['Shape ID'] || record.shape) || null,
                lens_color_id: parseInt(record.lens_color_id || record.lensColorId || record['Lens Color ID'] || record['Lens Color']) || null,
                frame_color_id: parseInt(record.frame_color_id || record.frameColorId || record['Frame Color ID'] || record['Frame Color']) || null,
                frame_type_id: parseInt(record.frame_type_id || record.frameTypeId || record['Frame Type ID'] || record['Frame Type']) || null,
                lens_material_id: parseInt(record.lens_material_id || record.lensMaterialId || record['Lens Material ID'] || record['Lens Material']) || null,
                frame_material_id: parseInt(record.frame_material_id || record.frameMaterialId || record['Frame Material ID'] || record['Frame Material']) || null,
                mrp: parseFloat(record.mrp || record.MRP || record['MRP']) || null,
                whp: parseFloat(record.whp || record.WHP || record['WHP']) || null,
                size_mm: record.size_mm || record.sizeMm || record['Size (mm)'] || record.size || null,
                warehouse_qty: parseInt(record.warehouse_qty || record.warehouseQty || record['Warehouse Qty'] || record.warehouse || 0) || 0,
                tray_qty: parseInt(record.tray_qty || record.trayQty || record['Tray Qty'] || record.tray || 0) || 0,
                total_qty: parseInt(record.total_qty || record.totalQty || record['Total Qty'] || record.total || 0) || 0,
                status: record.status || record.Status || 'draft',
                brand_id: record.brand_id || record.brandId || record['Brand ID'] || record.brand || null,
                collection_id: record.collection_id || record.collectionId || record['Collection ID'] || record.collection || null,
                image_url: record.image_url || record.imageUrl || record['Image URL'] || record.image || null,
            }));

        } else if (fileExt === '.xlsx' || fileExt === '.xls') {
            // Read and parse Excel file
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0]; // Use first sheet
            const worksheet = workbook.Sheets[sheetName];
            const records = XLSX.utils.sheet_to_json(worksheet);

            // Map Excel records to product objects
            products = records.map(record => ({
                model_no: record.model_no || record.modelNo || record['Model No'] || record['Model Number'] || record['MODEL_NO'],
                gender_id: parseInt(record.gender_id || record.genderId || record['Gender ID'] || record.gender || record['GENDER_ID']) || null,
                color_code_id: parseInt(record.color_code_id || record.colorCodeId || record['Color Code ID'] || record['Color Code'] || record['COLOR_CODE_ID']) || null,
                shape_id: parseInt(record.shape_id || record.shapeId || record['Shape ID'] || record.shape || record['SHAPE_ID']) || null,
                lens_color_id: parseInt(record.lens_color_id || record.lensColorId || record['Lens Color ID'] || record['Lens Color'] || record['LENS_COLOR_ID']) || null,
                frame_color_id: parseInt(record.frame_color_id || record.frameColorId || record['Frame Color ID'] || record['Frame Color'] || record['FRAME_COLOR_ID']) || null,
                frame_type_id: parseInt(record.frame_type_id || record.frameTypeId || record['Frame Type ID'] || record['Frame Type'] || record['FRAME_TYPE_ID']) || null,
                lens_material_id: parseInt(record.lens_material_id || record.lensMaterialId || record['Lens Material ID'] || record['Lens Material'] || record['LENS_MATERIAL_ID']) || null,
                frame_material_id: parseInt(record.frame_material_id || record.frameMaterialId || record['Frame Material ID'] || record['Frame Material'] || record['FRAME_MATERIAL_ID']) || null,
                mrp: parseFloat(record.mrp || record.MRP || record['MRP']) || null,
                whp: parseFloat(record.whp || record.WHP || record['WHP']) || null,
                size_mm: record.size_mm || record.sizeMm || record['Size (mm)'] || record.size || record['SIZE_MM'] || null,
                warehouse_qty: parseInt(record.warehouse_qty || record.warehouseQty || record['Warehouse Qty'] || record.warehouse || record['WAREHOUSE_QTY'] || 0) || 0,
                tray_qty: parseInt(record.tray_qty || record.trayQty || record['Tray Qty'] || record.tray || record['TRAY_QTY'] || 0) || 0,
                total_qty: parseInt(record.total_qty || record.totalQty || record['Total Qty'] || record.total || record['TOTAL_QTY'] || 0) || 0,
                status: record.status || record.Status || record['STATUS'] || 'draft',
                brand_id: record.brand_id || record.brandId || record['Brand ID'] || record.brand || record['BRAND_ID'] || null,
                collection_id: record.collection_id || record.collectionId || record['Collection ID'] || record.collection || record['COLLECTION_ID'] || null,
                image_url: record.image_url || record.imageUrl || record['Image URL'] || record.image || null,
            }));

        } else {
            // Clean up uploaded file if format not supported
            fs.unlinkSync(filePath);
            return res.status(400).json({
                success: false,
                message: 'Unsupported file format. Only CSV and Excel files are allowed.'
            });
        }

        // Filter out invalid products (must have model_no at minimum)
        products = products.filter(product => product.model_no);

        if (products.length === 0) {
            // Clean up uploaded file
            fs.unlinkSync(filePath);
            return res.status(400).json({
                success: false,
                message: 'No valid products found in the file'
            });
        }

        // Store products in request for bulkProductUpload
        req.products = products;
        req.filePath = filePath;

        // Call bulkProductUpload
        const result = await productController.bulkProductUpload(products, req.user, req);

        // Clean up uploaded file after processing
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Send response
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data,
                totalProcessed: products.length
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message,
                data: result.data,
                totalProcessed: products.length,
            });
        }

    } catch (error) {
        // Clean up uploaded file on error
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error('Product file parsing error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error parsing product file: ' + error.message
        });
    }
};

module.exports = parseProductFile;

