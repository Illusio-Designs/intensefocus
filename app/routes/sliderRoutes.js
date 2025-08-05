const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const { sliderUpload } = require('../config/multer');

// GET /api/sliders - Get all sliders
router.get('/', sliderController.getAllSliders);

// GET /api/sliders/active - Get active sliders only
router.get('/active', sliderController.getActiveSliders);

// GET /api/sliders/search - Search sliders
router.get('/search', sliderController.searchSliders);

// GET /api/sliders/:id - Get single slider by ID
router.get('/:id', sliderController.getSliderById);

// POST /api/sliders - Create new slider
router.post('/', sliderController.createSlider);

// PUT /api/sliders/:id - Update slider
router.put('/:id', sliderController.updateSlider);

// POST /api/sliders/upload-image - Upload slider image
router.post('/upload-image', sliderUpload, sliderController.uploadSliderImage);

// Additional slider routes (matching PHP SliderController)
// GET /api/sliders/all - Get all sliders (matching PHP getAllSlider)
router.get('/all', sliderController.getAllSlider);

module.exports = router; 