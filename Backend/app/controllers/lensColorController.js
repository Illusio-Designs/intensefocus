const { LensColor } = require('../models');

// Get all lens colors
const getAllLensColors = async (req, res) => {
  try {
    const lensColors = await LensColor.findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
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

// Get single lens color by ID
const getLensColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const lensColor = await LensColor.findByPk(id);
    
    if (!lensColor) {
      return res.status(404).json({
        success: false,
        message: 'Lens color not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lensColor,
      message: 'Lens color retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving lens color',
      error: error.message
    });
  }
};

// Create new lens color
const createLensColor = async (req, res) => {
  try {
    const { name, description, color_code, status, sort_order } = req.body;
    
    // Check if lens color already exists
    const existingLensColor = await LensColor.findOne({ where: { name } });
    if (existingLensColor) {
      return res.status(400).json({
        success: false,
        message: 'Lens color with this name already exists'
      });
    }
    
    const lensColor = await LensColor.create({
      name,
      description,
      color_code,
      status: status !== undefined ? status : true,
      sort_order: sort_order || 0
    });
    
    res.status(201).json({
      success: true,
      data: lensColor,
      message: 'Lens color created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating lens color',
      error: error.message
    });
  }
};

// Update lens color
const updateLensColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color_code, status, sort_order } = req.body;
    
    const lensColor = await LensColor.findByPk(id);
    if (!lensColor) {
      return res.status(404).json({
        success: false,
        message: 'Lens color not found'
      });
    }
    
    // Check if name is being changed and if it already exists
    if (name && name !== lensColor.name) {
      const existingLensColor = await LensColor.findOne({ where: { name } });
      if (existingLensColor) {
        return res.status(400).json({
          success: false,
          message: 'Lens color with this name already exists'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (color_code !== undefined) updateData.color_code = color_code;
    if (status !== undefined) updateData.status = status;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    
    await lensColor.update(updateData);
    
    res.status(200).json({
      success: true,
      data: lensColor,
      message: 'Lens color updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lens color',
      error: error.message
    });
  }
};

// Get active lens colors only
const getActiveLensColors = async (req, res) => {
  try {
    const lensColors = await LensColor.findAll({
      where: { status: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: lensColors,
      message: 'Active lens colors retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active lens colors',
      error: error.message
    });
  }
};

// Search lens colors
const searchLensColors = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause.name = { [sequelize.Op.like]: `%${search}%` };
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const lensColors = await LensColor.findAll({
      where: whereClause,
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: lensColors,
      message: 'Lens colors searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching lens colors',
      error: error.message
    });
  }
};

module.exports = {
  getAllLensColors,
  getLensColorById,
  createLensColor,
  updateLensColor,
  getActiveLensColors,
  searchLensColors
}; 