const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

// GET /api/brands - Get all brands
router.get('/', brandController.getAllBrands);

// GET /api/brands/active - Get active brands only
router.get('/active', brandController.getActiveBrands);

// GET /api/brands/search - Search brands
router.get('/search', brandController.searchBrands);

// GET /api/brands/:id - Get single brand by ID
router.get('/:id', brandController.getBrandById);

// POST /api/brands - Create new brand
router.post('/', brandController.createBrand);

// PUT /api/brands/:id - Update brand
router.put('/:id', brandController.updateBrand);

module.exports = router; 