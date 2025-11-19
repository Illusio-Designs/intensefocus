import express, { Router } from 'express';
import genderController from '../controllers/gender.controller';

const genderRouter: Router = express.Router();
// GET /api/genders - Get all genders
genderRouter.get('/', genderController.getAllGenders);

// GET /api/genders/active - Get active genders only
genderRouter.get('/active', genderController.getActiveGenders);

// GET /api/genders/search - Search genders
genderRouter.get('/search', genderController.searchGenders);

// GET /api/genders/:id - Get single gender by ID
genderRouter.get('/:id', genderController.getGenderById);

// POST /api/genders - Create new gender
genderRouter.post('/', genderController.createGender);

// PUT /api/genders/:id - Update gender
genderRouter.put('/:id', genderController.updateGender);
export default genderRouter;