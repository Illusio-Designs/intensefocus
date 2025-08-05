const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');

// GET /api/zones - Get all zones
router.get('/', zoneController.getAllZones);

// GET /api/zones/active - Get active zones only
router.get('/active', zoneController.getActiveZones);

// GET /api/zones/search - Search zones
router.get('/search', zoneController.searchZones);

// GET /api/zones/state/:state_id - Get zones by state
router.get('/state/:state_id', zoneController.getZonesByState);

// GET /api/zones/city/:city_id - Get zones by city
router.get('/city/:city_id', zoneController.getZonesByCity);

// GET /api/zones/:id - Get single zone by ID
router.get('/:id', zoneController.getZoneById);

// POST /api/zones - Create new zone
router.post('/', zoneController.createZone);

// PUT /api/zones/:id - Update zone
router.put('/:id', zoneController.updateZone);

module.exports = router; 