import express, { Router } from 'express';
import shapeController from '../controllers/shape.controller';

const shapeRouter: Router = express.Router();

// GET /api/shapes - Get all shapes
shapeRouter.get('/', shapeController.getAllShapes);

// GET /api/shapes/active - Get active shapes only
shapeRouter.get('/active', shapeController.getActiveShapes);

// GET /api/shapes/search - Search shapes
shapeRouter.get('/search', shapeController.searchShapes);

// GET /api/shapes/:id - Get single shape by ID
shapeRouter.get('/:id', shapeController.getShapeById);

// POST /api/shapes - Create new shape
shapeRouter.post('/', shapeController.createShape);

// PUT /api/shapes/:id - Update shape
shapeRouter.put('/:id', shapeController.updateShape);

export default shapeRouter;