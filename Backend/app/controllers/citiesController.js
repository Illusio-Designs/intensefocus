const { Cities, State } = require('../models');

// Get all cities
const getAllCities = async (req, res) => {
  try {
    const cities = await Cities.findAll({
      include: [
        { model: State, as: 'state' }
      ],
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: cities,
      message: 'Cities retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving cities',
      error: error.message
    });
  }
};

// Get single city by ID
const getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await Cities.findByPk(id, {
      include: [
        { model: State, as: 'state' }
      ]
    });
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: city,
      message: 'City retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving city',
      error: error.message
    });
  }
};

// Create new city
const createCity = async (req, res) => {
  try {
    const { name, state_id, country_id, status } = req.body;
    
    // Check if city already exists in the same state
    const existingCity = await Cities.findOne({ 
      where: { 
        name,
        state_id 
      } 
    });
    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: 'City with this name already exists in the selected state'
      });
    }
    
    // Verify state exists
    const state = await State.findByPk(state_id);
    if (!state) {
      return res.status(400).json({
        success: false,
        message: 'Selected state does not exist'
      });
    }
    
    const city = await Cities.create({
      name,
      state_id,
      country_id: country_id || 1,
      status: status !== undefined ? status : true
    });
    
    res.status(201).json({
      success: true,
      data: city,
      message: 'City created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating city',
      error: error.message
    });
  }
};

// Update city
const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state_id, country_id, status } = req.body;
    
    const city = await Cities.findByPk(id);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }
    
    // Check if name is being changed and if it already exists in the same state
    if (name && (name !== city.name || state_id !== city.state_id)) {
      const existingCity = await Cities.findOne({ 
        where: { 
          name,
          state_id: state_id || city.state_id
        } 
      });
      if (existingCity && existingCity.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'City with this name already exists in the selected state'
        });
      }
    }
    
    // Verify state exists if being changed
    if (state_id && state_id !== city.state_id) {
      const state = await State.findByPk(state_id);
      if (!state) {
        return res.status(400).json({
          success: false,
          message: 'Selected state does not exist'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (state_id !== undefined) updateData.state_id = state_id;
    if (country_id !== undefined) updateData.country_id = country_id;
    if (status !== undefined) updateData.status = status;
    
    await city.update(updateData);
    
    res.status(200).json({
      success: true,
      data: city,
      message: 'City updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating city',
      error: error.message
    });
  }
};

// Get active cities only
const getActiveCities = async (req, res) => {
  try {
    const cities = await Cities.findAll({
      where: { status: true },
      include: [
        { model: State, as: 'state' }
      ],
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: cities,
      message: 'Active cities retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active cities',
      error: error.message
    });
  }
};

// Get cities by state
const getCitiesByState = async (req, res) => {
  try {
    const { state_id } = req.params;
    
    const cities = await Cities.findAll({
      where: { 
        state_id,
        status: true 
      },
      include: [
        { model: State, as: 'state' }
      ],
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: cities,
      message: 'Cities by state retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving cities by state',
      error: error.message
    });
  }
};

// Search cities
const searchCities = async (req, res) => {
  try {
    const { search, state_id, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause.name = { [sequelize.Op.like]: `%${search}%` };
    }
    
    if (state_id) {
      whereClause.state_id = state_id;
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const cities = await Cities.findAll({
      where: whereClause,
      include: [
        { model: State, as: 'state' }
      ],
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: cities,
      message: 'Cities searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching cities',
      error: error.message
    });
  }
};

module.exports = {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  getActiveCities,
  getCitiesByState,
  searchCities
}; 