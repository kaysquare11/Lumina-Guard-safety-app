// ============================================
// AUTHENTICATION MIDDLEWARE
// middleware/auth.js
// Purpose: Protect routes that require authentication
// ============================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ============================================
// MIDDLEWARE: Protect Routes
// ============================================

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login to access this resource.'
      });
    }

    // 3. Verify token
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
      );

      // 4. Get user from token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token is invalid.'
        });
      }

      // 5. Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Your account has been deactivated.'
        });
      }

      // 6. Attach user to request object
      req.user = user;

      // 7. Continue to next middleware/route handler
      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.'
      });
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// ============================================
// MIDDLEWARE: Admin Only
// ============================================

exports.adminOnly = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();

  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};