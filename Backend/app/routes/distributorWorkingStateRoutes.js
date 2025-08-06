const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllDistributorWorkingStates,
  getDistributorWorkingStateById,
  createDistributorWorkingState,
  updateDistributorWorkingState,
  deleteDistributorWorkingState,
  getStatesByDistributor,
  getDistributorsByState
} = require('../controllers/distributorWorkingStateController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/distributor-working-states - Get all distributor working states
router.get('/', getAllDistributorWorkingStates);

// GET /api/distributor-working-states/:id - Get single distributor working state
router.get('/:id', getDistributorWorkingStateById);

// POST /api/distributor-working-states - Create new distributor working state
router.post('/', createDistributorWorkingState);

// PUT /api/distributor-working-states/:id - Update distributor working state
router.put('/:id', updateDistributorWorkingState);

// DELETE /api/distributor-working-states/:id - Delete distributor working state
router.delete('/:id', deleteDistributorWorkingState);

// GET /api/distributor-working-states/distributor/:distributor_id - Get states by distributor
router.get('/distributor/:distributor_id', getStatesByDistributor);

// GET /api/distributor-working-states/state/:state_id - Get distributors by state
router.get('/state/:state_id', getDistributorsByState);

module.exports = router; 