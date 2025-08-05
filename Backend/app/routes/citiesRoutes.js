const express = require('express');
const router = express.Router();
const citiesController = require('../controllers/citiesController');

// GET /api/cities - Get all cities
router.get('/', citiesController.getAllCities);

// GET /api/cities/active - Get active cities only
router.get('/active', citiesController.getActiveCities);

// GET /api/cities/search - Search cities
router.get('/search', citiesController.searchCities);

// GET /api/cities/state/:state_id - Get cities by state
router.get('/state/:state_id', citiesController.getCitiesByState);

// GET /api/cities/:id - Get single city by ID
router.get('/:id', citiesController.getCityById);

// POST /api/cities - Create new city
router.post('/', citiesController.createCity);

// PUT /api/cities/:id - Update city
router.put('/:id', citiesController.updateCity);

module.exports = router; 