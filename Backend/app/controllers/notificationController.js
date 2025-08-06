const { Notification, User } = require('../models');

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, user_id, notification_type, is_read } = req.query;
    
    const whereClause = {};
    if (user_id) whereClause.user_id = user_id;
    if (notification_type) whereClause.notification_type = notification_type;
    if (is_read !== undefined) whereClause.is_read = is_read === 'true';

    const offset = (page - 1) * limit;
    
    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: notifications.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(notifications.count / limit),
        total_items: notifications.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Error fetching notifications', error: error.message });
  }
};

// Get single notification
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'mobile'] }
      ]
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ success: false, message: 'Error fetching notification', error: error.message });
  }
};

// Create new notification
const createNotification = async (req, res) => {
  try {
    const { user_id, notification_type, title, message, data, priority } = req.body;

    // Validate required fields
    if (!user_id || !notification_type || !title || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'user_id, notification_type, title, and message are required' 
      });
    }

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Validate notification type
    const validTypes = ['order', 'payment', 'system', 'promotion', 'alert'];
    if (!validTypes.includes(notification_type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'notification_type must be one of: order, payment, system, promotion, alert' 
      });
    }

    const notification = await Notification.create({
      user_id,
      notification_type,
      title,
      message,
      data: data || null,
      priority: priority || 'normal',
      is_read: false,
      read_at: null
    });

    res.status(201).json({ success: true, data: notification, message: 'Notification created successfully' });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, message: 'Error creating notification', error: error.message });
  }
};

// Update notification
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, data, priority, is_read } = req.body;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (message !== undefined) updateData.message = message;
    if (data !== undefined) updateData.data = data;
    if (priority) updateData.priority = priority;
    if (is_read !== undefined) {
      updateData.is_read = is_read;
      if (is_read && !notification.is_read) {
        updateData.read_at = new Date();
      } else if (!is_read) {
        updateData.read_at = null;
      }
    }

    await notification.update(updateData);

    res.json({ success: true, data: notification, message: 'Notification updated successfully' });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ success: false, message: 'Error updating notification', error: error.message });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.destroy();

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Error deleting notification', error: error.message });
  }
};

// Get notifications by user
const getNotificationsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10, notification_type, is_read } = req.query;

    const whereClause = { user_id };
    if (notification_type) whereClause.notification_type = notification_type;
    if (is_read !== undefined) whereClause.is_read = is_read === 'true';

    const offset = (page - 1) * limit;

    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: notifications.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(notifications.count / limit),
        total_items: notifications.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching notifications by user:', error);
    res.status(500).json({ success: false, message: 'Error fetching notifications by user', error: error.message });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.is_read) {
      return res.status(400).json({ success: false, message: 'Notification is already read' });
    }

    await notification.update({
      is_read: true,
      read_at: new Date()
    });

    res.json({ success: true, data: notification, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Error marking notification as read', error: error.message });
  }
};

// Mark all notifications as read for user
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await Notification.update(
      {
        is_read: true,
        read_at: new Date()
      },
      {
        where: { user_id, is_read: false }
      }
    );

    res.json({ 
      success: true, 
      message: `${result[0]} notifications marked as read`,
      updated_count: result[0]
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Error marking all notifications as read', error: error.message });
  }
};

// Get unread count for user
const getUnreadCount = async (req, res) => {
  try {
    const { user_id } = req.params;

    const count = await Notification.count({
      where: { user_id, is_read: false }
    });

    res.json({ success: true, data: { unread_count: count } });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, message: 'Error fetching unread count', error: error.message });
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount
}; 