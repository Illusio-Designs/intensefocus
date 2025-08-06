const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllAllotedOrders,
  getAllotedOrderById,
  createAllotedOrder,
  updateAllotedOrder,
  deleteAllotedOrder,
  getAllotedOrdersByUser
} = require('../controllers/allotedOrdersController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/alloted-orders - Get all alloted orders
router.get('/', getAllAllotedOrders);

// GET /api/alloted-orders/:id - Get single alloted order
router.get('/:id', getAllotedOrderById);

// POST /api/alloted-orders - Create new alloted order
router.post('/', createAllotedOrder);

// PUT /api/alloted-orders/:id - Update alloted order
router.put('/:id', updateAllotedOrder);

// DELETE /api/alloted-orders/:id - Delete alloted order
router.delete('/:id', deleteAllotedOrder);

// GET /api/alloted-orders/user/:user_id/:user_type - Get alloted orders by user
router.get('/user/:user_id/:user_type', getAllotedOrdersByUser);

module.exports = router; 