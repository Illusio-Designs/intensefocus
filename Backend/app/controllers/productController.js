const { 
  Product, 
  Brand, 
  Collection, 
  Shape, 
  Gender, 
  LensMaterial, 
  LensColor, 
  FrameMaterial, 
  FrameColor, 
  Type 
} = require('../models');
const { productUpload } = require('../config/multer');
const { Op } = require('sequelize');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Brand, as: 'brand' },
        { model: Collection, as: 'collection' },
        { model: Shape, as: 'shape' },
        { model: Gender, as: 'gender' },
        { model: LensMaterial, as: 'lensMaterial' },
        { model: LensColor, as: 'lensColor' },
        { model: FrameMaterial, as: 'frameMaterial' },
        { model: FrameColor, as: 'frameColor' },
        { model: Type, as: 'type' }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: products,
      message: 'Products retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving products',
      error: error.message
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: Brand, as: 'brand' },
        { model: Collection, as: 'collection' },
        { model: Shape, as: 'shape' },
        { model: Gender, as: 'gender' },
        { model: LensMaterial, as: 'lensMaterial' },
        { model: LensColor, as: 'lensColor' },
        { model: FrameMaterial, as: 'frameMaterial' },
        { model: FrameColor, as: 'frameColor' },
        { model: Type, as: 'type' }
      ]
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving product',
      error: error.message
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      sale_price,
      brand_id,
      collection_id,
      shape_id,
      gender_id,
      lens_material_id,
      lens_color_id,
      frame_material_id,
      frame_color_id,
      type_id,
      sku,
      stock_quantity,
      status,
      featured,
      meta_title,
      meta_description,
      meta_keywords
    } = req.body;
    
    // Check if SKU already exists
    if (sku) {
      const existingProduct = await Product.findOne({ where: { sku } });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product with this SKU already exists'
        });
      }
    }
    
    const product = await Product.create({
      name,
      description,
      price,
      sale_price,
      brand_id,
      collection_id,
      shape_id,
      gender_id,
      lens_material_id,
      lens_color_id,
      frame_material_id,
      frame_color_id,
      type_id,
      sku,
      stock_quantity: stock_quantity || 0,
      status: status !== undefined ? status : true,
      featured: featured || false,
      meta_title,
      meta_description,
      meta_keywords
    });
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      sale_price,
      brand_id,
      collection_id,
      shape_id,
      gender_id,
      lens_material_id,
      lens_color_id,
      frame_material_id,
      frame_color_id,
      type_id,
      sku,
      stock_quantity,
      status,
      featured,
      meta_title,
      meta_description,
      meta_keywords
    } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if SKU is being changed and if it already exists
    if (sku && sku !== product.sku) {
      const existingProduct = await Product.findOne({ where: { sku } });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product with this SKU already exists'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (sale_price !== undefined) updateData.sale_price = sale_price;
    if (brand_id !== undefined) updateData.brand_id = brand_id;
    if (collection_id !== undefined) updateData.collection_id = collection_id;
    if (shape_id !== undefined) updateData.shape_id = shape_id;
    if (gender_id !== undefined) updateData.gender_id = gender_id;
    if (lens_material_id !== undefined) updateData.lens_material_id = lens_material_id;
    if (lens_color_id !== undefined) updateData.lens_color_id = lens_color_id;
    if (frame_material_id !== undefined) updateData.frame_material_id = frame_material_id;
    if (frame_color_id !== undefined) updateData.frame_color_id = frame_color_id;
    if (type_id !== undefined) updateData.type_id = type_id;
    if (sku !== undefined) updateData.sku = sku;
    if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity;
    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;
    if (meta_title !== undefined) updateData.meta_title = meta_title;
    if (meta_description !== undefined) updateData.meta_description = meta_description;
    if (meta_keywords !== undefined) updateData.meta_keywords = meta_keywords;
    
    await product.update(updateData);
    
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Get active products only
const getActiveProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { status: true },
      include: [
        { model: Brand, as: 'brand' },
        { model: Collection, as: 'collection' },
        { model: Shape, as: 'shape' },
        { model: Gender, as: 'gender' },
        { model: LensMaterial, as: 'lensMaterial' },
        { model: LensColor, as: 'lensColor' },
        { model: FrameMaterial, as: 'frameMaterial' },
        { model: FrameColor, as: 'frameColor' },
        { model: Type, as: 'type' }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: products,
      message: 'Active products retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active products',
      error: error.message
    });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        status: true,
        featured: true
      },
      include: [
        { model: Brand, as: 'brand' },
        { model: Collection, as: 'collection' },
        { model: Shape, as: 'shape' },
        { model: Gender, as: 'gender' },
        { model: LensMaterial, as: 'lensMaterial' },
        { model: LensColor, as: 'lensColor' },
        { model: FrameMaterial, as: 'frameMaterial' },
        { model: FrameColor, as: 'frameColor' },
        { model: Type, as: 'type' }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: products,
      message: 'Featured products retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving featured products',
      error: error.message
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { 
      search, 
      status, 
      featured, 
      brand_id, 
      collection_id, 
      shape_id, 
      gender_id,
      min_price,
      max_price
    } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    if (featured !== undefined) {
      whereClause.featured = featured === 'true';
    }
    
    if (brand_id) {
      whereClause.brand_id = brand_id;
    }
    
    if (collection_id) {
      whereClause.collection_id = collection_id;
    }
    
    if (shape_id) {
      whereClause.shape_id = shape_id;
    }
    
    if (gender_id) {
      whereClause.gender_id = gender_id;
    }
    
    if (min_price || max_price) {
      whereClause.price = {};
      if (min_price) whereClause.price[Op.gte] = min_price;
      if (max_price) whereClause.price[Op.lte] = max_price;
    }
    
    const products = await Product.findAll({
      where: whereClause,
      include: [
        { model: Brand, as: 'brand' },
        { model: Collection, as: 'collection' },
        { model: Shape, as: 'shape' },
        { model: Gender, as: 'gender' },
        { model: LensMaterial, as: 'lensMaterial' },
        { model: LensColor, as: 'lensColor' },
        { model: FrameMaterial, as: 'frameMaterial' },
        { model: FrameColor, as: 'frameColor' },
        { model: Type, as: 'type' }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: products,
      message: 'Products searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};

// Upload product image
const uploadProductImage = async (req, res) => {
  try {
    const fileInfo = req.fileInfo;

    res.status(200).json({
      success: true,
      message: 'Product image uploaded successfully',
      data: {
        filename: fileInfo.filename,
        path: fileInfo.path,
        size: fileInfo.size,
        mimetype: fileInfo.mimetype,
        originalName: fileInfo.originalName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading product image',
      error: error.message
    });
  }
};

// Get all products with images and related data (matching PHP getAllProducts)
const getAllProductsWithImages = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        flag_d2c: '0',
        warehouse_qty: { [Op.gt]: 0 }
      },
      include: [
        { model: Brand, as: 'brand' },
        { model: Collection, as: 'collection' },
        { model: Shape, as: 'shape' },
        { model: Gender, as: 'gender' },
        { model: LensMaterial, as: 'lensMaterial' },
        { model: LensColor, as: 'lensColor' },
        { model: FrameMaterial, as: 'frameMaterial' },
        { model: FrameColor, as: 'frameColor' },
        { model: Type, as: 'type' }
      ],
      order: [['id', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: products,
      message: 'Products with images retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving products with images',
      error: error.message
    });
  }
};

// Get shapes (matching PHP getShapes)
const getShapes = async (req, res) => {
  try {
    const shapes = await Shape.findAll({
      where: { flag: '0' }
    });
    
    res.status(200).json({
      success: true,
      data: shapes,
      message: 'Shapes retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving shapes',
      error: error.message
    });
  }
};

// Get brands (matching PHP getBrands)
const getBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      where: { flag_d2c: '0' }
    });
    
    res.status(200).json({
      success: true,
      data: brands,
      message: 'Brands retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving brands',
      error: error.message
    });
  }
};

