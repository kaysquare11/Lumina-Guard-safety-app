// ============================================
// ALERT MODEL - SOS Alert Database Schema
// models/Alert.js
// ============================================

const mongoose = require('mongoose');

// Define the Alert Schema
const alertSchema = new mongoose.Schema({
  // Reference to the user who triggered the alert
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  
  // Location information
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Location coordinates are required'],
      validate: {
        validator: function(coords) {
          return coords.length === 2 &&
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90;     // latitude
        },
        message: 'Invalid coordinates format'
      }
    }
  },
  
  // Human-readable address (optional, can be fetched via reverse geocoding)
  address: {
    type: String,
    trim: true
  },
  
  // Alert status
  status: {
    type: String,
    enum: ['active', 'resolved', 'false-alarm'],
    default: 'active'
  },
  
  // Alert type
  alertType: {
    type: String,
    enum: ['sos', 'suspicious-activity'],
    default: 'sos'
  },
  
  // Additional information
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  // Tracking data for real-time updates (Week 5)
  locationHistory: [{
    coordinates: [Number],
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Response tracking
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  responseTime: {
    type: Date
  },
  
  resolutionNotes: {
    type: String,
    trim: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// ============================================
// INDEXES (for faster queries)
// ============================================

// Geospatial index for location-based queries
alertSchema.index({ location: '2dsphere' });

// Index for querying by user and status
alertSchema.index({ user: 1, status: 1 });

// Index for querying recent alerts
alertSchema.index({ createdAt: -1 });

// ============================================
// METHODS
// ============================================

// Method to update alert status
alertSchema.methods.updateStatus = async function(newStatus, notes = '') {
  this.status = newStatus;
  if (newStatus === 'resolved') {
    this.resolvedAt = new Date();
  }
  if (notes) {
    this.resolutionNotes = notes;
  }
  return await this.save();
};

// Method to add location to tracking history
alertSchema.methods.addLocationUpdate = async function(latitude, longitude) {
  this.locationHistory.push({
    coordinates: [longitude, latitude],
    timestamp: new Date()
  });
  
  // Keep only last 100 location points to prevent data bloat
  if (this.locationHistory.length > 100) {
    this.locationHistory = this.locationHistory.slice(-100);
  }
  
  return await this.save();
};

// ============================================
// STATIC METHODS
// ============================================

// Find active alerts near a location (for safe zones feature in Week 4)
alertSchema.statics.findNearby = function(longitude, latitude, maxDistance = 5000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    },
    status: 'active'
  }).populate('user', 'name phone');
};

// Create and export the model
const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;