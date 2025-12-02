// ============================================
// WOMEN SAFETY APP - BACKEND SERVER
// Main Entry Point (server.js)
// ============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Routes
const authRoutes = require('./routes/auth');
const sosRoutes = require('./routes/sos');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS (allows frontend to communicate with backend)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Request logger (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/women-safety-app', {
})
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ============================================
// ROUTES
// ============================================

// Health check route (test if server is running)
app.get('/', (req, res) => {
  res.json({
    message: '🌟 Lumina Guard API - Your Circle of Light',
    tagline: 'Global Women\'s Safety Platform',
    status: 'Server is running',
    version: '1.0.0'
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// SOS routes (protected)
app.use('/api/sos', sosRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Access at: http://localhost:${PORT}`);
});

module.exports = app;