const express = require('express');
const router = express.Router();
const lensMaterialController = require('../controllers/lensMaterialController');

// GET /api/lens-materials - Get all lens materials
router.get('/', lensMaterialController.getAllLensMaterials);

// GET /api/lens-materials/active - Get active lens materials only
router.get('/active', lensMaterialController.getActiveLensMaterials);

// GET /api/lens-materials/search - Search lens materials
router.get('/search', lensMaterialController.searchLensMaterials);

// GET /api/lens-materials/:id - Get single lens material by ID
router.get('/:id', lensMaterialController.getLensMaterialById);

// POST /api/lens-materials - Create new lens material
router.post('/', lensMaterialController.createLensMaterial);

// PUT /api/lens-materials/:id - Update lens material
router.put('/:id', lensMaterialController.updateLensMaterial);

module.exports = router; 