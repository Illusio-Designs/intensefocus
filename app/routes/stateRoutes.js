const express = require('express');
const router = express.Router();
const stateController = require('../controllers/stateController');

// GET /api/states - Get all states
router.get('/', stateController.getAllStates);

// GET /api/states/active - Get active states only
router.get('/active', stateController.getActiveStates);

// GET /api/states/search - Search states
router.get('/search', stateController.searchStates);

// GET /api/states/:id - Get single state by ID
router.get('/:id', stateController.getStateById);

// POST /api/states - Create new state
router.post('/', stateController.createState);

// PUT /api/states/:id - Update state
router.put('/:id', stateController.updateState);

module.exports = router; 