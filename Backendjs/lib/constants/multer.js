const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

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
const compressImage = async (file, quality = 80) => {
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
const fileFilter = (req, file, cb) => {
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
const upload = multer({
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
const productUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
}).single('product_image');

// Slider image upload with compression
const sliderUpload = multer({
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
  fileFilter: (req, file, cb) => {
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

// Middleware to handle image compression and saving
const processAndSaveImage = (uploadType = 'general') => {
  return async (req, res, next) => {
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

      uploadMiddleware(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }

        if (!req.file) {
          return res.status(400).json({
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
          return res.status(500).json({
            success: false,
            message: 'Error processing file'
          });
        }
      });
    } catch (error) {
      console.error('Upload middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Upload middleware error'
      });
    }
  };
};

module.exports = {
  upload,
  profileUpload: processAndSaveImage('profile'),
  productUpload: processAndSaveImage('product'),
  sliderUpload: processAndSaveImage('slider'),
  billUpload: processAndSaveImage('bill'),
  generalUpload: processAndSaveImage('general'),
  processAndSaveImage
}; 