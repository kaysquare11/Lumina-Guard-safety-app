// ============================================
// AUTHENTICATION ROUTES
// routes/auth.js
// ============================================

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ============================================
// HELPER FUNCTION - Generate JWT Token
// ============================================

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
    { expiresIn: '7d' } // Token valid for 7 days
  );
};

// ============================================
// ROUTE: POST /api/auth/register
// Purpose: Register a new user
// Access: Public
// ============================================

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // 3. Create new user (password will be hashed automatically by the model)
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    // 4. Generate JWT token
    const token = generateToken(user._id);

    // 5. Send response
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// ============================================
// ROUTE: POST /api/auth/login
// Purpose: Login existing user
// Access: Public
// ============================================

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // 2. Find user by email (include password field)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 3. Check if password matches
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 4. Update last login time
    user.lastLogin = new Date();
    await user.save();

    // 5. Generate JWT token
    const token = generateToken(user._id);

    // 6. Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// ============================================
// ROUTE: GET /api/auth/me
// Purpose: Get current logged-in user
// Access: Private (requires token)
// ============================================

router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
    );

    // Get user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          emergencyContacts: user.emergencyContacts
        }
      }
    });

  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

// ============================================
// ROUTE: POST /api/auth/logout
// Purpose: Logout user (client-side should delete token)
// Access: Public
// ============================================

router.post('/logout', (req, res) => {
  // In a JWT-based system, logout is handled on the client side
  // by deleting the token. This endpoint is just for completeness.
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;