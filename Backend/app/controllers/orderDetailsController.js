const { OrderDetails, Product } = require('../models');

// Get all order details
const getAllOrderDetails = async (req, res) => {
  try {
    const { page = 1, limit = 10, order_id, product_id } = req.query;
    
    const whereClause = {};
    if (order_id) whereClause.order_id = order_id;
    if (product_id) whereClause.product_id = product_id;

    const offset = (page - 1) * limit;
    
    const orderDetails = await OrderDetails.findAndCountAll({
      where: whereClause,
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'price'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: orderDetails.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(orderDetails.count / limit),
        total_items: orderDetails.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ success: false, message: 'Error fetching order details', error: error.message });
  }
};

// Get single order detail
const getOrderDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const orderDetail = await OrderDetails.findByPk(id, {
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'price'] }
      ]
    });

    if (!orderDetail) {
      return res.status(404).json({ success: false, message: 'Order detail not found' });
    }

    res.json({ success: true, data: orderDetail });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    res.status(500).json({ success: false, message: 'Error fetching order detail', error: error.message });
  }
};

// Create new order detail
const createOrderDetail = async (req, res) => {
  try {
    const { order_id, product_id, quantity, unit_price, discount_amount, notes } = req.body;

    // Validate required fields
    if (!order_id || !product_id || !quantity || !unit_price) {
      return res.status(400).json({ 
        success: false, 
        message: 'order_id, product_id, quantity, and unit_price are required' 
      });
    }

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(400).json({ success: false, message: 'Product not found' });
    }

    // Calculate totals
    const subtotal = quantity * unit_price;
    const total_amount = subtotal - (discount_amount || 0);

    const orderDetail = await OrderDetails.create({
      order_id,
      product_id,
      quantity,
      unit_price,
      subtotal,
      discount_amount: discount_amount || 0.00,
      total_amount,
      notes,
      status: 'active'
    });

    res.status(201).json({ success: true, data: orderDetail, message: 'Order detail created successfully' });
  } catch (error) {
    console.error('Error creating order detail:', error);
    res.status(500).json({ success: false, message: 'Error creating order detail', error: error.message });
  }
};

// Update order detail
const updateOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, unit_price, discount_amount, notes, status } = req.body;

    const orderDetail = await OrderDetails.findByPk(id);
    if (!orderDetail) {
      return res.status(404).json({ success: false, message: 'Order detail not found' });
    }

    const updateData = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (unit_price !== undefined) updateData.unit_price = unit_price;
    if (discount_amount !== undefined) updateData.discount_amount = discount_amount;
    if (notes !== undefined) updateData.notes = notes;
    if (status) updateData.status = status;

    // Recalculate totals if quantity or unit_price changed
    if (quantity !== undefined || unit_price !== undefined) {
      const newQuantity = quantity !== undefined ? quantity : orderDetail.quantity;
      const newUnitPrice = unit_price !== undefined ? unit_price : orderDetail.unit_price;
      const newDiscountAmount = discount_amount !== undefined ? discount_amount : orderDetail.discount_amount;
      
      updateData.subtotal = newQuantity * newUnitPrice;
      updateData.total_amount = updateData.subtotal - newDiscountAmount;
    }

    await orderDetail.update(updateData);

    res.json({ success: true, data: orderDetail, message: 'Order detail updated successfully' });
  } catch (error) {
    console.error('Error updating order detail:', error);
    res.status(500).json({ success: false, message: 'Error updating order detail', error: error.message });
  }
};

// Delete order detail
const deleteOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const orderDetail = await OrderDetails.findByPk(id);
    if (!orderDetail) {
      return res.status(404).json({ success: false, message: 'Order detail not found' });
    }

    await orderDetail.destroy();

    res.json({ success: true, message: 'Order detail deleted successfully' });
  } catch (error) {
    console.error('Error deleting order detail:', error);
    res.status(500).json({ success: false, message: 'Error deleting order detail', error: error.message });
  }
};

// Get order details by order
const getOrderDetailsByOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const orderDetails = await OrderDetails.findAndCountAll({
      where: { order_id },
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'price'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'ASC']]
    });

    res.json({
      success: true,
      data: orderDetails.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(orderDetails.count / limit),
        total_items: orderDetails.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching order details by order:', error);
    res.status(500).json({ success: false, message: 'Error fetching order details by order', error: error.message });
  }
};

// Get order summary
const getOrderSummary = async (req, res) => {
  try {
    const { order_id } = req.params;

    const orderDetails = await OrderDetails.findAll({
      where: { order_id },
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'sku'] }
      ],
      order: [['created_at', 'ASC']]
    });

    // Calculate summary
    const summary = {
      total_items: 0,
      total_quantity: 0,
      total_subtotal: 0,
      total_discount: 0,
      total_amount: 0,
      items: orderDetails
    };

    orderDetails.forEach(detail => {
      summary.total_items++;
      summary.total_quantity += detail.quantity;
      summary.total_subtotal += parseFloat(detail.subtotal);
      summary.total_discount += parseFloat(detail.discount_amount);
      summary.total_amount += parseFloat(detail.total_amount);
    });

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching order summary:', error);
    res.status(500).json({ success: false, message: 'Error fetching order summary', error: error.message });
  }
};

module.exports = {
  getAllOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
  getOrderDetailsByOrder,
  getOrderSummary
}; 