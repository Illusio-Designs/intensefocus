const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllSalesmanTargets,
  getSalesmanTargetById,
  createSalesmanTarget,
  updateSalesmanTarget,
  deleteSalesmanTarget,
  getTargetsBySalesman,
  getPerformanceSummary
} = require('../controllers/salesmanTargetController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/salesman-targets - Get all salesman targets
router.get('/', getAllSalesmanTargets);

// GET /api/salesman-targets/:id - Get single salesman target
router.get('/:id', getSalesmanTargetById);

// POST /api/salesman-targets - Create new salesman target
router.post('/', createSalesmanTarget);

// PUT /api/salesman-targets/:id - Update salesman target
router.put('/:id', updateSalesmanTarget);

// DELETE /api/salesman-targets/:id - Delete salesman target
router.delete('/:id', deleteSalesmanTarget);

// GET /api/salesman-targets/salesman/:salesman_id - Get targets by salesman
router.get('/salesman/:salesman_id', getTargetsBySalesman);

// GET /api/salesman-targets/performance/:salesman_id/:year - Get performance summary
router.get('/performance/:salesman_id/:year', getPerformanceSummary);

module.exports = router; 