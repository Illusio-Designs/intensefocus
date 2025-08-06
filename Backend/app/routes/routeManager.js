const express = require('express');
const router = express.Router();

// Import all route files
const userRoutes = require('./userRoutes');
const brandRoutes = require('./brandRoutes');
const productRoutes = require('./productRoutes');
const collectionRoutes = require('./collectionRoutes');
const sliderRoutes = require('./sliderRoutes');
const stateRoutes = require('./stateRoutes');
const shapeRoutes = require('./shapeRoutes');
const genderRoutes = require('./genderRoutes');
const lensMaterialRoutes = require('./lensMaterialRoutes');
const lensColorRoutes = require('./lensColorRoutes');
const frameMaterialRoutes = require('./frameMaterialRoutes');
const frameColorRoutes = require('./frameColorRoutes');
const typeRoutes = require('./typeRoutes');
const roleTypeRoutes = require('./roleTypeRoutes');
const citiesRoutes = require('./citiesRoutes');
const zoneRoutes = require('./zoneRoutes');
const productImagesRoutes = require('./productImagesRoutes');

// Import new business route files
const allotedOrdersRoutes = require('./allotedOrdersRoutes');
const distributorBrandsRoutes = require('./distributorBrandsRoutes');
const salesmanTargetRoutes = require('./salesmanTargetRoutes');
const distributorWorkingStateRoutes = require('./distributorWorkingStateRoutes');
const retailorWorkingStateRoutes = require('./retailorWorkingStateRoutes');
const trayAllotmentRoutes = require('./trayAllotmentRoutes');
const productsImageRoutes = require('./productsImageRoutes');
const orderDetailsRoutes = require('./orderDetailsRoutes');
const notificationRoutes = require('./notificationRoutes');
const loginHistoryRoutes = require('./loginHistoryRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/brands', brandRoutes);
router.use('/products', productRoutes);
router.use('/collections', collectionRoutes);
router.use('/sliders', sliderRoutes);
router.use('/states', stateRoutes);
router.use('/shapes', shapeRoutes);
router.use('/genders', genderRoutes);
router.use('/lens-materials', lensMaterialRoutes);
router.use('/lens-colors', lensColorRoutes);
router.use('/frame-materials', frameMaterialRoutes);
router.use('/frame-colors', frameColorRoutes);
router.use('/types', typeRoutes);
router.use('/role-types', roleTypeRoutes);
router.use('/cities', citiesRoutes);
router.use('/zones', zoneRoutes);
router.use('/product-images', productImagesRoutes);

// Mount new business routes
router.use('/alloted-orders', allotedOrdersRoutes);
router.use('/distributor-brands', distributorBrandsRoutes);
router.use('/salesman-targets', salesmanTargetRoutes);
router.use('/distributor-working-states', distributorWorkingStateRoutes);
router.use('/retailor-working-states', retailorWorkingStateRoutes);
router.use('/tray-allotments', trayAllotmentRoutes);
router.use('/products-images', productsImageRoutes);
router.use('/order-details', orderDetailsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/login-history', loginHistoryRoutes);

// API documentation route
router.get('/docs', (req, res) => {
  res.json({
    message: 'IntenseFocus Optical E-commerce API Documentation',
    version: '1.0.0',
    endpoints: {
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
      loginHistory: '/api/login-history'
    }
  });
});

module.exports = router; 