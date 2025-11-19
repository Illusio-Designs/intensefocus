import express, { Router } from 'express';
import sliderController from '../controllers/slider.controller';
import { sliderUpload } from '../middleware/multer';

const sliderRouter: Router = express.Router();

// GET /api/sliders - Get all sliders
sliderRouter.get('/', sliderController.getAllSliders);

// GET /api/sliders/active - Get active sliders only
sliderRouter.get('/active', sliderController.getActiveSliders);

// GET /api/sliders/search - Search sliders
sliderRouter.get('/search', sliderController.searchSliders);

// GET /api/sliders/:id - Get single slider by ID
sliderRouter.get('/:id', sliderController.getSliderById);

// POST /api/sliders - Create new slider
sliderRouter.post('/', sliderController.createSlider);

// PUT /api/sliders/:id - Update slider
sliderRouter.put('/:id', sliderController.updateSlider);

// POST /api/sliders/upload-image - Upload slider image
sliderRouter.post('/upload-image', sliderUpload, sliderController.uploadSliderImage);

// Additional slider routes (matching PHP SliderController)
// GET /api/sliders/all - Get all sliders (matching PHP getAllSlider)
sliderRouter.get('/all', sliderController.getAllSlider);
export default sliderRouter;