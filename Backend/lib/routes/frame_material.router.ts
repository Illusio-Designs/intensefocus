import express, { Router } from 'express';
import frameMaterialController from '../controllers/frameMaterial.controller';

const frameMaterialRouter: Router = express.Router();

// GET /api/frame-materials - Get all frame materials
frameMaterialRouter.get('/', frameMaterialController.getAllFrameMaterials);

// GET /api/frame-materials/active - Get active frame materials only
frameMaterialRouter.get('/active', frameMaterialController.getActiveFrameMaterials);

// GET /api/frame-materials/search - Search frame materials
frameMaterialRouter.get('/search', frameMaterialController.searchFrameMaterials);

// GET /api/frame-materials/:id - Get single frame material by ID
frameMaterialRouter.get('/:id', frameMaterialController.getFrameMaterialById);

// POST /api/frame-materials - Create new frame material
frameMaterialRouter.post('/', frameMaterialController.createFrameMaterial);

// PUT /api/frame-materials/:id - Update frame material
frameMaterialRouter.put('/:id', frameMaterialController.updateFrameMaterial);
export default frameMaterialRouter;