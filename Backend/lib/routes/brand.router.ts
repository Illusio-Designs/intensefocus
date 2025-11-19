import express, { Router } from 'express';
import brandController from '../controllers/brand.controller';

const brandRouter: Router = express.Router();

// GET /api/brands - Get all brands
brandRouter.get('/', brandController.getAllBrands);

// GET /api/brands/active - Get active brands only
brandRouter.get('/active', brandController.getActiveBrands);

// GET /api/brands/search - Search brands
brandRouter.get('/search', brandController.searchBrands);

// GET /api/brands/:id - Get single brand by ID
brandRouter.get('/:id', brandController.getBrandById);

// POST /api/brands - Create new brand
brandRouter.post('/', brandController.createBrand);

// PUT /api/brands/:id - Update brand
brandRouter.put('/:id', brandController.updateBrand);

export default brandRouter;