const { LoginHistory, User } = require('../models');

// Get all login history
const getAllLoginHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, user_id, status, device_type } = req.query;
    
    const whereClause = {};
    if (user_id) whereClause.user_id = user_id;
    if (status) whereClause.status = status;
    if (device_type) whereClause.device_type = device_type;

    const offset = (page - 1) * limit;
    
    const loginHistory = await LoginHistory.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['login_time', 'DESC']]
    });

    res.json({
      success: true,
      data: loginHistory.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(loginHistory.count / limit),
        total_items: loginHistory.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ success: false, message: 'Error fetching login history', error: error.message });
  }
};

// Get single login history
const getLoginHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const loginHistory = await LoginHistory.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'mobile'] }
      ]
    });

    if (!loginHistory) {
      return res.status(404).json({ success: false, message: 'Login history not found' });
    }

    res.json({ success: true, data: loginHistory });
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ success: false, message: 'Error fetching login history', error: error.message });
  }
};

// Create new login history
const createLoginHistory = async (req, res) => {
  try {
    const { user_id, ip_address, user_agent, device_type, location, session_id } = req.body;

    // Validate required fields
    if (!user_id || !ip_address || !user_agent) {
      return res.status(400).json({ 
        success: false, 
        message: 'user_id, ip_address, and user_agent are required' 
      });
    }

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const loginHistory = await LoginHistory.create({
      user_id,
      ip_address,
      user_agent,
      device_type: device_type || 'unknown',
      location: location || null,
      session_id: session_id || null,
      login_time: new Date(),
      logout_time: null,
      status: 'active'
    });

    res.status(201).json({ success: true, data: loginHistory, message: 'Login history created successfully' });
  } catch (error) {
    console.error('Error creating login history:', error);
    res.status(500).json({ success: false, message: 'Error creating login history', error: error.message });
  }
};

// Update login history (logout)
const updateLoginHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { logout_time, status, notes } = req.body;

    const loginHistory = await LoginHistory.findByPk(id);
    if (!loginHistory) {
      return res.status(404).json({ success: false, message: 'Login history not found' });
    }

    const updateData = {};
    if (logout_time) updateData.logout_time = logout_time;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    await loginHistory.update(updateData);

    res.json({ success: true, data: loginHistory, message: 'Login history updated successfully' });
  } catch (error) {
    console.error('Error updating login history:', error);
    res.status(500).json({ success: false, message: 'Error updating login history', error: error.message });
  }
};

// Delete login history
const deleteLoginHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const loginHistory = await LoginHistory.findByPk(id);
    if (!loginHistory) {
      return res.status(404).json({ success: false, message: 'Login history not found' });
    }

    await loginHistory.destroy();

    res.json({ success: true, message: 'Login history deleted successfully' });
  } catch (error) {
    console.error('Error deleting login history:', error);
    res.status(500).json({ success: false, message: 'Error deleting login history', error: error.message });
  }
};

// Get login history by user
const getLoginHistoryByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause = { user_id };
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const loginHistory = await LoginHistory.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['login_time', 'DESC']]
    });

    res.json({
      success: true,
      data: loginHistory.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(loginHistory.count / limit),
        total_items: loginHistory.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching login history by user:', error);
    res.status(500).json({ success: false, message: 'Error fetching login history by user', error: error.message });
  }
};

// Logout user (update logout time)
const logoutUser = async (req, res) => {
  try {
    const { session_id } = req.params;

    const loginHistory = await LoginHistory.findOne({
      where: { session_id, status: 'active' }
    });

    if (!loginHistory) {
      return res.status(404).json({ success: false, message: 'Active session not found' });
    }

    await loginHistory.update({
      logout_time: new Date(),
      status: 'logged_out'
    });

    res.json({ success: true, data: loginHistory, message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ success: false, message: 'Error logging out user', error: error.message });
  }
};

// Get active sessions for user
const getActiveSessions = async (req, res) => {
  try {
    const { user_id } = req.params;

    const activeSessions = await LoginHistory.findAll({
      where: { user_id, status: 'active' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      order: [['login_time', 'DESC']]
    });

    res.json({ success: true, data: activeSessions });
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    res.status(500).json({ success: false, message: 'Error fetching active sessions', error: error.message });
  }
};

// Force logout all sessions for user
const forceLogoutAllSessions = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await LoginHistory.update(
      {
        logout_time: new Date(),
        status: 'force_logged_out'
      },
      {
        where: { user_id, status: 'active' }
      }
    );

    res.json({ 
      success: true, 
      message: `${result[0]} sessions force logged out`,
      updated_count: result[0]
    });
  } catch (error) {
    console.error('Error force logging out all sessions:', error);
    res.status(500).json({ success: false, message: 'Error force logging out all sessions', error: error.message });
  }
};

// Get login statistics
const getLoginStatistics = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const loginStats = await LoginHistory.findAll({
      where: {
        user_id,
        login_time: {
          [require('sequelize').Op.gte]: startDate
        }
      },
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('login_time')), 'date'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'login_count']
      ],
      group: [require('sequelize').fn('DATE', require('sequelize').col('login_time'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('login_time')), 'ASC']]
    });

    res.json({ success: true, data: loginStats });
  } catch (error) {
    console.error('Error fetching login statistics:', error);
    res.status(500).json({ success: false, message: 'Error fetching login statistics', error: error.message });
  }
};

module.exports = {
  getAllLoginHistory,
  getLoginHistoryById,
  createLoginHistory,
  updateLoginHistory,
  deleteLoginHistory,
  getLoginHistoryByUser,
  logoutUser,
  getActiveSessions,
  forceLogoutAllSessions,
  getLoginStatistics
}; 