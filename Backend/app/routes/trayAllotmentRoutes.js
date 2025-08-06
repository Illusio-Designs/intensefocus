const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllTrayAllotments,
  getTrayAllotmentById,
  createTrayAllotment,
  updateTrayAllotment,
  deleteTrayAllotment,
  getTrayAllotmentsByUser,
  returnTray
} = require('../controllers/trayAllotmentController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/tray-allotments - Get all tray allotments
router.get('/', getAllTrayAllotments);

// GET /api/tray-allotments/:id - Get single tray allotment
router.get('/:id', getTrayAllotmentById);

// POST /api/tray-allotments - Create new tray allotment
router.post('/', createTrayAllotment);

// PUT /api/tray-allotments/:id - Update tray allotment
router.put('/:id', updateTrayAllotment);

// DELETE /api/tray-allotments/:id - Delete tray allotment
router.delete('/:id', deleteTrayAllotment);

// GET /api/tray-allotments/user/:user_id - Get tray allotments by user
router.get('/user/:user_id', getTrayAllotmentsByUser);

// POST /api/tray-allotments/:id/return - Return tray
router.post('/:id/return', returnTray);

module.exports = router; 