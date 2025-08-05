const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

// GET /api/collections - Get all collections
router.get('/', collectionController.getAllCollections);

// GET /api/collections/active - Get active collections only
router.get('/active', collectionController.getActiveCollections);

// GET /api/collections/search - Search collections
router.get('/search', collectionController.searchCollections);

// GET /api/collections/:id - Get single collection by ID
router.get('/:id', collectionController.getCollectionById);

// POST /api/collections - Create new collection
router.post('/', collectionController.createCollection);

// PUT /api/collections/:id - Update collection
router.put('/:id', collectionController.updateCollection);

module.exports = router; 