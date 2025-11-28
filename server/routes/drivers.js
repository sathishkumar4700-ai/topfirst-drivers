const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const { driverAuth } = require('../middleware/auth');

router.use(driverAuth);

// Check driver approval status
const checkApproval = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ userId: req.userId });
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }
    if (!driver.isApproved || driver.approvalStatus !== 'approved') {
      return res.status(403).json({ 
        message: 'Your account is pending admin approval',
        approvalStatus: driver.approvalStatus,
        rejectionReason: driver.rejectionReason
      });
    }
    req.driver = driver;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get driver's own bookings (requires approval)
router.get('/my-bookings', checkApproval, async (req, res) => {
  try {
    const bookings = await Booking.find({ driverId: req.driver._id })
      .populate('customerId', 'name phone')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status (requires approval)
router.put('/bookings/:id/status', checkApproval, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle availability (requires approval)
router.put('/availability', checkApproval, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    req.driver.isAvailable = isAvailable;
    // Update status based on availability
    req.driver.status = isAvailable ? 'online' : 'offline';
    req.driver.lastStatusUpdate = new Date();
    await req.driver.save();

    res.json({ 
      message: 'Availability updated', 
      isAvailable: req.driver.isAvailable,
      status: req.driver.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update driver status (online/occupied/offline)
router.put('/status', checkApproval, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['online', 'occupied', 'offline'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be: online, occupied, or offline' });
    }

    req.driver.status = status;
    req.driver.lastStatusUpdate = new Date();
    // Update isAvailable based on status
    req.driver.isAvailable = status === 'online';
    await req.driver.save();

    res.json({ 
      message: 'Status updated', 
      status: req.driver.status,
      isAvailable: req.driver.isAvailable
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get driver profile (no approval check - drivers need to see their status)
router.get('/profile', async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.userId }).populate('userId', 'name email phone');
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
