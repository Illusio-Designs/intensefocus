const { TrayAllotment, User } = require('../models');

// Get all tray allotments
const getAllTrayAllotments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, user_id, tray_type } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (user_id) whereClause.user_id = user_id;
    if (tray_type) whereClause.tray_type = tray_type;

    const offset = (page - 1) * limit;
    
    const trayAllotments = await TrayAllotment.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['alloted_date', 'DESC']]
    });

    res.json({
      success: true,
      data: trayAllotments.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(trayAllotments.count / limit),
        total_items: trayAllotments.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching tray allotments:', error);
    res.status(500).json({ success: false, message: 'Error fetching tray allotments', error: error.message });
  }
};

// Get single tray allotment
const getTrayAllotmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const trayAllotment = await TrayAllotment.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'mobile'] }
      ]
    });

    if (!trayAllotment) {
      return res.status(404).json({ success: false, message: 'Tray allotment not found' });
    }

    res.json({ success: true, data: trayAllotment });
  } catch (error) {
    console.error('Error fetching tray allotment:', error);
    res.status(500).json({ success: false, message: 'Error fetching tray allotment', error: error.message });
  }
};

// Create new tray allotment
const createTrayAllotment = async (req, res) => {
  try {
    const { user_id, tray_type, tray_number, notes } = req.body;

    // Validate required fields
    if (!user_id || !tray_type || !tray_number) {
      return res.status(400).json({ 
        success: false, 
        message: 'user_id, tray_type, and tray_number are required' 
      });
    }

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Check if tray is already allotted
    const existingAllotment = await TrayAllotment.findOne({
      where: { tray_number, status: 'active' }
    });

    if (existingAllotment) {
      return res.status(400).json({ 
        success: false, 
        message: 'This tray is already allotted to another user' 
      });
    }

    const trayAllotment = await TrayAllotment.create({
      user_id,
      tray_type,
      tray_number,
      notes,
      status: 'active',
      alloted_date: new Date()
    });

    res.status(201).json({ success: true, data: trayAllotment, message: 'Tray allotment created successfully' });
  } catch (error) {
    console.error('Error creating tray allotment:', error);
    res.status(500).json({ success: false, message: 'Error creating tray allotment', error: error.message });
  }
};

// Update tray allotment
const updateTrayAllotment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, returned_date } = req.body;

    const trayAllotment = await TrayAllotment.findByPk(id);
    if (!trayAllotment) {
      return res.status(404).json({ success: false, message: 'Tray allotment not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (returned_date) updateData.returned_date = returned_date;

    await trayAllotment.update(updateData);

    res.json({ success: true, data: trayAllotment, message: 'Tray allotment updated successfully' });
  } catch (error) {
    console.error('Error updating tray allotment:', error);
    res.status(500).json({ success: false, message: 'Error updating tray allotment', error: error.message });
  }
};

// Delete tray allotment
const deleteTrayAllotment = async (req, res) => {
  try {
    const { id } = req.params;

    const trayAllotment = await TrayAllotment.findByPk(id);
    if (!trayAllotment) {
      return res.status(404).json({ success: false, message: 'Tray allotment not found' });
    }

    await trayAllotment.destroy();

    res.json({ success: true, message: 'Tray allotment deleted successfully' });
  } catch (error) {
    console.error('Error deleting tray allotment:', error);
    res.status(500).json({ success: false, message: 'Error deleting tray allotment', error: error.message });
  }
};

// Get tray allotments by user
const getTrayAllotmentsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause = { user_id };
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const trayAllotments = await TrayAllotment.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['alloted_date', 'DESC']]
    });

    res.json({
      success: true,
      data: trayAllotments.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(trayAllotments.count / limit),
        total_items: trayAllotments.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching tray allotments by user:', error);
    res.status(500).json({ success: false, message: 'Error fetching tray allotments by user', error: error.message });
  }
};

// Return tray
const returnTray = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const trayAllotment = await TrayAllotment.findByPk(id);
    if (!trayAllotment) {
      return res.status(404).json({ success: false, message: 'Tray allotment not found' });
    }

    if (trayAllotment.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Tray is already returned' });
    }

    await trayAllotment.update({
      status: 'returned',
      returned_date: new Date(),
      notes: notes || trayAllotment.notes
    });

    res.json({ success: true, data: trayAllotment, message: 'Tray returned successfully' });
  } catch (error) {
    console.error('Error returning tray:', error);
    res.status(500).json({ success: false, message: 'Error returning tray', error: error.message });
  }
};

module.exports = {
  getAllTrayAllotments,
  getTrayAllotmentById,
  createTrayAllotment,
  updateTrayAllotment,
  deleteTrayAllotment,
  getTrayAllotmentsByUser,
  returnTray
}; 