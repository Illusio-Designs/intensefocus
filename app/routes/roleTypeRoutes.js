const express = require('express');
const router = express.Router();
const roleTypeController = require('../controllers/roleTypeController');

// GET /api/role-types - Get all role types
router.get('/', roleTypeController.getAllRoleTypes);

// GET /api/role-types/active - Get active role types only
router.get('/active', roleTypeController.getActiveRoleTypes);

// GET /api/role-types/search - Search role types
router.get('/search', roleTypeController.searchRoleTypes);

// GET /api/role-types/:id - Get single role type by ID
router.get('/:id', roleTypeController.getRoleTypeById);

// POST /api/role-types - Create new role type
router.post('/', roleTypeController.createRoleType);

// PUT /api/role-types/:id - Update role type
router.put('/:id', roleTypeController.updateRoleType);

module.exports = router; 