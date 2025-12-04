const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./auth');
const rolesRoutes = require('./roles');
const userRoutes = require('./user');
const partyRoutes = require('./party');
const distributorRoutes = require('./distributor');
const salesmanRoutes = require('./salesman');
const cityRoutes = require('./city');
const stateRoutes = require('./state');
const countryRoutes = require('./country');
const zoneRoutes = require('./zone');
const productRoutes = require('./product');
const genderRoutes = require('./gender');
const colorCodesRoutes = require('./color_codes');
const frameColorRoutes = require('./frame_color');
const frameTypeRoutes = require('./frame_type');
const lensMaterialRoutes = require('./lens_material');
const lensColorsRoutes = require('./lens_colors');
const shapesRoutes = require('./shapes');
const frameMaterialRoutes = require('./frame_material');


router.use((req, res, next) => {
    console.log(`-------------------------------- ${req.method} ${req.url} --------------------------------`);
    next();
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/roles', rolesRoutes);
router.use('/users', userRoutes);
router.use('/parties', partyRoutes);
router.use('/distributors', distributorRoutes);
router.use('/salesmen', salesmanRoutes);
router.use('/cities', cityRoutes);
router.use('/states', stateRoutes);
router.use('/countries', countryRoutes);
router.use('/zones', zoneRoutes);
router.use('/products', productRoutes);
router.use('/genders', genderRoutes);
router.use('/color_codes', colorCodesRoutes);
router.use('/frame_colors', frameColorRoutes);
router.use('/frame_types', frameTypeRoutes);
router.use('/lens_materials', lensMaterialRoutes);
router.use('/lens_colors', lensColorsRoutes);
router.use('/shapes', shapesRoutes);
router.use('/frame_materials', frameMaterialRoutes);

// API documentation route
router.get('/docs', (req, res) => {
    res.json({
        message: 'Stallion Optical E-commerce API Documentation',
        version: '1.0.0',
        endpoints: {
            // Authentication endpoints
            auth: '/api/auth',
            roles: '/api/roles',
            users: '/api/users',
            parties: '/api/parties',
            distributors: '/api/distributors',
            salesmen: '/api/salesmen',
            cities: '/api/cities',
            states: '/api/states',
            countries: '/api/countries',
            zones: '/api/zones',
        }
    });
});

module.exports = router; 