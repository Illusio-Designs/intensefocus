const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
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
} = require('../controllers/loginHistoryController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/login-history - Get all login history
router.get('/', getAllLoginHistory);

// GET /api/login-history/:id - Get single login history
router.get('/:id', getLoginHistoryById);

// POST /api/login-history - Create new login history
router.post('/', createLoginHistory);

// PUT /api/login-history/:id - Update login history
router.put('/:id', updateLoginHistory);

// DELETE /api/login-history/:id - Delete login history
router.delete('/:id', deleteLoginHistory);

// GET /api/login-history/user/:user_id - Get login history by user
router.get('/user/:user_id', getLoginHistoryByUser);

// POST /api/login-history/logout/:session_id - Logout user
router.post('/logout/:session_id', logoutUser);

// GET /api/login-history/user/:user_id/active-sessions - Get active sessions
router.get('/user/:user_id/active-sessions', getActiveSessions);

// POST /api/login-history/user/:user_id/force-logout-all - Force logout all sessions
router.post('/user/:user_id/force-logout-all', forceLogoutAllSessions);

// GET /api/login-history/user/:user_id/statistics - Get login statistics
router.get('/user/:user_id/statistics', getLoginStatistics);

module.exports = router; 