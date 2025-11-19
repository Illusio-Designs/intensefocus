import express, { Router } from 'express';
import productController from '../controllers/product.controller';
import { productUpload } from '../middleware/multer';

const productRouter: Router = express.Router();

// GET /api/products - Get all products
productRouter.get('/', productController.getAllProducts);

// GET /api/products/active - Get active products only
productRouter.get('/active', productController.getActiveProducts);

// GET /api/products/featured - Get featured products
productRouter.get('/featured', productController.getFeaturedProducts);

// GET /api/products/search - Search products
productRouter.get('/search', productController.searchProducts);

// GET /api/products/:id - Get single product by ID
productRouter.get('/:id', productController.getProductById);

// POST /api/products - Create new product
productRouter.post('/', productController.createProduct);

// PUT /api/products/:id - Update product
productRouter.put('/:id', productController.updateProduct);

// POST /api/products/upload-image - Upload product image
productRouter.post('/upload-image', productUpload, productController.uploadProductImage);

// Additional product routes (matching PHP ProductController)
// GET /api/products/with-images - Get all products with images
productRouter.get('/with-images', productController.getAllProductsWithImages);

// GET /api/products/filtered - Get filtered products
productRouter.get('/filtered', productController.getFilteredProducts);

// GET /api/products/shapes - Get all shapes
productRouter.get('/shapes', productController.getShapes);

// GET /api/products/brands - Get all brands
productRouter.get('/brands', productController.getBrands);

// GET /api/products/genders - Get all genders
productRouter.get('/genders', productController.getGenders);

// GET /api/products/lens-materials - Get all lens materials
productRouter.get('/lens-materials', productController.getLensMaterials);

// GET /api/products/lens-colors - Get all lens colors
productRouter.get('/lens-colors', productController.getLensColors);

// GET /api/products/frame-materials - Get all frame materials
productRouter.get('/frame-materials', productController.getFrameMaterials);

// GET /api/products/frame-colors - Get all frame colors
productRouter.get('/frame-colors', productController.getFrameColors);

// GET /api/products/types - Get all types
productRouter.get('/types', productController.getTypes);

export default productRouter;