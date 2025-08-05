const { ProductImages, Product } = require('../models');

// Get all product images
const getAllProductImages = async (req, res) => {
  try {
    const productImages = await ProductImages.findAll({
      include: [
        { model: Product, as: 'product' }
      ],
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: productImages,
      message: 'Product images retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving product images',
      error: error.message
    });
  }
};

// Get single product image by ID
const getProductImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const productImage = await ProductImages.findByPk(id, {
      include: [
        { model: Product, as: 'product' }
      ]
    });
    
    if (!productImage) {
      return res.status(404).json({
        success: false,
        message: 'Product image not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: productImage,
      message: 'Product image retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving product image',
      error: error.message
    });
  }
};

// Create new product image
const createProductImage = async (req, res) => {
  try {
    const { product_id, image_path, image_name, is_primary, sort_order, status } = req.body;
    
    // Verify product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Selected product does not exist'
      });
    }
    
    // If this is a primary image, unset other primary images for this product
    if (is_primary) {
      await ProductImages.update(
        { is_primary: false },
        { where: { product_id } }
      );
    }
    
    const productImage = await ProductImages.create({
      product_id,
      image_path,
      image_name,
      is_primary: is_primary || false,
      sort_order: sort_order || 0,
      status: status !== undefined ? status : true
    });
    
    res.status(201).json({
      success: true,
      data: productImage,
      message: 'Product image created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product image',
      error: error.message
    });
  }
};

// Update product image
const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, image_path, image_name, is_primary, sort_order, status } = req.body;
    
    const productImage = await ProductImages.findByPk(id);
    if (!productImage) {
      return res.status(404).json({
        success: false,
        message: 'Product image not found'
      });
    }
    
    // Verify product exists if being changed
    if (product_id && product_id !== productImage.product_id) {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'Selected product does not exist'
        });
      }
    }
    
    // If this is being set as primary, unset other primary images for this product
    if (is_primary && !productImage.is_primary) {
      const targetProductId = product_id || productImage.product_id;
      await ProductImages.update(
        { is_primary: false },
        { where: { product_id: targetProductId } }
      );
    }
    
    // Prepare update data
    const updateData = {};
    if (product_id !== undefined) updateData.product_id = product_id;
    if (image_path !== undefined) updateData.image_path = image_path;
    if (image_name !== undefined) updateData.image_name = image_name;
    if (is_primary !== undefined) updateData.is_primary = is_primary;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (status !== undefined) updateData.status = status;
    
    await productImage.update(updateData);
    
    res.status(200).json({
      success: true,
      data: productImage,
      message: 'Product image updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product image',
      error: error.message
    });
  }
};

// Get images by product
const getImagesByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    
    // Verify product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const productImages = await ProductImages.findAll({
      where: { 
        product_id,
        status: true 
      },
      include: [
        { model: Product, as: 'product' }
      ],
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: productImages,
      message: 'Product images retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving product images',
      error: error.message
    });
  }
};

// Get primary image by product
const getPrimaryImageByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    
    // Verify product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const primaryImage = await ProductImages.findOne({
      where: { 
        product_id,
        is_primary: true,
        status: true 
      },
      include: [
        { model: Product, as: 'product' }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: primaryImage,
      message: 'Primary product image retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving primary product image',
      error: error.message
    });
  }
};

// Set primary image
const setPrimaryImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const productImage = await ProductImages.findByPk(id);
    if (!productImage) {
      return res.status(404).json({
        success: false,
        message: 'Product image not found'
      });
    }
    
    // Unset all primary images for this product
    await ProductImages.update(
      { is_primary: false },
      { where: { product_id: productImage.product_id } }
    );
    
    // Set this image as primary
    await productImage.update({ is_primary: true });
    
    res.status(200).json({
      success: true,
      data: productImage,
      message: 'Primary image set successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error setting primary image',
      error: error.message
    });
  }
};

// Get active product images only
const getActiveProductImages = async (req, res) => {
  try {
    const productImages = await ProductImages.findAll({
      where: { status: true },
      include: [
        { model: Product, as: 'product' }
      ],
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: productImages,
      message: 'Active product images retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active product images',
      error: error.message
    });
  }
};

// Search product images
const searchProductImages = async (req, res) => {
  try {
    const { search, product_id, is_primary, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause = {
        [sequelize.Op.or]: [
          { image_name: { [sequelize.Op.like]: `%${search}%` } },
          { image_path: { [sequelize.Op.like]: `%${search}%` } }
        ]
      };
    }
    
    if (product_id) {
      whereClause.product_id = product_id;
    }
    
    if (is_primary !== undefined) {
      whereClause.is_primary = is_primary === 'true';
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const productImages = await ProductImages.findAll({
      where: whereClause,
      include: [
        { model: Product, as: 'product' }
      ],
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: productImages,
      message: 'Product images searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching product images',
      error: error.message
    });
  }
};

module.exports = {
  getAllProductImages,
  getProductImageById,
  createProductImage,
  updateProductImage,
  getImagesByProduct,
  getPrimaryImageByProduct,
  setPrimaryImage,
  getActiveProductImages,
  searchProductImages
}; 