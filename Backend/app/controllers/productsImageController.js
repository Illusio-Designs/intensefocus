const { ProductsImage, Product } = require('../models');
const { processAndSaveImage } = require('../config/multer');
const path = require('path');
const fs = require('fs').promises;

// Get all product images
const getAllProductImages = async (req, res) => {
  try {
    const { page = 1, limit = 10, product_id, image_type } = req.query;
    
    const whereClause = {};
    if (product_id) whereClause.product_id = product_id;
    if (image_type) whereClause.image_type = image_type;

    const offset = (page - 1) * limit;
    
    const productImages = await ProductsImage.findAndCountAll({
      where: whereClause,
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'sku'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: productImages.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(productImages.count / limit),
        total_items: productImages.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching product images:', error);
    res.status(500).json({ success: false, message: 'Error fetching product images', error: error.message });
  }
};

// Get single product image
const getProductImageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const productImage = await ProductsImage.findByPk(id, {
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'sku'] }
      ]
    });

    if (!productImage) {
      return res.status(404).json({ success: false, message: 'Product image not found' });
    }

    res.json({ success: true, data: productImage });
  } catch (error) {
    console.error('Error fetching product image:', error);
    res.status(500).json({ success: false, message: 'Error fetching product image', error: error.message });
  }
};

// Upload product image
const uploadProductImage = async (req, res) => {
  try {
    const { product_id, image_type, alt_text, sort_order } = req.body;

    // Validate required fields
    if (!product_id || !image_type) {
      return res.status(400).json({ 
        success: false, 
        message: 'product_id and image_type are required' 
      });
    }

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(400).json({ success: false, message: 'Product not found' });
    }

    // Validate image type
    const validTypes = ['main', 'gallery', 'thumbnail'];
    if (!validTypes.includes(image_type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'image_type must be one of: main, gallery, thumbnail' 
      });
    }

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    // Process and save image
    const processedImage = await processAndSaveImage(req.file, 'products');

    const productImage = await ProductsImage.create({
      product_id,
      image_type,
      image_path: processedImage.filename,
      alt_text: alt_text || '',
      sort_order: sort_order || 0,
      status: 'active'
    });

    res.status(201).json({ 
      success: true, 
      data: productImage, 
      message: 'Product image uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading product image:', error);
    res.status(500).json({ success: false, message: 'Error uploading product image', error: error.message });
  }
};

// Update product image
const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { alt_text, sort_order, status } = req.body;

    const productImage = await ProductsImage.findByPk(id);
    if (!productImage) {
      return res.status(404).json({ success: false, message: 'Product image not found' });
    }

    const updateData = {};
    if (alt_text !== undefined) updateData.alt_text = alt_text;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (status) updateData.status = status;

    await productImage.update(updateData);

    res.json({ success: true, data: productImage, message: 'Product image updated successfully' });
  } catch (error) {
    console.error('Error updating product image:', error);
    res.status(500).json({ success: false, message: 'Error updating product image', error: error.message });
  }
};

// Delete product image
const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    const productImage = await ProductsImage.findByPk(id);
    if (!productImage) {
      return res.status(404).json({ success: false, message: 'Product image not found' });
    }

    // Delete file from storage
    try {
      const filePath = path.join(__dirname, '../../uploads/products', productImage.image_path);
      await fs.unlink(filePath);
    } catch (fileError) {
      console.warn('Could not delete file:', fileError.message);
    }

    await productImage.destroy();

    res.json({ success: true, message: 'Product image deleted successfully' });
  } catch (error) {
    console.error('Error deleting product image:', error);
    res.status(500).json({ success: false, message: 'Error deleting product image', error: error.message });
  }
};

// Get images by product
const getImagesByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { page = 1, limit = 10, image_type } = req.query;

    const whereClause = { product_id };
    if (image_type) whereClause.image_type = image_type;

    const offset = (page - 1) * limit;

    const productImages = await ProductsImage.findAndCountAll({
      where: whereClause,
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'sku'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: productImages.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(productImages.count / limit),
        total_items: productImages.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching images by product:', error);
    res.status(500).json({ success: false, message: 'Error fetching images by product', error: error.message });
  }
};

// Reorder product images
const reorderProductImages = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { image_orders } = req.body; // Array of {id, sort_order}

    if (!Array.isArray(image_orders)) {
      return res.status(400).json({ success: false, message: 'image_orders must be an array' });
    }

    // Update sort orders
    for (const item of image_orders) {
      await ProductsImage.update(
        { sort_order: item.sort_order },
        { where: { id: item.id, product_id } }
      );
    }

    res.json({ success: true, message: 'Product images reordered successfully' });
  } catch (error) {
    console.error('Error reordering product images:', error);
    res.status(500).json({ success: false, message: 'Error reordering product images', error: error.message });
  }
};

module.exports = {
  getAllProductImages,
  getProductImageById,
  uploadProductImage,
  updateProductImage,
  deleteProductImage,
  getImagesByProduct,
  reorderProductImages
}; 