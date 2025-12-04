const express = require('express');
const router = express.Router();
const frameTypeController = require('../controllers/frameTypeController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, frameTypeController.getFrameTypes);
router.post('/', authenticateToken, frameTypeController.createFrameType);
router.put('/:id', authenticateToken, frameTypeController.updateFrameType);
router.delete('/:id', authenticateToken, frameTypeController.deleteFrameType);

module.exports = router;