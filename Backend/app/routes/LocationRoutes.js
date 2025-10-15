const express = require('express');
const LocationController = require('../controllers/LocationController');

const router = express.Router();

/**
 * Location Routes
 * All routes are prefixed with /api/locations
 */

// Get all countries
router.get('/countries', LocationController.getCountries);

// Get states by country
router.get('/countries/:countryId/states', LocationController.getStatesByCountry);

// Get cities by state
router.get('/states/:stateId/cities', LocationController.getCitiesByState);

// Search cities (for auto-complete)
router.get('/cities/search', LocationController.searchCities);

// Get location suggestions (cities and states)
router.get('/suggestions', LocationController.getLocationSuggestions);

// Add new city with auto-detection
router.post('/cities', LocationController.addCity);

// Get complete location hierarchy for a city
router.get('/cities/:cityId/hierarchy', LocationController.getLocationHierarchy);

// Initialize location system (admin only)
router.post('/initialize', LocationController.initializeLocationSystem);

module.exports = router;
