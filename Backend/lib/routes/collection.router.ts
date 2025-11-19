import express, { Router } from 'express';
import collectionController from '../controllers/collection.controller';

const collectionRouter: Router = express.Router();

// GET /api/collections - Get all collections
collectionRouter.get('/', collectionController.getAllCollections);

// GET /api/collections/active - Get active collections only
collectionRouter.get('/active', collectionController.getActiveCollections);

// GET /api/collections/search - Search collections
collectionRouter.get('/search', collectionController.searchCollections);

// GET /api/collections/:id - Get single collection by ID
collectionRouter.get('/:id', collectionController.getCollectionById);

// POST /api/collections - Create new collection
collectionRouter.post('/', collectionController.createCollection);

// PUT /api/collections/:id - Update collection
collectionRouter.put('/:id', collectionController.updateCollection);

export default collectionRouter;