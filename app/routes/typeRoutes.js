const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');

// GET /api/types - Get all types
router.get('/', typeController.getAllTypes);

// GET /api/types/active - Get active types only
router.get('/active', typeController.getActiveTypes);

// GET /api/types/search - Search types
router.get('/search', typeController.searchTypes);

// GET /api/types/:id - Get single type by ID
router.get('/:id', typeController.getTypeById);

// POST /api/types - Create new type
router.post('/', typeController.createType);

// PUT /api/types/:id - Update type
router.put('/:id', typeController.updateType);

module.exports = router; 