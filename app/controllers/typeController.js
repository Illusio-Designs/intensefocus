const { Type } = require('../models');

// Get all types
const getAllTypes = async (req, res) => {
  try {
    const types = await Type.findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
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

// Get single type by ID
const getTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const type = await Type.findByPk(id);
    
    if (!type) {
      return res.status(404).json({
        success: false,
        message: 'Type not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: type,
      message: 'Type retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving type',
      error: error.message
    });
  }
};

// Create new type
const createType = async (req, res) => {
  try {
    const { name, description, status, sort_order } = req.body;
    
    // Check if type already exists
    const existingType = await Type.findOne({ where: { name } });
    if (existingType) {
      return res.status(400).json({
        success: false,
        message: 'Type with this name already exists'
      });
    }
    
    const type = await Type.create({
      name,
      description,
      status: status !== undefined ? status : true,
      sort_order: sort_order || 0
    });
    
    res.status(201).json({
      success: true,
      data: type,
      message: 'Type created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating type',
      error: error.message
    });
  }
};

// Update type
const updateType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, sort_order } = req.body;
    
    const type = await Type.findByPk(id);
    if (!type) {
      return res.status(404).json({
        success: false,
        message: 'Type not found'
      });
    }
    
    // Check if name is being changed and if it already exists
    if (name && name !== type.name) {
      const existingType = await Type.findOne({ where: { name } });
      if (existingType) {
        return res.status(400).json({
          success: false,
          message: 'Type with this name already exists'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    
    await type.update(updateData);
    
    res.status(200).json({
      success: true,
      data: type,
      message: 'Type updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating type',
      error: error.message
    });
  }
};

// Get active types only
const getActiveTypes = async (req, res) => {
  try {
    const types = await Type.findAll({
      where: { status: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: types,
      message: 'Active types retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active types',
      error: error.message
    });
  }
};

// Search types
const searchTypes = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause.name = { [sequelize.Op.like]: `%${search}%` };
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const types = await Type.findAll({
      where: whereClause,
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: types,
      message: 'Types searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching types',
      error: error.message
    });
  }
};

module.exports = {
  getAllTypes,
  getTypeById,
  createType,
  updateType,
  getActiveTypes,
  searchTypes
}; 