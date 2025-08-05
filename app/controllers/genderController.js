const { Gender } = require('../models');
const { Op } = require('sequelize');

// Get all genders
const getAllGenders = async (req, res) => {
  try {
    const genders = await Gender.findAll({
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: genders,
      count: genders.length
    });
  } catch (error) {
    console.error('Error fetching genders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch genders',
      error: error.message
    });
  }
};

// Get active genders only
const getActiveGenders = async (req, res) => {
  try {
    const genders = await Gender.findAll({
      where: { status: 1 },
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: genders,
      count: genders.length
    });
  } catch (error) {
    console.error('Error fetching active genders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active genders',
      error: error.message
    });
  }
};

// Search genders
const searchGenders = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const genders = await Gender.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } }
        ]
      },
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: genders,
      count: genders.length,
      query: q
    });
  } catch (error) {
    console.error('Error searching genders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search genders',
      error: error.message
    });
  }
};

// Get single gender by ID
const getGenderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const gender = await Gender.findByPk(id);
    
    if (!gender) {
      return res.status(404).json({
        success: false,
        message: 'Gender not found'
      });
    }
    
    res.json({
      success: true,
      data: gender
    });
  } catch (error) {
    console.error('Error fetching gender:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gender',
      error: error.message
    });
  }
};

// Create new gender
const createGender = async (req, res) => {
  try {
    const { name, description, status = 1 } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Gender name is required'
      });
    }
    
    // Check if gender with same name already exists
    const existingGender = await Gender.findOne({
      where: { name: { [Op.like]: name } }
    });
    
    if (existingGender) {
      return res.status(400).json({
        success: false,
        message: 'Gender with this name already exists'
      });
    }
    
    const gender = await Gender.create({
      name,
      description,
      status
    });
    
    res.status(201).json({
      success: true,
      message: 'Gender created successfully',
      data: gender
    });
  } catch (error) {
    console.error('Error creating gender:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create gender',
      error: error.message
    });
  }
};

// Update gender
const updateGender = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    const gender = await Gender.findByPk(id);
    
    if (!gender) {
      return res.status(404).json({
        success: false,
        message: 'Gender not found'
      });
    }
    
    // Check if name is being updated and if it conflicts with existing gender
    if (name && name !== gender.name) {
      const existingGender = await Gender.findOne({
        where: { 
          name: { [Op.like]: name },
          id: { [Op.ne]: id }
        }
      });
      
      if (existingGender) {
        return res.status(400).json({
          success: false,
          message: 'Gender with this name already exists'
        });
      }
    }
    
    // Update only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    
    await gender.update(updateData);
    
    res.json({
      success: true,
      message: 'Gender updated successfully',
      data: gender
    });
  } catch (error) {
    console.error('Error updating gender:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gender',
      error: error.message
    });
  }
};

module.exports = {
  getAllGenders,
  getActiveGenders,
  searchGenders,
  getGenderById,
  createGender,
  updateGender
}; 