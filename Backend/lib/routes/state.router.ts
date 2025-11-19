import express, { Router } from 'express';
import stateController from '../controllers/state.controller';

const stateRouter: Router = express.Router();
// GET /api/states - Get all states
stateRouter.get('/', stateController.getAllStates);

// GET /api/states/active - Get active states only
stateRouter.get('/active', stateController.getActiveStates);

// GET /api/states/search - Search states
stateRouter.get('/search', stateController.searchStates);

// GET /api/states/:id - Get single state by ID
stateRouter.get('/:id', stateController.getStateById);

// POST /api/states - Create new state
stateRouter.post('/', stateController.createState);

// PUT /api/states/:id - Update state
stateRouter.put('/:id', stateController.updateState);
export default stateRouter;