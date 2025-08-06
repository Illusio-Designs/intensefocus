const { RetailorWorkingState, User, State } = require('../models');

// Get all retailor working states
const getAllRetailorWorkingStates = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, retailor_id, state_id } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (retailor_id) whereClause.retailor_id = retailor_id;
    if (state_id) whereClause.state_id = state_id;

    const offset = (page - 1) * limit;
    
    const retailorWorkingStates = await RetailorWorkingState.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'retailor', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: State, as: 'state', attributes: ['id', 'name'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: retailorWorkingStates.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(retailorWorkingStates.count / limit),
        total_items: retailorWorkingStates.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching retailor working states:', error);
    res.status(500).json({ success: false, message: 'Error fetching retailor working states', error: error.message });
  }
};

// Get single retailor working state
const getRetailorWorkingStateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const retailorWorkingState = await RetailorWorkingState.findByPk(id, {
      include: [
        { model: User, as: 'retailor', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: State, as: 'state', attributes: ['id', 'name'] }
      ]
    });

    if (!retailorWorkingState) {
      return res.status(404).json({ success: false, message: 'Retailor working state not found' });
    }

    res.json({ success: true, data: retailorWorkingState });
  } catch (error) {
    console.error('Error fetching retailor working state:', error);
    res.status(500).json({ success: false, message: 'Error fetching retailor working state', error: error.message });
  }
};

// Create new retailor working state
const createRetailorWorkingState = async (req, res) => {
  try {
    const { retailor_id, state_id, commission_rate, notes } = req.body;

    // Validate required fields
    if (!retailor_id || !state_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'retailor_id and state_id are required' 
      });
    }

    // Check if retailor and state exist
    const retailor = await User.findByPk(retailor_id);
    const state = await State.findByPk(state_id);

    if (!retailor || !state) {
      return res.status(400).json({ 
        success: false, 
        message: 'Retailor or state not found' 
      });
    }

    // Check if relationship already exists
    const existingRelation = await RetailorWorkingState.findOne({
      where: { retailor_id, state_id }
    });

    if (existingRelation) {
      return res.status(400).json({ 
        success: false, 
        message: 'This retailor-state relationship already exists' 
      });
    }

    const retailorWorkingState = await RetailorWorkingState.create({
      retailor_id,
      state_id,
      commission_rate,
      notes,
      status: 'active',
      assigned_date: new Date()
    });

    res.status(201).json({ success: true, data: retailorWorkingState, message: 'Retailor working state created successfully' });
  } catch (error) {
    console.error('Error creating retailor working state:', error);
    res.status(500).json({ success: false, message: 'Error creating retailor working state', error: error.message });
  }
};

// Update retailor working state
const updateRetailorWorkingState = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, commission_rate, notes } = req.body;

    const retailorWorkingState = await RetailorWorkingState.findByPk(id);
    if (!retailorWorkingState) {
      return res.status(404).json({ success: false, message: 'Retailor working state not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (commission_rate !== undefined) updateData.commission_rate = commission_rate;
    if (notes !== undefined) updateData.notes = notes;

    await retailorWorkingState.update(updateData);

    res.json({ success: true, data: retailorWorkingState, message: 'Retailor working state updated successfully' });
  } catch (error) {
    console.error('Error updating retailor working state:', error);
    res.status(500).json({ success: false, message: 'Error updating retailor working state', error: error.message });
  }
};

// Delete retailor working state
const deleteRetailorWorkingState = async (req, res) => {
  try {
    const { id } = req.params;

    const retailorWorkingState = await RetailorWorkingState.findByPk(id);
    if (!retailorWorkingState) {
      return res.status(404).json({ success: false, message: 'Retailor working state not found' });
    }

    await retailorWorkingState.destroy();

    res.json({ success: true, message: 'Retailor working state deleted successfully' });
  } catch (error) {
    console.error('Error deleting retailor working state:', error);
    res.status(500).json({ success: false, message: 'Error deleting retailor working state', error: error.message });
  }
};

// Get states by retailor
const getStatesByRetailor = async (req, res) => {
  try {
    const { retailor_id } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause = { retailor_id };
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const retailorWorkingStates = await RetailorWorkingState.findAndCountAll({
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
      data: retailorWorkingStates.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(retailorWorkingStates.count / limit),
        total_items: retailorWorkingStates.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching states by retailor:', error);
    res.status(500).json({ success: false, message: 'Error fetching states by retailor', error: error.message });
  }
};

// Get retailors by state
const getRetailorsByState = async (req, res) => {
  try {
    const { state_id } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause = { state_id };
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const retailorWorkingStates = await RetailorWorkingState.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'retailor', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: retailorWorkingStates.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(retailorWorkingStates.count / limit),
        total_items: retailorWorkingStates.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching retailors by state:', error);
    res.status(500).json({ success: false, message: 'Error fetching retailors by state', error: error.message });
  }
};

module.exports = {
  getAllRetailorWorkingStates,
  getRetailorWorkingStateById,
  createRetailorWorkingState,
  updateRetailorWorkingState,
  deleteRetailorWorkingState,
  getStatesByRetailor,
  getRetailorsByState
}; 