const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const sequelize = require('./constants/database');
const DatabaseManager = require('./services/databaseManager');
dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// // Serve static HTML files for testing
// app.use(express.static(path.join(__dirname, '..')));

// Import and use the route manager
const routeManager = require('./routes/routeManager');
app.use('/api', routeManager);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running Now..' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// // Catch-all 404 handler - must be last
// app.all('*', (req, res) => {
//     res.status(404).json({ error: 'Route not found' });
// });

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Initialize database with DatabaseManager
        console.log('🚀 Starting Database Manager...');
        await DatabaseManager.initialize();
        console.log('✅ Database Manager completed!\n');
        // Start the server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`🏥 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
        });
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();

module.exports = app; 