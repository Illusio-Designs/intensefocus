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

// API documentation route
router.get('/docs', (req, res) => {
  res.json({
    message: 'IntenseFocus Optical E-commerce API Documentation',
    version: '1.0.0',
    endpoints: {
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
      productImages: '/api/product-images'
    }
  });
});

module.exports = router; 