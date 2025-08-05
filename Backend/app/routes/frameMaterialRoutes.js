const express = require('express');
const router = express.Router();
const frameMaterialController = require('../controllers/frameMaterialController');

// GET /api/frame-materials - Get all frame materials
router.get('/', frameMaterialController.getAllFrameMaterials);

// GET /api/frame-materials/active - Get active frame materials only
router.get('/active', frameMaterialController.getActiveFrameMaterials);

// GET /api/frame-materials/search - Search frame materials
router.get('/search', frameMaterialController.searchFrameMaterials);

// GET /api/frame-materials/:id - Get single frame material by ID
router.get('/:id', frameMaterialController.getFrameMaterialById);

// POST /api/frame-materials - Create new frame material
router.post('/', frameMaterialController.createFrameMaterial);

// PUT /api/frame-materials/:id - Update frame material
router.put('/:id', frameMaterialController.updateFrameMaterial);

module.exports = router; 