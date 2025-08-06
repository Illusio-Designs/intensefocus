const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount
} = require('../controllers/notificationController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/notifications - Get all notifications
router.get('/', getAllNotifications);

// GET /api/notifications/:id - Get single notification
router.get('/:id', getNotificationById);

// POST /api/notifications - Create new notification
router.post('/', createNotification);

// PUT /api/notifications/:id - Update notification
router.put('/:id', updateNotification);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', deleteNotification);

// GET /api/notifications/user/:user_id - Get notifications by user
router.get('/user/:user_id', getNotificationsByUser);

// POST /api/notifications/:id/read - Mark notification as read
router.post('/:id/read', markNotificationAsRead);

// POST /api/notifications/user/:user_id/read-all - Mark all notifications as read
router.post('/user/:user_id/read-all', markAllNotificationsAsRead);

// GET /api/notifications/user/:user_id/unread-count - Get unread count
router.get('/user/:user_id/unread-count', getUnreadCount);

module.exports = router; 