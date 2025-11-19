import express, { NextFunction, Request, Response, Router } from 'express';
import authRouter from './auth.router';
import brandRouter from './brand.router';
import cityRouter from './city.router';
import collectionRouter from './collection.router';
import frameColorsRouter from './frame_colors.router';
import frameMaterialRouter from './frame_material.router';
import genderRouter from './gender.router';
import lensColorRouter from './lens_color.router';
import lensMaterialRouter from './lens_material.router';
import msg91Router from './msg91.router';
import productRouter from './product.router';
import productImageRouter from './product_image.router';
import roleTypeRouter from './role_type.router';
import shapeRouter from './shape.router';
import sliderRouter from './slider.router';
import stateRouter from './state.router';
import typeRouter from './type.router';
import userRouter from './user.router';
import zoneRouter from './zone.router';
const router: Router = express.Router();

let reqCount = 0;

router.get('/', async (req: Request, res: Response) => {
    console.log("home");
    res.send("Welcome to Server 1.0.0 ");
});

router.use((req: Request, res: Response, next: NextFunction) => {
    console.log("_______________________________________________________");
    console.log(req.method + ' Request for ' + req.url + ' at ' + new Date().toLocaleString());
    reqCount++;
    console.log('reqCount : ' + reqCount);
    next();
});


// Mount routes
router.use('/api/auth', authRouter);
router.use('/api/users', userRouter);
router.use('/api/brands', brandRouter);
router.use('/api/products', productRouter);
router.use('/api/collections', collectionRouter);
router.use('/api/sliders', sliderRouter);
router.use('/api/states', stateRouter);
router.use('/api/shapes', shapeRouter);
router.use('/api/genders', genderRouter);
router.use('/api/lens-materials', lensMaterialRouter);
router.use('/api/lens-colors', lensColorRouter);
router.use('/api/frame-materials', frameMaterialRouter);
router.use('/api/frame-colors', frameColorsRouter);
router.use('/api/types', typeRouter);
router.use('/api/role-types', roleTypeRouter);
router.use('/api/cities', cityRouter);
router.use('/api/zones', zoneRouter);
router.use('/api/product-images', productImageRouter);

router.use('/api/msg91', msg91Router);

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
export default router;  