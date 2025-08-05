const express = require('express');
const router = express.Router();
const lensColorController = require('../controllers/lensColorController');

// GET /api/lens-colors - Get all lens colors
router.get('/', lensColorController.getAllLensColors);

// GET /api/lens-colors/active - Get active lens colors only
router.get('/active', lensColorController.getActiveLensColors);

// GET /api/lens-colors/search - Search lens colors
router.get('/search', lensColorController.searchLensColors);

// GET /api/lens-colors/:id - Get single lens color by ID
router.get('/:id', lensColorController.getLensColorById);

// POST /api/lens-colors - Create new lens color
router.post('/', lensColorController.createLensColor);

// PUT /api/lens-colors/:id - Update lens color
router.put('/:id', lensColorController.updateLensColor);

module.exports = router; 