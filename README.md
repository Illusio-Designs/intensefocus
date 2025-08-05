# IntenseFocus Backend

A Node.js backend application for the IntenseFocus Optical E-commerce system, migrated from Laravel PHP.

## 🚀 Features

- **RESTful API** with Express.js
- **Sequelize ORM** for database operations
- **MySQL** database integration
- **File upload** support with Multer
- **Password hashing** with bcryptjs
- **JWT Authentication** for secure API access
- **CORS** enabled for frontend integration
- **Modular architecture** with separate route files

## 📁 Project Structure

```
Backend/
├── app/
│   ├── config/
│   │   ├── database.js          # Database configuration
│   │   └── multer.js            # File upload configuration
│   ├── controllers/             # 18 controller files
│   ├── models/                  # 18 Sequelize model files
│   ├── routes/                  # 18 route files + routeManager.js
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── scripts/
│   │   └── databaseManager.js   # Database management script
│   ├── uploads/                 # File upload directories
│   └── server.js                # Main server file
├── package.json
├── env.example                  # Environment variables template
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp env.example .env
   ```
   
   Configure your environment variables:
   ```env
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=optical
   DB_USER=root
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔐 Authentication System

### **Email/Password Authentication**
- Traditional email and password login
- JWT token generation
- Role-based access control

### **Authentication Flow:**
1. **Register**: `POST /api/users/register`
2. **Login**: `POST /api/users/login`
3. **Access Protected Routes**: Include JWT token in headers

## 📊 API Endpoints

### Base URL: `http://localhost:3000/api`

### 🔐 Authentication (No Auth Required)
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /users/logout` - User logout

### 👤 User Management (Requires Auth)
- `GET /users` - Get all users
- `GET /users/me` - Get current authenticated user
- `GET /users/search` - Search users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user (Admin only)
- `PUT /users/:id` - Update user
- `POST /users/:id/upload-profile` - Upload profile image

### 🛍️ Products
- `GET /products` - Get all products
- `GET /products/active` - Get active products
- `GET /products/featured` - Get featured products
- `GET /products/search` - Search products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- `PUT /products/:id` - Update product

### 🏷️ Product Attributes
- `GET /brands` - Get all brands
- `GET /collections` - Get all collections
- `GET /shapes` - Get all shapes
- `GET /genders` - Get all genders
- `GET /lens-materials` - Get all lens materials
- `GET /lens-colors` - Get all lens colors
- `GET /frame-materials` - Get all frame materials
- `GET /frame-colors` - Get all frame colors
- `GET /types` - Get all types

### 🖼️ Product Images
- `GET /product-images` - Get all product images
- `GET /product-images/product/:product_id` - Get images by product
- `GET /product-images/product/:product_id/primary` - Get primary image
- `POST /product-images` - Create product image
- `PUT /product-images/:id/set-primary` - Set primary image

### 🌍 Location Management
- `GET /states` - Get all states
- `GET /cities` - Get all cities
- `GET /cities/state/:state_id` - Get cities by state
- `GET /zones` - Get all zones
- `GET /zones/state/:state_id` - Get zones by state
- `GET /zones/city/:city_id` - Get zones by city

### 🎛️ System
- `GET /sliders` - Get all sliders
- `GET /role-types` - Get all role types

### 📚 Documentation
- `GET /docs` - API documentation

## 🔧 Available Scripts

### NPM Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

### Database Script

The application includes one comprehensive database management script located in `app/scripts/` directory.

#### `databaseManager.js`
**Purpose**: All-in-one database management tool.

**What it does**:
- ✅ Checks database connection
- 📊 Shows status of all 21 models
- 🔨 Creates missing tables automatically
- 🗑️ Drops extra tables (not in 21 models)
- 🔧 Auto-alters tables for new fields
- 📈 Provides detailed summary
- 🚀 Runs automatically when server starts

**Usage**:
```bash
cd app/scripts
node databaseManager.js
```

**Auto-run**: The script runs automatically when you start the server with `npm run dev` or `npm start`

### Script Output

The script provides detailed console output with:
- ✅ Success indicators
- ❌ Error indicators
- ⚠️ Warning indicators
- 📊 Statistics and counts
- 📋 Detailed reports



## 🗄️ Database

The application uses MySQL with Sequelize ORM. All models are configured to work with existing database tables without creating new ones.

### Database Management
The database manager runs automatically when the server starts and handles:
- **Auto Table Creation**: Creates missing tables from your 21 models
- **Auto Table Cleanup**: Drops extra tables not in your 21 models
- **Auto Table Alteration**: Adds new fields to existing tables
- **Manual Run**: `node app/scripts/databaseManager.js` (if needed)

## 📁 File Upload

The application supports file uploads for:
- Profile images (`/uploads/profile/`)
- Product images (`/uploads/products/`)
- Bills (`/uploads/bills/`)
- Sliders (`/uploads/sliders/`)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **CORS Configuration**: Cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error handling middleware
- **File Type Validation**: Upload security

## 🏗️ Architecture

### Route Management
- **Centralized routing** through `routeManager.js`
- **Modular route files** for each controller
- **Authentication middleware** for protected routes
- **Clean server.js** with minimal imports

### Controller Pattern
- **RESTful controllers** with standard CRUD operations
- **Authentication controllers** for login/logout
- **Search functionality** across all modules
- **Active filtering** for status-based queries
- **Relationship handling** for related data

### Model Design
- **Sequelize models** with proper field definitions
- **JWT token generation** methods
- **Table name mapping** to existing database
- **Timestamp handling** with snake_case columns
- **No soft deletes** (paranoid disabled)

## 🚀 Getting Started

1. Ensure MySQL is running with the `optical` database
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`
4. Start the server: `npm run dev`
5. Access API documentation: `http://localhost:3000/api/docs`

## 📝 Notes

- All models work with existing database tables
- No database migrations needed
- File uploads are configured for image types only
- API responses follow consistent JSON format
- Error handling is implemented across all endpoints
- JWT tokens expire after 24 hours

## 🔧 Script Troubleshooting

### Common Script Issues

1. **Database Connection Error**
   - Check your `.env` file configuration
   - Ensure MySQL server is running
   - Verify database credentials

2. **Model Errors**
   - Check that all models are properly imported in `models/index.js`
   - Verify foreign key relationships in the database
   - Ensure model names match table names

3. **Schema Validation Errors**
   - Compare model attributes with actual database columns
   - Update models to match database schema
   - Check for typos in column names

4. **Authentication Errors**
   - Verify JWT_SECRET is set in environment variables
   - Ensure database has the required fields in users table

### Getting Help with Scripts

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your database connection
3. Ensure all dependencies are installed
4. Check that the `.env` file is properly configured

### Script Dependencies

The script depends on:
- `sequelize` - Database ORM
- `fs` - File system operations
- `path` - Path utilities

All dependencies should be available after running `npm install` in the Backend directory.

## 🤝 Contributing

1. Follow the existing code structure
2. Maintain consistent API response format
3. Add proper error handling
4. Update documentation for new endpoints
5. Test authentication flows before committing 