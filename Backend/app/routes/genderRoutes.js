const express = require('express');
const router = express.Router();
const genderController = require('../controllers/genderController');

// GET /api/genders - Get all genders
router.get('/', genderController.getAllGenders);

// GET /api/genders/active - Get active genders only
router.get('/active', genderController.getActiveGenders);

// GET /api/genders/search - Search genders
router.get('/search', genderController.searchGenders);

// GET /api/genders/:id - Get single gender by ID
router.get('/:id', genderController.getGenderById);

// POST /api/genders - Create new gender
router.post('/', genderController.createGender);

// PUT /api/genders/:id - Update gender
router.put('/:id', genderController.updateGender);

module.exports = router; 