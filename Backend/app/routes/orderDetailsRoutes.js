const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
  getOrderDetailsByOrder,
  getOrderSummary
} = require('../controllers/orderDetailsController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/order-details - Get all order details
router.get('/', getAllOrderDetails);

// GET /api/order-details/:id - Get single order detail
router.get('/:id', getOrderDetailById);

// POST /api/order-details - Create new order detail
router.post('/', createOrderDetail);

// PUT /api/order-details/:id - Update order detail
router.put('/:id', updateOrderDetail);

// DELETE /api/order-details/:id - Delete order detail
router.delete('/:id', deleteOrderDetail);

// GET /api/order-details/order/:order_id - Get order details by order
router.get('/order/:order_id', getOrderDetailsByOrder);

// GET /api/order-details/order/:order_id/summary - Get order summary
router.get('/order/:order_id/summary', getOrderSummary);

module.exports = router; 