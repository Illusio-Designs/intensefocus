const { FrameColor } = require('../models');

// Get all frame colors
const getAllFrameColors = async (req, res) => {
  try {
    const frameColors = await FrameColor.findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
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

// Get single frame color by ID
const getFrameColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const frameColor = await FrameColor.findByPk(id);
    
    if (!frameColor) {
      return res.status(404).json({
        success: false,
        message: 'Frame color not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: frameColor,
      message: 'Frame color retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving frame color',
      error: error.message
    });
  }
};

// Create new frame color
const createFrameColor = async (req, res) => {
  try {
    const { name, description, color_code, status, sort_order } = req.body;
    
    // Check if frame color already exists
    const existingFrameColor = await FrameColor.findOne({ where: { name } });
    if (existingFrameColor) {
      return res.status(400).json({
        success: false,
        message: 'Frame color with this name already exists'
      });
    }
    
    const frameColor = await FrameColor.create({
      name,
      description,
      color_code,
      status: status !== undefined ? status : true,
      sort_order: sort_order || 0
    });
    
    res.status(201).json({
      success: true,
      data: frameColor,
      message: 'Frame color created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating frame color',
      error: error.message
    });
  }
};

// Update frame color
const updateFrameColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color_code, status, sort_order } = req.body;
    
    const frameColor = await FrameColor.findByPk(id);
    if (!frameColor) {
      return res.status(404).json({
        success: false,
        message: 'Frame color not found'
      });
    }
    
    // Check if name is being changed and if it already exists
    if (name && name !== frameColor.name) {
      const existingFrameColor = await FrameColor.findOne({ where: { name } });
      if (existingFrameColor) {
        return res.status(400).json({
          success: false,
          message: 'Frame color with this name already exists'
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
    
    await frameColor.update(updateData);
    
    res.status(200).json({
      success: true,
      data: frameColor,
      message: 'Frame color updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating frame color',
      error: error.message
    });
  }
};

// Get active frame colors only
const getActiveFrameColors = async (req, res) => {
  try {
    const frameColors = await FrameColor.findAll({
      where: { status: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: frameColors,
      message: 'Active frame colors retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active frame colors',
      error: error.message
    });
  }
};

// Search frame colors
const searchFrameColors = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause.name = { [sequelize.Op.like]: `%${search}%` };
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const frameColors = await FrameColor.findAll({
      where: whereClause,
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: frameColors,
      message: 'Frame colors searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching frame colors',
      error: error.message
    });
  }
};

module.exports = {
  getAllFrameColors,
  getFrameColorById,
  createFrameColor,
  updateFrameColor,
  getActiveFrameColors,
  searchFrameColors
}; 