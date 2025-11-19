import express, { Router } from 'express';
import lensColorController from '../controllers/lensColors.controller';
const lensColorRouter: Router = express.Router();

// GET /api/lens-colors - Get all lens colors
lensColorRouter.get('/', lensColorController.getAllLensColors);

// GET /api/lens-colors/active - Get active lens colors only
lensColorRouter.get('/active', lensColorController.getActiveLensColors);

// GET /api/lens-colors/search - Search lens colors
lensColorRouter.get('/search', lensColorController.searchLensColors);

// GET /api/lens-colors/:id - Get single lens color by ID
lensColorRouter.get('/:id', lensColorController.getLensColorById);

// POST /api/lens-colors - Create new lens color
lensColorRouter.post('/', lensColorController.createLensColor);

// PUT /api/lens-colors/:id - Update lens color
lensColorRouter.put('/:id', lensColorController.updateLensColor);

export default lensColorRouter;