import express, { Router } from 'express';
import frameColorController from '../controllers/frameColor.controller';

const frameColorsRouter: Router = express.Router();

// GET /api/frame-colors - Get all frame colors
frameColorsRouter.get('/', frameColorController.getAllFrameColors);

// GET /api/frame-colors/active - Get active frame colors only
frameColorsRouter.get('/active', frameColorController.getActiveFrameColors);

// GET /api/frame-colors/search - Search frame colors
frameColorsRouter.get('/search', frameColorController.searchFrameColors);

// GET /api/frame-colors/:id - Get single frame color by ID
frameColorsRouter.get('/:id', frameColorController.getFrameColorById);

// POST /api/frame-colors - Create new frame color
frameColorsRouter.post('/', frameColorController.createFrameColor);

// PUT /api/frame-colors/:id - Update frame color
frameColorsRouter.put('/:id', frameColorController.updateFrameColor);
export default frameColorsRouter;