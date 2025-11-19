import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import httpStatus from 'http-status';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

// Get the root directory (Backend folder)
const rootDir = path.join(__dirname, '..', '..');

// Create upload directories if they don't exist
const createUploadDirs = () => {
    const dirs = [
        path.join(rootDir, 'uploads', 'profile'),
        path.join(rootDir, 'uploads', 'products'),
        path.join(rootDir, 'uploads', 'bills'),
        path.join(rootDir, 'uploads', 'sliders')
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

createUploadDirs();

// Image compression function
const compressImage = async (file: any, quality = 80) => {
    try {
        const compressedBuffer = await sharp(file.buffer)
            .jpeg({ quality: quality })
            .png({ quality: quality })
            .webp({ quality: quality })
            .toBuffer();

        return compressedBuffer;
    } catch (error) {
        console.error('Image compression error:', error);
        return file.buffer; // Return original if compression fails
    }
};

// Storage configuration
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: Request, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Main multer configuration
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// Profile image upload with compression
const profileUpload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: fileFilter
}).single('profile_image');

// Product image upload with compression
export const productUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
}).single('product_image');

// Slider image upload with compression
export const sliderUpload = multer({
    storage: storage,
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB limit
    },
    fileFilter: fileFilter
}).single('slider_image');

// Bill upload (no compression for documents)
const billUpload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req: Request, file: any, cb: any) => {
        const allowedTypes = /pdf|jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF and image files are allowed for bills!'), false);
        }
    }
}).single('bill_file');

// General upload for other files
const generalUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
}).single('file');

export interface FileInfoRequest extends Request {
    file: any;
    fileInfo: {
        filename: string;
        path: string;
        size: number;
        mimetype: string;
        originalName: string;
    };
}
// Middleware to handle image compression and saving
const processAndSaveImage = (uploadType = 'general') => {
    return async (req: FileInfoRequest, res: Response, next: NextFunction) => {
        try {
            // Use appropriate upload middleware based on type
            let uploadMiddleware;
            switch (uploadType) {
                case 'profile':
                    uploadMiddleware = profileUpload;
                    break;
                case 'product':
                    uploadMiddleware = productUpload;
                    break;
                case 'slider':
                    uploadMiddleware = sliderUpload;
                    break;
                case 'bill':
                    uploadMiddleware = billUpload;
                    break;
                default:
                    uploadMiddleware = upload.single('file');
            }

            uploadMiddleware(req, res, async (err: any) => {
                if (err) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: err.message
                    });
                }

                if (!req.file) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: 'No file uploaded'
                    });
                }

                try {
                    let processedBuffer = req.file.buffer;
                    let fileName = req.file.originalname;

                    // Compress image if it's an image file (not for bills)
                    if (uploadType !== 'bill' && req.file.mimetype.startsWith('image/')) {
                        const quality = uploadType === 'profile' ? 85 : 80;
                        processedBuffer = await compressImage(req.file, quality);

                        // Generate optimized filename
                        const ext = path.extname(fileName).toLowerCase();
                        const nameWithoutExt = path.basename(fileName, ext);
                        const timestamp = Date.now();
                        fileName = `${nameWithoutExt}-${timestamp}${ext}`;
                    } else {
                        // For bills, keep original filename with timestamp
                        const ext = path.extname(fileName);
                        const nameWithoutExt = path.basename(fileName, ext);
                        const timestamp = Date.now();
                        fileName = `${nameWithoutExt}-${timestamp}${ext}`;
                    }

                    // Determine upload path using absolute paths
                    let uploadPath;
                    switch (uploadType) {
                        case 'profile':
                            uploadPath = path.join(rootDir, 'uploads', 'profile');
                            break;
                        case 'product':
                            uploadPath = path.join(rootDir, 'uploads', 'products');
                            break;
                        case 'slider':
                            uploadPath = path.join(rootDir, 'uploads', 'sliders');
                            break;
                        case 'bill':
                            uploadPath = path.join(rootDir, 'uploads', 'bills');
                            break;
                        default:
                            uploadPath = path.join(rootDir, 'uploads', 'general');
                    }

                    // Save file
                    const fullPath = path.join(uploadPath, fileName);
                    fs.writeFileSync(fullPath, processedBuffer);

                    // Add file info to request
                    req.fileInfo = {
                        filename: fileName,
                        path: fullPath,
                        size: processedBuffer.length,
                        mimetype: req.file.mimetype,
                        originalName: req.file.originalname
                    };

                    next();
                } catch (error) {
                    console.error('File processing error:', error);
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Error processing file'
                    });
                }
            });
        } catch (error) {
            console.error('Upload middleware error:', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Upload middleware error'
            });
        }
    };
};

export const uploadProductImage = processAndSaveImage('product');
export const uploadSliderImage = processAndSaveImage('slider');
export const uploadBillImage = processAndSaveImage('bill');
export const uploadGeneralImage = processAndSaveImage('general');
export const uploadProfileImage = processAndSaveImage('profile');
