import express, { Router } from 'express';
import productImagesController from '../controllers/productImages.controller';

const productImageRouter: Router = express.Router();

// GET /api/product-images - Get all product images
productImageRouter.get('/', productImagesController.getAllProductImages);

// GET /api/product-images/active - Get active product images only
productImageRouter.get('/active', productImagesController.getActiveProductImages);

// GET /api/product-images/search - Search product images
productImageRouter.get('/search', productImagesController.searchProductImages);

// GET /api/product-images/product/:product_id - Get images by product
productImageRouter.get('/product/:product_id', productImagesController.getImagesByProduct);

// GET /api/product-images/product/:product_id/primary - Get primary image by product
productImageRouter.get('/product/:product_id/primary', productImagesController.getPrimaryImageByProduct);

// GET /api/product-images/:id - Get single product image by ID
productImageRouter.get('/:id', productImagesController.getProductImageById);

// POST /api/product-images - Create new product image
productImageRouter.post('/', productImagesController.createProductImage);

// PUT /api/product-images/:id - Update product image
productImageRouter.put('/:id', productImagesController.updateProductImage);

// PUT /api/product-images/:id/set-primary - Set primary image
productImageRouter.put('/:id/set-primary', productImagesController.setPrimaryImage);
export default productImageRouter;