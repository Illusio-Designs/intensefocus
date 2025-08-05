const { Shape } = require('../models');

// Get all shapes
const getAllShapes = async (req, res) => {
  try {
    const shapes = await Shape.findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
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

// Get single shape by ID
const getShapeById = async (req, res) => {
  try {
    const { id } = req.params;
    const shape = await Shape.findByPk(id);
    
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: shape,
      message: 'Shape retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving shape',
      error: error.message
    });
  }
};

// Create new shape
const createShape = async (req, res) => {
  try {
    const { name, description, status, sort_order } = req.body;
    
    // Check if shape already exists
    const existingShape = await Shape.findOne({ where: { name } });
    if (existingShape) {
      return res.status(400).json({
        success: false,
        message: 'Shape with this name already exists'
      });
    }
    
    const shape = await Shape.create({
      name,
      description,
      status: status !== undefined ? status : true,
      sort_order: sort_order || 0
    });
    
    res.status(201).json({
      success: true,
      data: shape,
      message: 'Shape created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating shape',
      error: error.message
    });
  }
};

// Update shape
const updateShape = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, sort_order } = req.body;
    
    const shape = await Shape.findByPk(id);
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }
    
    // Check if name is being changed and if it already exists
    if (name && name !== shape.name) {
      const existingShape = await Shape.findOne({ where: { name } });
      if (existingShape) {
        return res.status(400).json({
          success: false,
          message: 'Shape with this name already exists'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    
    await shape.update(updateData);
    
    res.status(200).json({
      success: true,
      data: shape,
      message: 'Shape updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating shape',
      error: error.message
    });
  }
};

// Get active shapes only
const getActiveShapes = async (req, res) => {
  try {
    const shapes = await Shape.findAll({
      where: { status: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: shapes,
      message: 'Active shapes retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active shapes',
      error: error.message
    });
  }
};

// Search shapes
const searchShapes = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause.name = { [sequelize.Op.like]: `%${search}%` };
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const shapes = await Shape.findAll({
      where: whereClause,
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: shapes,
      message: 'Shapes searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching shapes',
      error: error.message
    });
  }
};

module.exports = {
  getAllShapes,
  getShapeById,
  createShape,
  updateShape,
  getActiveShapes,
  searchShapes
}; 