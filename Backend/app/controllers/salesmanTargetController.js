const { SalesmanTarget, User } = require('../models');

// Get all salesman targets
const getAllSalesmanTargets = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, salesman_id, target_month, target_year } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (salesman_id) whereClause.salesman_id = salesman_id;
    if (target_month) whereClause.target_month = target_month;
    if (target_year) whereClause.target_year = target_year;

    const offset = (page - 1) * limit;
    
    const salesmanTargets = await SalesmanTarget.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'salesman', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['target_year', 'DESC'], ['target_month', 'DESC']]
    });

    res.json({
      success: true,
      data: salesmanTargets.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(salesmanTargets.count / limit),
        total_items: salesmanTargets.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching salesman targets:', error);
    res.status(500).json({ success: false, message: 'Error fetching salesman targets', error: error.message });
  }
};

// Get single salesman target
const getSalesmanTargetById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const salesmanTarget = await SalesmanTarget.findByPk(id, {
      include: [
        { model: User, as: 'salesman', attributes: ['id', 'name', 'email', 'mobile'] }
      ]
    });

    if (!salesmanTarget) {
      return res.status(404).json({ success: false, message: 'Salesman target not found' });
    }

    res.json({ success: true, data: salesmanTarget });
  } catch (error) {
    console.error('Error fetching salesman target:', error);
    res.status(500).json({ success: false, message: 'Error fetching salesman target', error: error.message });
  }
};

// Create new salesman target
const createSalesmanTarget = async (req, res) => {
  try {
    const { salesman_id, target_month, target_year, target_amount, target_orders, notes } = req.body;

    // Validate required fields
    if (!salesman_id || !target_month || !target_year || !target_amount || !target_orders) {
      return res.status(400).json({ 
        success: false, 
        message: 'salesman_id, target_month, target_year, target_amount, and target_orders are required' 
      });
    }

    // Validate month and year
    if (target_month < 1 || target_month > 12) {
      return res.status(400).json({ success: false, message: 'Invalid target month (1-12)' });
    }

    if (target_year < 2020 || target_year > 2030) {
      return res.status(400).json({ success: false, message: 'Invalid target year' });
    }

    // Check if salesman exists
    const salesman = await User.findByPk(salesman_id);
    if (!salesman) {
      return res.status(400).json({ success: false, message: 'Salesman not found' });
    }

    // Check if target already exists for this salesman and month/year
    const existingTarget = await SalesmanTarget.findOne({
      where: { salesman_id, target_month, target_year }
    });

    if (existingTarget) {
      return res.status(400).json({ 
        success: false, 
        message: 'Target already exists for this salesman and month/year' 
      });
    }

    const salesmanTarget = await SalesmanTarget.create({
      salesman_id,
      target_month,
      target_year,
      target_amount,
      target_orders,
      achieved_amount: 0.00,
      achieved_orders: 0,
      notes,
      status: 'active'
    });

    res.status(201).json({ success: true, data: salesmanTarget, message: 'Salesman target created successfully' });
  } catch (error) {
    console.error('Error creating salesman target:', error);
    res.status(500).json({ success: false, message: 'Error creating salesman target', error: error.message });
  }
};

// Update salesman target
const updateSalesmanTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const { target_amount, target_orders, achieved_amount, achieved_orders, status, notes } = req.body;

    const salesmanTarget = await SalesmanTarget.findByPk(id);
    if (!salesmanTarget) {
      return res.status(404).json({ success: false, message: 'Salesman target not found' });
    }

    const updateData = {};
    if (target_amount !== undefined) updateData.target_amount = target_amount;
    if (target_orders !== undefined) updateData.target_orders = target_orders;
    if (achieved_amount !== undefined) updateData.achieved_amount = achieved_amount;
    if (achieved_orders !== undefined) updateData.achieved_orders = achieved_orders;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    await salesmanTarget.update(updateData);

    res.json({ success: true, data: salesmanTarget, message: 'Salesman target updated successfully' });
  } catch (error) {
    console.error('Error updating salesman target:', error);
    res.status(500).json({ success: false, message: 'Error updating salesman target', error: error.message });
  }
};

// Delete salesman target
const deleteSalesmanTarget = async (req, res) => {
  try {
    const { id } = req.params;

    const salesmanTarget = await SalesmanTarget.findByPk(id);
    if (!salesmanTarget) {
      return res.status(404).json({ success: false, message: 'Salesman target not found' });
    }

    await salesmanTarget.destroy();

    res.json({ success: true, message: 'Salesman target deleted successfully' });
  } catch (error) {
    console.error('Error deleting salesman target:', error);
    res.status(500).json({ success: false, message: 'Error deleting salesman target', error: error.message });
  }
};

// Get targets by salesman
const getTargetsBySalesman = async (req, res) => {
  try {
    const { salesman_id } = req.params;
    const { page = 1, limit = 10, status, year } = req.query;

    const whereClause = { salesman_id };
    if (status) whereClause.status = status;
    if (year) whereClause.target_year = year;

    const offset = (page - 1) * limit;

    const salesmanTargets = await SalesmanTarget.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'salesman', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['target_year', 'DESC'], ['target_month', 'DESC']]
    });

    res.json({
      success: true,
      data: salesmanTargets.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(salesmanTargets.count / limit),
        total_items: salesmanTargets.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching targets by salesman:', error);
    res.status(500).json({ success: false, message: 'Error fetching targets by salesman', error: error.message });
  }
};

// Get performance summary
const getPerformanceSummary = async (req, res) => {
  try {
    const { salesman_id, year } = req.params;

    const whereClause = { salesman_id };
    if (year) whereClause.target_year = year;

    const targets = await SalesmanTarget.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'salesman', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      order: [['target_month', 'ASC']]
    });

    // Calculate summary
    const summary = {
      total_target_amount: 0,
      total_achieved_amount: 0,
      total_target_orders: 0,
      total_achieved_orders: 0,
      achievement_percentage: 0,
      monthly_breakdown: []
    };

    targets.forEach(target => {
      summary.total_target_amount += parseFloat(target.target_amount);
      summary.total_achieved_amount += parseFloat(target.achieved_amount);
      summary.total_target_orders += target.target_orders;
      summary.total_achieved_orders += target.achieved_orders;

      summary.monthly_breakdown.push({
        month: target.target_month,
        year: target.target_year,
        target_amount: target.target_amount,
        achieved_amount: target.achieved_amount,
        target_orders: target.target_orders,
        achieved_orders: target.achieved_orders,
        achievement_percentage: target.target_amount > 0 ? (target.achieved_amount / target.target_amount) * 100 : 0
      });
    });

    if (summary.total_target_amount > 0) {
      summary.achievement_percentage = (summary.total_achieved_amount / summary.total_target_amount) * 100;
    }

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching performance summary:', error);
    res.status(500).json({ success: false, message: 'Error fetching performance summary', error: error.message });
  }
};

module.exports = {
  getAllSalesmanTargets,
  getSalesmanTargetById,
  createSalesmanTarget,
  updateSalesmanTarget,
  deleteSalesmanTarget,
  getTargetsBySalesman,
  getPerformanceSummary
}; 