// Get genders (matching PHP getGenders)
const getGenders = async (req, res) => {
  try {
    const genders = await Gender.findAll({
      where: { flag: '0' }
    });
    
    res.status(200).json({
      success: true,
      data: genders,
      message: 'Genders retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving genders',
      error: error.message
    });
  }
};

// Get lens materials (matching PHP getLensMaterials)
const getLensMaterials = async (req, res) => {
  try {
    const lensMaterials = await LensMaterial.findAll({
      where: { flag: '0' }
    });
    
    res.status(200).json({
      success: true,
      data: lensMaterials,
      message: 'Lens materials retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving lens materials',
      error: error.message
    });
  }
};

// Get lens colors (matching PHP getLensColors)
const getLensColors = async (req, res) => {
  try {
    const lensColors = await LensColor.findAll({
      where: { flag: '0' }
    });
    
    res.status(200).json({
      success: true,
      data: lensColors,
      message: 'Lens colors retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving lens colors',
      error: error.message
    });
  }
};

// Get frame materials (matching PHP getFrameMaterials)
const getFrameMaterials = async (req, res) => {
  try {
    const frameMaterials = await FrameMaterial.findAll({
      where: { flag: '0' }
    });
    
    res.status(200).json({
      success: true,
      data: frameMaterials,
      message: 'Frame materials retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving frame materials',
      error: error.message
    });
  }
};

