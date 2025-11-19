import express, { Router } from 'express';
import typeController from '../controllers/type.controller';

const typeRouter: Router = express.Router();

// GET /api/types - Get all types
typeRouter.get('/', typeController.getAllTypes);

// GET /api/types/active - Get active types only
typeRouter.get('/active', typeController.getActiveTypes);

// GET /api/types/search - Search types
typeRouter.get('/search', typeController.searchTypes);

// GET /api/types/:id - Get single type by ID
typeRouter.get('/:id', typeController.getTypeById);

// POST /api/types - Create new type
typeRouter.post('/', typeController.createType);

// PUT /api/types/:id - Update type
typeRouter.put('/:id', typeController.updateType);
export default typeRouter;