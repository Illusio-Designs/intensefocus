const { FrameMaterial } = require('../models');

// Get all frame materials
const getAllFrameMaterials = async (req, res) => {
  try {
    const frameMaterials = await FrameMaterial.findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
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

// Get single frame material by ID
const getFrameMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const frameMaterial = await FrameMaterial.findByPk(id);
    
    if (!frameMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Frame material not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: frameMaterial,
      message: 'Frame material retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving frame material',
      error: error.message
    });
  }
};

// Create new frame material
const createFrameMaterial = async (req, res) => {
  try {
    const { name, description, status, sort_order } = req.body;
    
    // Check if frame material already exists
    const existingFrameMaterial = await FrameMaterial.findOne({ where: { name } });
    if (existingFrameMaterial) {
      return res.status(400).json({
        success: false,
        message: 'Frame material with this name already exists'
      });
    }
    
    const frameMaterial = await FrameMaterial.create({
      name,
      description,
      status: status !== undefined ? status : true,
      sort_order: sort_order || 0
    });
    
    res.status(201).json({
      success: true,
      data: frameMaterial,
      message: 'Frame material created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating frame material',
      error: error.message
    });
  }
};

// Update frame material
const updateFrameMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, sort_order } = req.body;
    
    const frameMaterial = await FrameMaterial.findByPk(id);
    if (!frameMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Frame material not found'
      });
    }
    
    // Check if name is being changed and if it already exists
    if (name && name !== frameMaterial.name) {
      const existingFrameMaterial = await FrameMaterial.findOne({ where: { name } });
      if (existingFrameMaterial) {
        return res.status(400).json({
          success: false,
          message: 'Frame material with this name already exists'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    
    await frameMaterial.update(updateData);
    
    res.status(200).json({
      success: true,
      data: frameMaterial,
      message: 'Frame material updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating frame material',
      error: error.message
    });
  }
};

// Get active frame materials only
const getActiveFrameMaterials = async (req, res) => {
  try {
    const frameMaterials = await FrameMaterial.findAll({
      where: { status: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: frameMaterials,
      message: 'Active frame materials retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active frame materials',
      error: error.message
    });
  }
};

// Search frame materials
const searchFrameMaterials = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause.name = { [sequelize.Op.like]: `%${search}%` };
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const frameMaterials = await FrameMaterial.findAll({
      where: whereClause,
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: frameMaterials,
      message: 'Frame materials searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching frame materials',
      error: error.message
    });
  }
};

module.exports = {
  getAllFrameMaterials,
  getFrameMaterialById,
  createFrameMaterial,
  updateFrameMaterial,
  getActiveFrameMaterials,
  searchFrameMaterials
}; 