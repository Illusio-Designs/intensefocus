const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { productUpload } = require('../config/multer');

// GET /api/products - Get all products
router.get('/', productController.getAllProducts);

// GET /api/products/active - Get active products only
router.get('/active', productController.getActiveProducts);

// GET /api/products/featured - Get featured products
router.get('/featured', productController.getFeaturedProducts);

// GET /api/products/search - Search products
router.get('/search', productController.searchProducts);

// GET /api/products/:id - Get single product by ID
router.get('/:id', productController.getProductById);

// POST /api/products - Create new product
router.post('/', productController.createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', productController.updateProduct);

// POST /api/products/upload-image - Upload product image
router.post('/upload-image', productUpload, productController.uploadProductImage);

// Additional product routes (matching PHP ProductController)
// GET /api/products/with-images - Get all products with images
router.get('/with-images', productController.getAllProductsWithImages);

// GET /api/products/filtered - Get filtered products
router.get('/filtered', productController.getFilteredProducts);

// GET /api/products/shapes - Get all shapes
router.get('/shapes', productController.getShapes);

// GET /api/products/brands - Get all brands
router.get('/brands', productController.getBrands);

// GET /api/products/genders - Get all genders
router.get('/genders', productController.getGenders);

// GET /api/products/lens-materials - Get all lens materials
router.get('/lens-materials', productController.getLensMaterials);

// GET /api/products/lens-colors - Get all lens colors
router.get('/lens-colors', productController.getLensColors);

// GET /api/products/frame-materials - Get all frame materials
router.get('/frame-materials', productController.getFrameMaterials);

// GET /api/products/frame-colors - Get all frame colors
router.get('/frame-colors', productController.getFrameColors);

// GET /api/products/types - Get all types
router.get('/types', productController.getTypes);

module.exports = router; 