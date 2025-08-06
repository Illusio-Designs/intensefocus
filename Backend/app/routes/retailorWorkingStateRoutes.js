const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllRetailorWorkingStates,
  getRetailorWorkingStateById,
  createRetailorWorkingState,
  updateRetailorWorkingState,
  deleteRetailorWorkingState,
  getStatesByRetailor,
  getRetailorsByState
} = require('../controllers/retailorWorkingStateController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/retailor-working-states - Get all retailor working states
router.get('/', getAllRetailorWorkingStates);

// GET /api/retailor-working-states/:id - Get single retailor working state
router.get('/:id', getRetailorWorkingStateById);

// POST /api/retailor-working-states - Create new retailor working state
router.post('/', createRetailorWorkingState);

// PUT /api/retailor-working-states/:id - Update retailor working state
router.put('/:id', updateRetailorWorkingState);

// DELETE /api/retailor-working-states/:id - Delete retailor working state
router.delete('/:id', deleteRetailorWorkingState);

// GET /api/retailor-working-states/retailor/:retailor_id - Get states by retailor
router.get('/retailor/:retailor_id', getStatesByRetailor);

// GET /api/retailor-working-states/state/:state_id - Get retailors by state
router.get('/state/:state_id', getRetailorsByState);

module.exports = router; 