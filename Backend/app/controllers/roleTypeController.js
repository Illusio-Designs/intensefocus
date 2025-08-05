const { RoleType } = require('../models');

// Get all role types
const getAllRoleTypes = async (req, res) => {
  try {
    const roleTypes = await RoleType.findAll({
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: roleTypes,
      message: 'Role types retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving role types',
      error: error.message
    });
  }
};

// Get single role type by ID
const getRoleTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const roleType = await RoleType.findByPk(id);
    
    if (!roleType) {
      return res.status(404).json({
        success: false,
        message: 'Role type not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: roleType,
      message: 'Role type retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving role type',
      error: error.message
    });
  }
};

// Create new role type
const createRoleType = async (req, res) => {
  try {
    const { name, description, permissions, status } = req.body;
    
    // Check if role type already exists
    const existingRoleType = await RoleType.findOne({ where: { name } });
    if (existingRoleType) {
      return res.status(400).json({
        success: false,
        message: 'Role type with this name already exists'
      });
    }
    
    const roleType = await RoleType.create({
      name,
      description,
      permissions,
      status: status !== undefined ? status : true
    });
    
    res.status(201).json({
      success: true,
      data: roleType,
      message: 'Role type created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating role type',
      error: error.message
    });
  }
};

// Update role type
const updateRoleType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions, status } = req.body;
    
    const roleType = await RoleType.findByPk(id);
    if (!roleType) {
      return res.status(404).json({
        success: false,
        message: 'Role type not found'
      });
    }
    
    // Check if name is being changed and if it already exists
    if (name && name !== roleType.name) {
      const existingRoleType = await RoleType.findOne({ where: { name } });
      if (existingRoleType) {
        return res.status(400).json({
          success: false,
          message: 'Role type with this name already exists'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (permissions !== undefined) updateData.permissions = permissions;
    if (status !== undefined) updateData.status = status;
    
    await roleType.update(updateData);
    
    res.status(200).json({
      success: true,
      data: roleType,
      message: 'Role type updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating role type',
      error: error.message
    });
  }
};

// Get active role types only
const getActiveRoleTypes = async (req, res) => {
  try {
    const roleTypes = await RoleType.findAll({
      where: { status: true },
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: roleTypes,
      message: 'Active role types retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active role types',
      error: error.message
    });
  }
};

// Search role types
const searchRoleTypes = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause.name = { [sequelize.Op.like]: `%${search}%` };
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const roleTypes = await RoleType.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: roleTypes,
      message: 'Role types searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching role types',
      error: error.message
    });
  }
};

module.exports = {
  getAllRoleTypes,
  getRoleTypeById,
  createRoleType,
  updateRoleType,
  getActiveRoleTypes,
  searchRoleTypes
}; 