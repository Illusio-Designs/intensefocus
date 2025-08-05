const { Slider } = require('../models');
const { sliderUpload } = require('../config/multer');
const { Op } = require('sequelize');

// Get all sliders
const getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.findAll({
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: sliders,
      message: 'Sliders retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving sliders',
      error: error.message
    });
  }
};

// Get single slider by ID
const getSliderById = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await Slider.findByPk(id);
    
    if (!slider) {
      return res.status(404).json({
        success: false,
        message: 'Slider not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: slider,
      message: 'Slider retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving slider',
      error: error.message
    });
  }
};

// Create new slider
const createSlider = async (req, res) => {
  try {
    const { title, subtitle, description, image, button_text, button_link, status, sort_order } = req.body;
    
    const slider = await Slider.create({
      title,
      subtitle,
      description,
      image,
      button_text,
      button_link,
      status: status !== undefined ? status : true,
      sort_order: sort_order || 0
    });
    
    res.status(201).json({
      success: true,
      data: slider,
      message: 'Slider created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating slider',
      error: error.message
    });
  }
};

// Update slider
const updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, image, button_text, button_link, status, sort_order } = req.body;
    
    const slider = await Slider.findByPk(id);
    if (!slider) {
      return res.status(404).json({
        success: false,
        message: 'Slider not found'
      });
    }
    
    // Prepare update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (button_text !== undefined) updateData.button_text = button_text;
    if (button_link !== undefined) updateData.button_link = button_link;
    if (status !== undefined) updateData.status = status;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    
    await slider.update(updateData);
    
    res.status(200).json({
      success: true,
      data: slider,
      message: 'Slider updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating slider',
      error: error.message
    });
  }
};

// Get active sliders only
const getActiveSliders = async (req, res) => {
  try {
    const sliders = await Slider.findAll({
      where: { status: true },
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: sliders,
      message: 'Active sliders retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active sliders',
      error: error.message
    });
  }
};

// Search sliders
const searchSliders = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause = {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { subtitle: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      };
    }
    
    if (status !== undefined) {
      whereClause.status = status === 'true';
    }
    
    const sliders = await Slider.findAll({
      where: whereClause,
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: sliders,
      message: 'Sliders searched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching sliders',
      error: error.message
    });
  }
};

// Upload slider image
const uploadSliderImage = async (req, res) => {
  try {
    const fileInfo = req.fileInfo;

    res.status(200).json({
      success: true,
      message: 'Slider image uploaded successfully',
      data: {
        filename: fileInfo.filename,
        path: fileInfo.path,
        size: fileInfo.size,
        mimetype: fileInfo.mimetype,
        originalName: fileInfo.originalName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading slider image',
      error: error.message
    });
  }
};

// Get all sliders (matching PHP getAllSlider)
const getAllSlider = async (req, res) => {
  try {
    const sliders = await Slider.findAll({
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: sliders,
      message: 'All sliders retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving sliders',
      error: error.message
    });
  }
};

module.exports = {
  getAllSliders,
  getSliderById,
  createSlider,
  updateSlider,
  getActiveSliders,
  searchSliders,
  uploadSliderImage,
  getAllSlider
}; 