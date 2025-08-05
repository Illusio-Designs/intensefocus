const express = require('express');
const router = express.Router();
const frameColorController = require('../controllers/frameColorController');

// GET /api/frame-colors - Get all frame colors
router.get('/', frameColorController.getAllFrameColors);

// GET /api/frame-colors/active - Get active frame colors only
router.get('/active', frameColorController.getActiveFrameColors);

// GET /api/frame-colors/search - Search frame colors
router.get('/search', frameColorController.searchFrameColors);

// GET /api/frame-colors/:id - Get single frame color by ID
router.get('/:id', frameColorController.getFrameColorById);

// POST /api/frame-colors - Create new frame color
router.post('/', frameColorController.createFrameColor);

// PUT /api/frame-colors/:id - Update frame color
router.put('/:id', frameColorController.updateFrameColor);

module.exports = router; 