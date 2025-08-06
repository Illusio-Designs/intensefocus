const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllDistributorBrands,
  getDistributorBrandById,
  createDistributorBrand,
  updateDistributorBrand,
  deleteDistributorBrand,
  getBrandsByDistributor,
  getDistributorsByBrand
} = require('../controllers/distributorBrandsController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/distributor-brands - Get all distributor brands
router.get('/', getAllDistributorBrands);

// GET /api/distributor-brands/:id - Get single distributor brand
router.get('/:id', getDistributorBrandById);

// POST /api/distributor-brands - Create new distributor brand
router.post('/', createDistributorBrand);

// PUT /api/distributor-brands/:id - Update distributor brand
router.put('/:id', updateDistributorBrand);

// DELETE /api/distributor-brands/:id - Delete distributor brand
router.delete('/:id', deleteDistributorBrand);

// GET /api/distributor-brands/distributor/:distributor_id - Get brands by distributor
router.get('/distributor/:distributor_id', getBrandsByDistributor);

// GET /api/distributor-brands/brand/:brand_id - Get distributors by brand
router.get('/brand/:brand_id', getDistributorsByBrand);

module.exports = router; 