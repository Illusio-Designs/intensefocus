const express = require('express');
const router = express.Router();
const lensColorsController = require('../controllers/lensColorsController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, lensColorsController.getLensColors);
router.post('/', authenticateToken, lensColorsController.createLensColor);
router.put('/:id', authenticateToken, lensColorsController.updateLensColor);
router.delete('/:id', authenticateToken, lensColorsController.deleteLensColor);

module.exports = router;