// ============================================
// server.js
// ============================================
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');
const scanRoutes = require('./routes/scanRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', healthRoutes);
app.use('/api/scan', scanRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Reveal API is running',
    timestamp: new Date().toISOString()
  });
});

// API Documentation route
app.get('/api', (req, res) => {
  res.json({
    message: 'Reveal API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      user: {
        profile: 'GET /api/user/profile',
        updateProfile: 'PUT /api/user/profile'
      },
      health: {
        getHealthData: 'GET /api/health-data',
        updateConditions: 'POST /api/health-conditions',
        updateAllergies: 'POST /api/allergic-foods',
        updateReactions: 'POST /api/food-reactions'
      },
      scan: {
        scanWithImage: 'POST /api/scan/image',
        scanWithText: 'POST /api/scan/text',
        getHistory: 'GET /api/scan/history',
        getScanById: 'GET /api/scan/:id'
      }
    }
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connected successfully');
    
    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('✓ Database synchronized');
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API Documentation: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('✗ Unable to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();