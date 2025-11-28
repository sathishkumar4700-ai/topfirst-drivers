const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

// Create booking (customer)
router.post('/', auth, async (req, res) => {
  try {
    const { serviceType, pickupLocation, dropLocation, pickupDate, duration, amount, notes } = req.body;

    const booking = new Booking({
      customerId: req.userId,
      serviceType,
      pickupLocation,
      dropLocation,
      pickupDate,
      duration,
      amount,
      notes
    });

    await booking.save();

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get customer's own bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.userId })
      .populate({
        path: 'driverId',
        populate: { path: 'userId', select: 'name phone' }
      })
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
