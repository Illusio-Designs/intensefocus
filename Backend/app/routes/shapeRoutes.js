const express = require('express');
const router = express.Router();
const shapeController = require('../controllers/shapeController');

// GET /api/shapes - Get all shapes
router.get('/', shapeController.getAllShapes);

// GET /api/shapes/active - Get active shapes only
router.get('/active', shapeController.getActiveShapes);

// GET /api/shapes/search - Search shapes
router.get('/search', shapeController.searchShapes);

// GET /api/shapes/:id - Get single shape by ID
router.get('/:id', shapeController.getShapeById);

// POST /api/shapes - Create new shape
router.post('/', shapeController.createShape);

// PUT /api/shapes/:id - Update shape
router.put('/:id', shapeController.updateShape);

module.exports = router; 