// Get frame colors (matching PHP getFrameColors)
const getFrameColors = async (req, res) => {
  try {
    const frameColors = await FrameColor.findAll({
      where: { flag: '0' }
    });
    
    res.status(200).json({
      success: true,
      data: frameColors,
      message: 'Frame colors retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving frame colors',
      error: error.message
    });
  }
};

// Get types (matching PHP getTypes)
const getTypes = async (req, res) => {
  try {
    const types = await Type.findAll({
      where: { flag: '0' }
    });
    
    res.status(200).json({
      success: true,
      data: types,
      message: 'Types retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving types',
      error: error.message
    });
  }
};

// Get filtered products (matching PHP getFilteredProducts)
const getFilteredProducts = async (req, res) => {
  try {
    const {
      brand_id,
      shape_id,
      gender_id,
      lens_material_id,
      lens_color_id,
      frame_material_id,
      frame_color_id,
      type_id,
      min_price,
      max_price
    } = req.query;
    
    let whereClause = {};
    
    if (brand_id) whereClause.brand_id = brand_id;
    if (shape_id) whereClause.shape_id = shape_id;
    if (gender_id) whereClause.gender_id = gender_id;
    if (lens_material_id) whereClause.lens_material_id = lens_material_id;
    if (lens_color_id) whereClause.lens_color_id = lens_color_id;
    if (frame_material_id) whereClause.frame_material_id = frame_material_id;
    if (frame_color_id) whereClause.frame_color_id = frame_color_id;
    if (type_id) whereClause.type_id = type_id;
    
    if (min_price || max_price) {
      whereClause.price = {};
      if (min_price) whereClause.price[Op.gte] = min_price;
      if (max_price) whereClause.price[Op.lte] = max_price;
    }
    
    const products = await Product.findAll({
      where: whereClause,
      include: [
        { model: Brand, as: 'brand' },
        { model: Collection, as: 'collection' },
        { model: Shape, as: 'shape' },
        { model: Gender, as: 'gender' },
        { model: LensMaterial, as: 'lensMaterial' },
        { model: LensColor, as: 'lensColor' },
        { model: FrameMaterial, as: 'frameMaterial' },
        { model: FrameColor, as: 'frameColor' },
        { model: Type, as: 'type' }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: products,
      message: 'Filtered products retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving filtered products',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  getActiveProducts,
  getFeaturedProducts,
  searchProducts,
  uploadProductImage,
  getAllProductsWithImages,
  getShapes,
  getBrands,
  getGenders,
  getLensMaterials,
  getLensColors,
  getFrameMaterials,
  getFrameColors,
  getTypes,
  getFilteredProducts
}; 