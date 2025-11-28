const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  driverPhone: String,
  serviceType: {
    type: String,
    enum: ['hourly', 'airport', 'outstation', 'corporate', 'local'],
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['manual', 'automatic', 'both']
  },
  pickupLocation: {
    type: String,
    required: true
  },
  dropLocation: String,
  pickupDateTime: {
    type: Date,
    required: true
  },
  duration: Number,
  status: {
    type: String,
    enum: ['pending', 'assigned', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  amount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  notes: String,
  assignedAt: Date,
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
