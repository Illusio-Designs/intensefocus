const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../config/multer');
const {
  getAllProductImages,
  getProductImageById,
  uploadProductImage,
  updateProductImage,
  deleteProductImage,
  getImagesByProduct,
  reorderProductImages
} = require('../controllers/productsImageController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/products-images - Get all product images
router.get('/', getAllProductImages);

// GET /api/products-images/:id - Get single product image
router.get('/:id', getProductImageById);

// POST /api/products-images - Upload product image
router.post('/', upload.single('image'), uploadProductImage);

// PUT /api/products-images/:id - Update product image
router.put('/:id', updateProductImage);

// DELETE /api/products-images/:id - Delete product image
router.delete('/:id', deleteProductImage);

// GET /api/products-images/product/:product_id - Get images by product
router.get('/product/:product_id', getImagesByProduct);

// POST /api/products-images/product/:product_id/reorder - Reorder product images
router.post('/product/:product_id/reorder', reorderProductImages);

module.exports = router; 