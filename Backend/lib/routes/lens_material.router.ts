import express, { Router } from 'express';
import lensMaterialController from '../controllers/lensMaterial.controller';

const lensMaterialRouter: Router = express.Router();

// GET /api/lens-materials - Get all lens materials
lensMaterialRouter.get('/', lensMaterialController.getAllLensMaterials);

// GET /api/lens-materials/active - Get active lens materials only
lensMaterialRouter.get('/active', lensMaterialController.getActiveLensMaterials);

// GET /api/lens-materials/search - Search lens materials
lensMaterialRouter.get('/search', lensMaterialController.searchLensMaterials);

// GET /api/lens-materials/:id - Get single lens material by ID
lensMaterialRouter.get('/:id', lensMaterialController.getLensMaterialById);

// POST /api/lens-materials - Create new lens material
lensMaterialRouter.post('/', lensMaterialController.createLensMaterial);

// PUT /api/lens-materials/:id - Update lens material
lensMaterialRouter.put('/:id', lensMaterialController.updateLensMaterial);
export default lensMaterialRouter;