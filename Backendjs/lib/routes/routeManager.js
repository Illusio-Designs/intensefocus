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
            // Core endpoints
            users: '/api/users',
            brands: '/api/brands',
            products: '/api/products',
            collections: '/api/collections',
            sliders: '/api/sliders',
            states: '/api/states',
            shapes: '/api/shapes',
            genders: '/api/genders',
            lensMaterials: '/api/lens-materials',
            lensColors: '/api/lens-colors',
            frameMaterials: '/api/frame-materials',
            frameColors: '/api/frame-colors',
            types: '/api/types',
            roleTypes: '/api/role-types',
            cities: '/api/cities',
            zones: '/api/zones',
            productImages: '/api/product-images',

            // Business endpoints
            allotedOrders: '/api/alloted-orders',
            distributorBrands: '/api/distributor-brands',
            salesmanTargets: '/api/salesman-targets',
            distributorWorkingStates: '/api/distributor-working-states',
            retailorWorkingStates: '/api/retailor-working-states',
            trayAllotments: '/api/tray-allotments',
            productsImages: '/api/products-images',
            orderDetails: '/api/order-details',
            notifications: '/api/notifications',
            loginHistory: '/api/login-history',

            // Authentication endpoints
            msg91: '/api/msg91'
        }
    });
});

module.exports = router; 