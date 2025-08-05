const { LensMaterial } = require('../models');

// Get all lens materials
const getAllLensMaterials = async (req, res) => {
  try {
    const lensMaterials = await LensMaterial.findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
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

// Get single lens material by ID
const getLensMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const lensMaterial = await LensMaterial.findByPk(id);
    
    if (!lensMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Lens material not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lensMaterial,
      message: 'Lens material retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving lens material',
      error: error.message
    });
  }
};

// Create new lens material
const createLensMaterial = async (req, res) => {
  try {
    const { name, description, status, sort_order } = req.body;
    
    // Check if lens material already exists
    const existingLensMaterial = await LensMaterial.findOne({ where: { name } });
    if (existingLensMaterial) {
      return res.status(400).json({
        success: false,
        message: 'Lens material with this name already exists'
      });
    }
    
    const lensMaterial = await LensMaterial.create({
      name,
      description,
      status: status !== undefined ? status : true,
      sort_order: sort_order || 0
    });
    
    res.status(201).json({
      success: true,
      data: lensMaterial,
      message: 'Lens material created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating lens material',
      error: error.message
    });
  }
};

// Update lens material
const updateLensMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, sort_order } = req.body;
    
    const lensMaterial = await LensMaterial.findByPk(id);
    if (!lensMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Lens material not found'
      });
    }
    
    // Check if name is being changed and if it already exists
    if (name && name !== lensMaterial.name) {
      const existingLensMaterial = await LensMaterial.findOne({ where: { name } });
      if (existingLensMaterial) {
        return res.status(400).json({
          success: false,
          message: 'Lens material with this name already exists'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    
    await lensMaterial.update(updateData);
    
    res.status(200).json({
      success: true,
      data: lensMaterial,
      message: 'Lens material updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lens material',
      error: error.message
    });
  }
};

// Get active lens materials only
const getActiveLensMaterials = async (req, res) => {
  try {
    const lensMaterials = await LensMaterial.findAll({
      where: { status: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: lensMaterials,
      message: 'Active lens materials retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active lens materials',
      error: error.message
    });
  }
};

// Search lens materials
const searchLensMaterials = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause.name = { [sequelize.Op.like]: `%${search}%` };
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const lensMaterials = await LensMaterial.findAll({
      where: whereClause,
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: lensMaterials,
      message: 'Lens materials searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching lens materials',
      error: error.message
    });
  }
};

module.exports = {
  getAllLensMaterials,
  getLensMaterialById,
  createLensMaterial,
  updateLensMaterial,
  getActiveLensMaterials,
  searchLensMaterials
}; 