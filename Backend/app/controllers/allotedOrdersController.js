const { AllotedOrders, User, Product } = require('../models');

// Get all alloted orders
const getAllAllotedOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, distributor_id, retailor_id, salesman_id } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (distributor_id) whereClause.distributor_id = distributor_id;
    if (retailor_id) whereClause.retailor_id = retailor_id;
    if (salesman_id) whereClause.salesman_id = salesman_id;

    const offset = (page - 1) * limit;
    
    const allotedOrders = await AllotedOrders.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'distributor', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: User, as: 'retailor', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: User, as: 'salesman', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: allotedOrders.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(allotedOrders.count / limit),
        total_items: allotedOrders.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching alloted orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching alloted orders', error: error.message });
  }
};

// Get single alloted order
const getAllotedOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const allotedOrder = await AllotedOrders.findByPk(id, {
      include: [
        { model: User, as: 'distributor', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: User, as: 'retailor', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: User, as: 'salesman', attributes: ['id', 'name', 'email', 'mobile'] }
      ]
    });

    if (!allotedOrder) {
      return res.status(404).json({ success: false, message: 'Alloted order not found' });
    }

    res.json({ success: true, data: allotedOrder });
  } catch (error) {
    console.error('Error fetching alloted order:', error);
    res.status(500).json({ success: false, message: 'Error fetching alloted order', error: error.message });
  }
};

// Create new alloted order
const createAllotedOrder = async (req, res) => {
  try {
    const { order_id, distributor_id, retailor_id, salesman_id, notes } = req.body;

    // Validate required fields
    if (!order_id || !distributor_id || !retailor_id || !salesman_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'order_id, distributor_id, retailor_id, and salesman_id are required' 
      });
    }

    // Check if users exist
    const distributor = await User.findByPk(distributor_id);
    const retailor = await User.findByPk(retailor_id);
    const salesman = await User.findByPk(salesman_id);

    if (!distributor || !retailor || !salesman) {
      return res.status(400).json({ 
        success: false, 
        message: 'One or more users (distributor, retailor, salesman) not found' 
      });
    }

    const allotedOrder = await AllotedOrders.create({
      order_id,
      distributor_id,
      retailor_id,
      salesman_id,
      notes,
      status: 'pending',
      alloted_date: new Date()
    });

    res.status(201).json({ success: true, data: allotedOrder, message: 'Alloted order created successfully' });
  } catch (error) {
    console.error('Error creating alloted order:', error);
    res.status(500).json({ success: false, message: 'Error creating alloted order', error: error.message });
  }
};

// Update alloted order
const updateAllotedOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, completed_date } = req.body;

    const allotedOrder = await AllotedOrders.findByPk(id);
    if (!allotedOrder) {
      return res.status(404).json({ success: false, message: 'Alloted order not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (completed_date) updateData.completed_date = completed_date;

    await allotedOrder.update(updateData);

    res.json({ success: true, data: allotedOrder, message: 'Alloted order updated successfully' });
  } catch (error) {
    console.error('Error updating alloted order:', error);
    res.status(500).json({ success: false, message: 'Error updating alloted order', error: error.message });
  }
};

// Delete alloted order
const deleteAllotedOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const allotedOrder = await AllotedOrders.findByPk(id);
    if (!allotedOrder) {
      return res.status(404).json({ success: false, message: 'Alloted order not found' });
    }

    await allotedOrder.destroy();

    res.json({ success: true, message: 'Alloted order deleted successfully' });
  } catch (error) {
    console.error('Error deleting alloted order:', error);
    res.status(500).json({ success: false, message: 'Error deleting alloted order', error: error.message });
  }
};

// Get alloted orders by user
const getAllotedOrdersByUser = async (req, res) => {
  try {
    const { user_id, user_type } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause = {};
    if (status) whereClause.status = status;

    // Add user type specific condition
    switch (user_type) {
      case 'distributor':
        whereClause.distributor_id = user_id;
        break;
      case 'retailor':
        whereClause.retailor_id = user_id;
        break;
      case 'salesman':
        whereClause.salesman_id = user_id;
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const offset = (page - 1) * limit;

    const allotedOrders = await AllotedOrders.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'distributor', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: User, as: 'retailor', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: User, as: 'salesman', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: allotedOrders.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(allotedOrders.count / limit),
        total_items: allotedOrders.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching alloted orders by user:', error);
    res.status(500).json({ success: false, message: 'Error fetching alloted orders by user', error: error.message });
  }
};

module.exports = {
  getAllAllotedOrders,
  getAllotedOrderById,
  createAllotedOrder,
  updateAllotedOrder,
  deleteAllotedOrder,
  getAllotedOrdersByUser
}; 