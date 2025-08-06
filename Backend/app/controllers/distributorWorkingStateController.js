const { DistributorWorkingState, User, State } = require('../models');

// Get all distributor working states
const getAllDistributorWorkingStates = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, distributor_id, state_id } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (distributor_id) whereClause.distributor_id = distributor_id;
    if (state_id) whereClause.state_id = state_id;

    const offset = (page - 1) * limit;
    
    const distributorWorkingStates = await DistributorWorkingState.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'distributor', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: State, as: 'state', attributes: ['id', 'name'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: distributorWorkingStates.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(distributorWorkingStates.count / limit),
        total_items: distributorWorkingStates.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching distributor working states:', error);
    res.status(500).json({ success: false, message: 'Error fetching distributor working states', error: error.message });
  }
};

// Get single distributor working state
const getDistributorWorkingStateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const distributorWorkingState = await DistributorWorkingState.findByPk(id, {
      include: [
        { model: User, as: 'distributor', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: State, as: 'state', attributes: ['id', 'name'] }
      ]
    });

    if (!distributorWorkingState) {
      return res.status(404).json({ success: false, message: 'Distributor working state not found' });
    }

    res.json({ success: true, data: distributorWorkingState });
  } catch (error) {
    console.error('Error fetching distributor working state:', error);
    res.status(500).json({ success: false, message: 'Error fetching distributor working state', error: error.message });
  }
};

// Create new distributor working state
const createDistributorWorkingState = async (req, res) => {
  try {
    const { distributor_id, state_id, commission_rate, notes } = req.body;

    // Validate required fields
    if (!distributor_id || !state_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'distributor_id and state_id are required' 
      });
    }

    // Check if distributor and state exist
    const distributor = await User.findByPk(distributor_id);
    const state = await State.findByPk(state_id);

    if (!distributor || !state) {
      return res.status(400).json({ 
        success: false, 
        message: 'Distributor or state not found' 
      });
    }

    // Check if relationship already exists
    const existingRelation = await DistributorWorkingState.findOne({
      where: { distributor_id, state_id }
    });

    if (existingRelation) {
      return res.status(400).json({ 
        success: false, 
        message: 'This distributor-state relationship already exists' 
      });
    }

    const distributorWorkingState = await DistributorWorkingState.create({
      distributor_id,
      state_id,
      commission_rate,
      notes,
      status: 'active',
      assigned_date: new Date()
    });

    res.status(201).json({ success: true, data: distributorWorkingState, message: 'Distributor working state created successfully' });
  } catch (error) {
    console.error('Error creating distributor working state:', error);
    res.status(500).json({ success: false, message: 'Error creating distributor working state', error: error.message });
  }
};

// Update distributor working state
const updateDistributorWorkingState = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, commission_rate, notes } = req.body;

    const distributorWorkingState = await DistributorWorkingState.findByPk(id);
    if (!distributorWorkingState) {
      return res.status(404).json({ success: false, message: 'Distributor working state not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (commission_rate !== undefined) updateData.commission_rate = commission_rate;
    if (notes !== undefined) updateData.notes = notes;

    await distributorWorkingState.update(updateData);

    res.json({ success: true, data: distributorWorkingState, message: 'Distributor working state updated successfully' });
  } catch (error) {
    console.error('Error updating distributor working state:', error);
    res.status(500).json({ success: false, message: 'Error updating distributor working state', error: error.message });
  }
};

// Delete distributor working state
const deleteDistributorWorkingState = async (req, res) => {
  try {
    const { id } = req.params;

    const distributorWorkingState = await DistributorWorkingState.findByPk(id);
    if (!distributorWorkingState) {
      return res.status(404).json({ success: false, message: 'Distributor working state not found' });
    }

    await distributorWorkingState.destroy();

    res.json({ success: true, message: 'Distributor working state deleted successfully' });
  } catch (error) {
    console.error('Error deleting distributor working state:', error);
    res.status(500).json({ success: false, message: 'Error deleting distributor working state', error: error.message });
  }
};

// Get states by distributor
const getStatesByDistributor = async (req, res) => {
  try {
    const { distributor_id } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause = { distributor_id };
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const distributorWorkingStates = await DistributorWorkingState.findAndCountAll({
      where: whereClause,
      include: [
        { model: State, as: 'state', attributes: ['id', 'name'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: distributorWorkingStates.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(distributorWorkingStates.count / limit),
        total_items: distributorWorkingStates.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching states by distributor:', error);
    res.status(500).json({ success: false, message: 'Error fetching states by distributor', error: error.message });
  }
};

// Get distributors by state
const getDistributorsByState = async (req, res) => {
  try {
    const { state_id } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause = { state_id };
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const distributorWorkingStates = await DistributorWorkingState.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'distributor', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: distributorWorkingStates.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(distributorWorkingStates.count / limit),
        total_items: distributorWorkingStates.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching distributors by state:', error);
    res.status(500).json({ success: false, message: 'Error fetching distributors by state', error: error.message });
  }
};

module.exports = {
  getAllDistributorWorkingStates,
  getDistributorWorkingStateById,
  createDistributorWorkingState,
  updateDistributorWorkingState,
  deleteDistributorWorkingState,
  getStatesByDistributor,
  getDistributorsByState
}; 