const { Collection } = require('../models');

// Get all collections
const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: collections,
      message: 'Collections retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving collections',
      error: error.message
    });
  }
};

// Get single collection by ID
const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findByPk(id);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: collection,
      message: 'Collection retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving collection',
      error: error.message
    });
  }
};

// Create new collection
const createCollection = async (req, res) => {
  try {
    const { name, description, image, status, sort_order, meta_title, meta_description, meta_keywords } = req.body;
    
    // Check if collection already exists
    const existingCollection = await Collection.findOne({ where: { name } });
    if (existingCollection) {
      return res.status(400).json({
        success: false,
        message: 'Collection with this name already exists'
      });
    }
    
    const collection = await Collection.create({
      name,
      description,
      image,
      status: status !== undefined ? status : true,
      sort_order: sort_order || 0,
      meta_title,
      meta_description,
      meta_keywords
    });
    
    res.status(201).json({
      success: true,
      data: collection,
      message: 'Collection created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating collection',
      error: error.message
    });
  }
};

// Update collection
const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, status, sort_order, meta_title, meta_description, meta_keywords } = req.body;
    
    const collection = await Collection.findByPk(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    // Check if name is being changed and if it already exists
    if (name && name !== collection.name) {
      const existingCollection = await Collection.findOne({ where: { name } });
      if (existingCollection) {
        return res.status(400).json({
          success: false,
          message: 'Collection with this name already exists'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (status !== undefined) updateData.status = status;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (meta_title !== undefined) updateData.meta_title = meta_title;
    if (meta_description !== undefined) updateData.meta_description = meta_description;
    if (meta_keywords !== undefined) updateData.meta_keywords = meta_keywords;
    
    await collection.update(updateData);
    
    res.status(200).json({
      success: true,
      data: collection,
      message: 'Collection updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating collection',
      error: error.message
    });
  }
};

// Get active collections only
const getActiveCollections = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: { status: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: collections,
      message: 'Active collections retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active collections',
      error: error.message
    });
  }
};

// Search collections
const searchCollections = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause.name = { [sequelize.Op.like]: `%${search}%` };
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const collections = await Collection.findAll({
      where: whereClause,
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: collections,
      message: 'Collections searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching collections',
      error: error.message
    });
  }
};

module.exports = {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  getActiveCollections,
  searchCollections
}; 