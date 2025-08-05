const { State } = require('../models');

// Get all states
const getAllStates = async (req, res) => {
  try {
    const states = await State.findAll({
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: states,
      message: 'States retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving states',
      error: error.message
    });
  }
};

// Get single state by ID
const getStateById = async (req, res) => {
  try {
    const { id } = req.params;
    const state = await State.findByPk(id);
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: state,
      message: 'State retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving state',
      error: error.message
    });
  }
};

// Create new state
const createState = async (req, res) => {
  try {
    const { name, code, country_id, status } = req.body;
    
    // Check if state already exists
    const existingState = await State.findOne({ where: { name } });
    if (existingState) {
      return res.status(400).json({
        success: false,
        message: 'State with this name already exists'
      });
    }
    
    // Check if code already exists
    if (code) {
      const existingStateCode = await State.findOne({ where: { code } });
      if (existingStateCode) {
        return res.status(400).json({
          success: false,
          message: 'State with this code already exists'
        });
      }
    }
    
    const state = await State.create({
      name,
      code,
      country_id: country_id || 1,
      status: status !== undefined ? status : true
    });
    
    res.status(201).json({
      success: true,
      data: state,
      message: 'State created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating state',
      error: error.message
    });
  }
};

// Update state
const updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, country_id, status } = req.body;
    
    const state = await State.findByPk(id);
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }
    
    // Check if name is being changed and if it already exists
    if (name && name !== state.name) {
      const existingState = await State.findOne({ where: { name } });
      if (existingState) {
        return res.status(400).json({
          success: false,
          message: 'State with this name already exists'
        });
      }
    }
    
    // Check if code is being changed and if it already exists
    if (code && code !== state.code) {
      const existingStateCode = await State.findOne({ where: { code } });
      if (existingStateCode) {
        return res.status(400).json({
          success: false,
          message: 'State with this code already exists'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (code !== undefined) updateData.code = code;
    if (country_id !== undefined) updateData.country_id = country_id;
    if (status !== undefined) updateData.status = status;
    
    await state.update(updateData);
    
    res.status(200).json({
      success: true,
      data: state,
      message: 'State updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating state',
      error: error.message
    });
  }
};

// Get active states only
const getActiveStates = async (req, res) => {
  try {
    const states = await State.findAll({
      where: { status: true },
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: states,
      message: 'Active states retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active states',
      error: error.message
    });
  }
};

// Search states
const searchStates = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause = {
        [sequelize.Op.or]: [
          { name: { [sequelize.Op.like]: `%${search}%` } },
          { code: { [sequelize.Op.like]: `%${search}%` } }
        ]
      };
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const states = await State.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: states,
      message: 'States searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching states',
      error: error.message
    });
  }
};

module.exports = {
  getAllStates,
  getStateById,
  createState,
  updateState,
  getActiveStates,
  searchStates
}; 