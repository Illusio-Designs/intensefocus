import express, { Router } from 'express';
import roleTypeController from '../controllers/roleType.controller';

const roleTypeRouter: Router = express.Router();
// GET /api/role-types - Get all role types
roleTypeRouter.get('/', roleTypeController.getAllRoleTypes);

// GET /api/role-types/active - Get active role types only
roleTypeRouter.get('/active', roleTypeController.getActiveRoleTypes);

// GET /api/role-types/search - Search role types
roleTypeRouter.get('/search', roleTypeController.searchRoleTypes);

// GET /api/role-types/:id - Get single role type by ID
roleTypeRouter.get('/:id', roleTypeController.getRoleTypeById);

// POST /api/role-types - Create new role type
roleTypeRouter.post('/', roleTypeController.createRoleType);

// PUT /api/role-types/:id - Update role type
roleTypeRouter.put('/:id', roleTypeController.updateRoleType);
export default roleTypeRouter;