const { DistributorBrands, User, Brand } = require('../models');

// Get all distributor brands
const getAllDistributorBrands = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, distributor_id, brand_id } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (distributor_id) whereClause.distributor_id = distributor_id;
    if (brand_id) whereClause.brand_id = brand_id;

    const offset = (page - 1) * limit;
    
    const distributorBrands = await DistributorBrands.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'distributor', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: Brand, as: 'brand', attributes: ['id', 'name', 'description'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: distributorBrands.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(distributorBrands.count / limit),
        total_items: distributorBrands.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching distributor brands:', error);
    res.status(500).json({ success: false, message: 'Error fetching distributor brands', error: error.message });
  }
};

// Get single distributor brand
const getDistributorBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const distributorBrand = await DistributorBrands.findByPk(id, {
      include: [
        { model: User, as: 'distributor', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: Brand, as: 'brand', attributes: ['id', 'name', 'description'] }
      ]
    });

    if (!distributorBrand) {
      return res.status(404).json({ success: false, message: 'Distributor brand not found' });
    }

    res.json({ success: true, data: distributorBrand });
  } catch (error) {
    console.error('Error fetching distributor brand:', error);
    res.status(500).json({ success: false, message: 'Error fetching distributor brand', error: error.message });
  }
};

// Create new distributor brand
const createDistributorBrand = async (req, res) => {
  try {
    const { distributor_id, brand_id, commission_rate, notes } = req.body;

    // Validate required fields
    if (!distributor_id || !brand_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'distributor_id and brand_id are required' 
      });
    }

    // Check if distributor and brand exist
    const distributor = await User.findByPk(distributor_id);
    const brand = await Brand.findByPk(brand_id);

    if (!distributor || !brand) {
      return res.status(400).json({ 
        success: false, 
        message: 'Distributor or brand not found' 
      });
    }

    // Check if relationship already exists
    const existingRelation = await DistributorBrands.findOne({
      where: { distributor_id, brand_id }
    });

    if (existingRelation) {
      return res.status(400).json({ 
        success: false, 
        message: 'This distributor-brand relationship already exists' 
      });
    }

    const distributorBrand = await DistributorBrands.create({
      distributor_id,
      brand_id,
      commission_rate,
      notes,
      status: 'active',
      assigned_date: new Date()
    });

    res.status(201).json({ success: true, data: distributorBrand, message: 'Distributor brand created successfully' });
  } catch (error) {
    console.error('Error creating distributor brand:', error);
    res.status(500).json({ success: false, message: 'Error creating distributor brand', error: error.message });
  }
};

// Update distributor brand
const updateDistributorBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, commission_rate, notes } = req.body;

    const distributorBrand = await DistributorBrands.findByPk(id);
    if (!distributorBrand) {
      return res.status(404).json({ success: false, message: 'Distributor brand not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (commission_rate !== undefined) updateData.commission_rate = commission_rate;
    if (notes !== undefined) updateData.notes = notes;

    await distributorBrand.update(updateData);

    res.json({ success: true, data: distributorBrand, message: 'Distributor brand updated successfully' });
  } catch (error) {
    console.error('Error updating distributor brand:', error);
    res.status(500).json({ success: false, message: 'Error updating distributor brand', error: error.message });
  }
};

// Delete distributor brand
const deleteDistributorBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const distributorBrand = await DistributorBrands.findByPk(id);
    if (!distributorBrand) {
      return res.status(404).json({ success: false, message: 'Distributor brand not found' });
    }

    await distributorBrand.destroy();

    res.json({ success: true, message: 'Distributor brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting distributor brand:', error);
    res.status(500).json({ success: false, message: 'Error deleting distributor brand', error: error.message });
  }
};

// Get brands by distributor
const getBrandsByDistributor = async (req, res) => {
  try {
    const { distributor_id } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause = { distributor_id };
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const distributorBrands = await DistributorBrands.findAndCountAll({
      where: whereClause,
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'name', 'description'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: distributorBrands.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(distributorBrands.count / limit),
        total_items: distributorBrands.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching brands by distributor:', error);
    res.status(500).json({ success: false, message: 'Error fetching brands by distributor', error: error.message });
  }
};

// Get distributors by brand
const getDistributorsByBrand = async (req, res) => {
  try {
    const { brand_id } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause = { brand_id };
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const distributorBrands = await DistributorBrands.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'distributor', attributes: ['id', 'name', 'email', 'mobile'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: distributorBrands.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(distributorBrands.count / limit),
        total_items: distributorBrands.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching distributors by brand:', error);
    res.status(500).json({ success: false, message: 'Error fetching distributors by brand', error: error.message });
  }
};

module.exports = {
  getAllDistributorBrands,
  getDistributorBrandById,
  createDistributorBrand,
  updateDistributorBrand,
  deleteDistributorBrand,
  getBrandsByDistributor,
  getDistributorsByBrand
}; 