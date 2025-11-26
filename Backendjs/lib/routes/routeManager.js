const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./auth');

// Mount routes
router.use('/auth', authRoutes);

// API documentation route
router.get('/docs', (req, res) => {
    res.json({
        message: 'Stallion Optical E-commerce API Documentation',
        version: '1.0.0',
        endpoints: {
            // Authentication endpoints
            auth: '/api/auth',
        }
    });
});

module.exports = router; 