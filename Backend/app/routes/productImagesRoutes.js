const express = require('express');
const router = express.Router();
const productImagesController = require('../controllers/productImagesController');

// GET /api/product-images - Get all product images
router.get('/', productImagesController.getAllProductImages);

// GET /api/product-images/active - Get active product images only
router.get('/active', productImagesController.getActiveProductImages);

// GET /api/product-images/search - Search product images
router.get('/search', productImagesController.searchProductImages);

// GET /api/product-images/product/:product_id - Get images by product
router.get('/product/:product_id', productImagesController.getImagesByProduct);

// GET /api/product-images/product/:product_id/primary - Get primary image by product
router.get('/product/:product_id/primary', productImagesController.getPrimaryImageByProduct);

// GET /api/product-images/:id - Get single product image by ID
router.get('/:id', productImagesController.getProductImageById);

// POST /api/product-images - Create new product image
router.post('/', productImagesController.createProductImage);

// PUT /api/product-images/:id - Update product image
router.put('/:id', productImagesController.updateProductImage);

// PUT /api/product-images/:id/set-primary - Set primary image
router.put('/:id/set-primary', productImagesController.setPrimaryImage);

module.exports = router; 