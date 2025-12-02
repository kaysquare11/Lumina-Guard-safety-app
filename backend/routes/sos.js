// ============================================
// SOS ROUTES
// routes/sos.js
// ============================================

const express = require('express');
const Alert = require('../models/Alert');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// ============================================
// ROUTE: POST /api/sos/trigger
// Purpose: Trigger an SOS alert
// Access: Private (authenticated users)
// ============================================

router.post('/trigger', async (req, res) => {
  try {
    const { latitude, longitude, message } = req.body;

    // 1. Validate input
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location coordinates'
      });
    }

    // 2. Validate coordinate ranges
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    // 3. Create SOS alert
    const alert = await Alert.create({
      user: req.user.id,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude] // GeoJSON format: [longitude, latitude]
      },
      message: message || 'Emergency SOS triggered',
      alertType: 'sos',
      status: 'active'
    });

    // 4. Populate user information
    await alert.populate('user', 'name email phone');

    // 5. Send response
    res.status(201).json({
      success: true,
      message: 'SOS alert created successfully',
      data: {
        alert: {
          id: alert._id,
          user: alert.user,
          location: {
            latitude: alert.location.coordinates[1],
            longitude: alert.location.coordinates[0]
          },
          message: alert.message,
          status: alert.status,
          createdAt: alert.createdAt
        }
      }
    });

    // TODO: In Week 10, add notification logic here
    // - Send email to emergency contacts
    // - Send SMS notifications

  } catch (error) {
    console.error('SOS trigger error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create SOS alert',
      error: error.message
    });
  }
});

// ============================================
// ROUTE: GET /api/sos/my-alerts
// Purpose: Get all alerts for the logged-in user
// Access: Private
// ============================================

router.get('/my-alerts', async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: {
        alerts: alerts.map(alert => ({
          id: alert._id,
          location: {
            latitude: alert.location.coordinates[1],
            longitude: alert.location.coordinates[0]
          },
          message: alert.message,
          status: alert.status,
          createdAt: alert.createdAt,
          resolvedAt: alert.resolvedAt
        }))
      }
    });

  } catch (error) {
    console.error('Fetch alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts',
      error: error.message
    });
  }
});

// ============================================
// ROUTE: GET /api/sos/active
// Purpose: Get all active alerts (for admin/real-time tracking)
// Access: Private
// ============================================

router.get('/active', async (req, res) => {
  try {
    const alerts = await Alert.find({ status: 'active' })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: {
        alerts: alerts.map(alert => ({
          id: alert._id,
          user: alert.user,
          location: {
            latitude: alert.location.coordinates[1],
            longitude: alert.location.coordinates[0]
          },
          locationHistory: alert.locationHistory.map(loc => ({
            latitude: loc.coordinates[1],
            longitude: loc.coordinates[0],
            timestamp: loc.timestamp
          })),
          message: alert.message,
          status: alert.status,
          createdAt: alert.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Fetch active alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active alerts',
      error: error.message
    });
  }
});

// ============================================
// ROUTE: PUT /api/sos/:id/location
// Purpose: Update location for real-time tracking (Week 5)
// Access: Private
// ============================================

router.put('/:id/location', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const alertId = req.params.id;

    // 1. Validate input
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location coordinates'
      });
    }

    // 2. Find alert
    const alert = await Alert.findById(alertId);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // 3. Check if user owns this alert
    if (alert.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this alert'
      });
    }

    // 4. Update location
    await alert.addLocationUpdate(latitude, longitude);

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      data: {
        alertId: alert._id,
        location: {
          latitude,
          longitude
        }
      }
    });

  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message
    });
  }
});

// ============================================
// ROUTE: PUT /api/sos/:id/resolve
// Purpose: Mark an alert as resolved
// Access: Private
// ============================================

router.put('/:id/resolve', async (req, res) => {
  try {
    const { notes } = req.body;
    const alertId = req.params.id;

    const alert = await Alert.findById(alertId);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Check if user owns this alert
    if (alert.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to resolve this alert'
      });
    }

    await alert.updateStatus('resolved', notes);

    res.status(200).json({
      success: true,
      message: 'Alert resolved successfully',
      data: {
        alert: {
          id: alert._id,
          status: alert.status,
          resolvedAt: alert.resolvedAt
        }
      }
    });

  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve alert',
      error: error.message
    });
  }
});

module.exports = router;