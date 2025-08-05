const { Zone, State, Cities } = require('../models');

// Get all zones
const getAllZones = async (req, res) => {
  try {
    const zones = await Zone.findAll({
      include: [
        { model: State, as: 'state' },
        { model: Cities, as: 'city' }
      ],
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: zones,
      message: 'Zones retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving zones',
      error: error.message
    });
  }
};

// Get single zone by ID
const getZoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const zone = await Zone.findByPk(id, {
      include: [
        { model: State, as: 'state' },
        { model: Cities, as: 'city' }
      ]
    });
    
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Zone not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: zone,
      message: 'Zone retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving zone',
      error: error.message
    });
  }
};

// Create new zone
const createZone = async (req, res) => {
  try {
    const { name, description, state_id, city_id, status, sort_order } = req.body;
    
    // Check if zone already exists
    const existingZone = await Zone.findOne({ where: { name } });
    if (existingZone) {
      return res.status(400).json({
        success: false,
        message: 'Zone with this name already exists'
      });
    }
    
    // Verify state exists if provided
    if (state_id) {
      const state = await State.findByPk(state_id);
      if (!state) {
        return res.status(400).json({
          success: false,
          message: 'Selected state does not exist'
        });
      }
    }
    
    // Verify city exists if provided
    if (city_id) {
      const city = await Cities.findByPk(city_id);
      if (!city) {
        return res.status(400).json({
          success: false,
          message: 'Selected city does not exist'
        });
      }
    }
    
    const zone = await Zone.create({
      name,
      description,
      state_id,
      city_id,
      status: status !== undefined ? status : true,
      sort_order: sort_order || 0
    });
    
    res.status(201).json({
      success: true,
      data: zone,
      message: 'Zone created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating zone',
      error: error.message
    });
  }
};

// Update zone
const updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, state_id, city_id, status, sort_order } = req.body;
    
    const zone = await Zone.findByPk(id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Zone not found'
      });
    }
    
    // Check if name is being changed and if it already exists
    if (name && name !== zone.name) {
      const existingZone = await Zone.findOne({ where: { name } });
      if (existingZone) {
        return res.status(400).json({
          success: false,
          message: 'Zone with this name already exists'
        });
      }
    }
    
    // Verify state exists if being changed
    if (state_id && state_id !== zone.state_id) {
      const state = await State.findByPk(state_id);
      if (!state) {
        return res.status(400).json({
          success: false,
          message: 'Selected state does not exist'
        });
      }
    }
    
    // Verify city exists if being changed
    if (city_id && city_id !== zone.city_id) {
      const city = await Cities.findByPk(city_id);
      if (!city) {
        return res.status(400).json({
          success: false,
          message: 'Selected city does not exist'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (state_id !== undefined) updateData.state_id = state_id;
    if (city_id !== undefined) updateData.city_id = city_id;
    if (status !== undefined) updateData.status = status;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    
    await zone.update(updateData);
    
    res.status(200).json({
      success: true,
      data: zone,
      message: 'Zone updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating zone',
      error: error.message
    });
  }
};

// Get active zones only
const getActiveZones = async (req, res) => {
  try {
    const zones = await Zone.findAll({
      where: { status: true },
      include: [
        { model: State, as: 'state' },
        { model: Cities, as: 'city' }
      ],
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: zones,
      message: 'Active zones retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active zones',
      error: error.message
    });
  }
};

// Get zones by state
const getZonesByState = async (req, res) => {
  try {
    const { state_id } = req.params;
    
    const zones = await Zone.findAll({
      where: { 
        state_id,
        status: true 
      },
      include: [
        { model: State, as: 'state' },
        { model: Cities, as: 'city' }
      ],
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: zones,
      message: 'Zones by state retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving zones by state',
      error: error.message
    });
  }
};

// Get zones by city
const getZonesByCity = async (req, res) => {
  try {
    const { city_id } = req.params;
    
    const zones = await Zone.findAll({
      where: { 
        city_id,
        status: true 
      },
      include: [
        { model: State, as: 'state' },
        { model: Cities, as: 'city' }
      ],
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: zones,
      message: 'Zones by city retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving zones by city',
      error: error.message
    });
  }
};

// Search zones
const searchZones = async (req, res) => {
  try {
    const { search, state_id, city_id, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause.name = { [sequelize.Op.like]: `%${search}%` };
    }
    
    if (state_id) {
      whereClause.state_id = state_id;
    }
    
    if (city_id) {
      whereClause.city_id = city_id;
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const zones = await Zone.findAll({
      where: whereClause,
      include: [
        { model: State, as: 'state' },
        { model: Cities, as: 'city' }
      ],
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: zones,
      message: 'Zones searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching zones',
      error: error.message
    });
  }
};

module.exports = {
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  getActiveZones,
  getZonesByState,
  getZonesByCity,
  searchZones
}; 