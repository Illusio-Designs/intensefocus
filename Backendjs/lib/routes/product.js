const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, productController.getProducts);
router.post('/', authenticateToken, productController.createProduct);
router.put('/:id', authenticateToken, productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);

module.exports = router;