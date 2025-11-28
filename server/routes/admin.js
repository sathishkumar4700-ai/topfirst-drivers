const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');
const { adminAuth } = require('../middleware/auth');

// All routes require admin authentication
router.use(adminAuth);

// ===== DRIVERS CRUD =====

// Get all drivers
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find().populate('userId', 'name email phone isActive');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single driver
router.get('/drivers/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('userId');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create driver
router.post('/drivers', async (req, res) => {
  try {
    const { name, email, phone, password, licenseNumber, vehicleType, experience, address, aadharNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'driver'
    });
    await user.save();

    const driver = new Driver({
      userId: user._id,
      licenseNumber,
      vehicleType,
      experience,
      address,
      aadharNumber
    });
    await driver.save();

    res.status(201).json({ message: 'Driver created successfully', driver });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update driver
router.put('/drivers/:id', async (req, res) => {
  try {
    const { name, email, phone, licenseNumber, vehicleType, experience, address, aadharNumber, isAvailable } = req.body;

    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Update user info
    await User.findByIdAndUpdate(driver.userId, {
      name,
      email,
      phone
    });

    // Update driver info
    driver.licenseNumber = licenseNumber || driver.licenseNumber;
    driver.vehicleType = vehicleType || driver.vehicleType;
    driver.experience = experience || driver.experience;
    driver.address = address || driver.address;
    driver.aadharNumber = aadharNumber || driver.aadharNumber;
    if (isAvailable !== undefined) driver.isAvailable = isAvailable;

    await driver.save();

    res.json({ message: 'Driver updated successfully', driver });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete driver (soft delete)
router.delete('/drivers/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    await User.findByIdAndUpdate(driver.userId, { isActive: false });
    
    res.json({ message: 'Driver deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== CUSTOMERS CRUD =====

// Get all customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single customer
router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update customer
router.put('/customers/:id', async (req, res) => {
  try {
    const { name, email, phone, isActive } = req.body;
    
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    if (isActive !== undefined) customer.isActive = isActive;

    await customer.save();

    res.json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete customer (soft delete)
router.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.isActive = false;
    await customer.save();

    res.json({ message: 'Customer deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== BOOKINGS CRUD =====

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customerId', 'name email phone')
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

// Get single booking
router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId')
      .populate('driverId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking (assign driver, change status)
router.put('/bookings/:id', async (req, res) => {
  try {
    const { driverId, status, amount, paymentStatus, notes } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (driverId) booking.driverId = driverId;
    if (status) booking.status = status;
    if (amount) booking.amount = amount;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (notes) booking.notes = notes;

    await booking.save();

    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== DRIVER APPROVAL SYSTEM =====

// Get pending driver approvals
router.get('/drivers/pending-approvals', async (req, res) => {
  try {
    const pendingDrivers = await Driver.find({ approvalStatus: 'pending' })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(pendingDrivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve driver
router.put('/drivers/:id/approve', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('userId', 'name email phone');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.isApproved = true;
    driver.approvalStatus = 'approved';
    driver.approvedBy = req.userId;
    driver.approvedAt = new Date();
    driver.rejectionReason = undefined;
    await driver.save();

    // TODO: Send email/WhatsApp notification to driver
    console.log(`Driver ${driver.userId.name} approved by admin`);

    res.json({ 
      message: 'Driver approved successfully', 
      driver,
      notification: `${driver.userId.name} has been approved and can now access the driver dashboard`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject driver
router.put('/drivers/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const driver = await Driver.findById(req.params.id).populate('userId', 'name email phone');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.isApproved = false;
    driver.approvalStatus = 'rejected';
    driver.rejectionReason = reason || 'Application rejected by admin';
    await driver.save();

    // TODO: Send email/WhatsApp notification to driver
    console.log(`Driver ${driver.userId.name} rejected by admin`);

    res.json({ 
      message: 'Driver application rejected', 
      driver,
      notification: `${driver.userId.name} has been rejected. Reason: ${driver.rejectionReason}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== DASHBOARD STATS =====
router.get('/stats', async (req, res) => {
  try {
    const totalDrivers = await Driver.countDocuments();
    const activeDrivers = await Driver.countDocuments({ isAvailable: true, isApproved: true });
    const pendingDriverApprovals = await Driver.countDocuments({ approvalStatus: 'pending' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    res.json({
      totalDrivers,
      activeDrivers,
      pendingDriverApprovals,
      totalCustomers,
      totalBookings,
      pendingBookings,
      completedBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== HOMEPAGE CONTENT CRUD =====
const Content = require('../models/Content');

// Get all content
router.get('/content', async (req, res) => {
  try {
    const { section } = req.query;
    const filter = section ? { section } : {};
    const content = await Content.find(filter).sort({ section: 1, order: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single content
router.get('/content/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create content
router.post('/content', async (req, res) => {
  try {
    const { section, title, description, icon, order, metadata } = req.body;

    const content = new Content({
      section,
      title,
      description,
      icon,
      order,
      metadata
    });

    await content.save();
    res.status(201).json({ message: 'Content created successfully', content });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update content
router.put('/content/:id', async (req, res) => {
  try {
    const { section, title, description, icon, order, isActive, metadata } = req.body;

    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    if (section) content.section = section;
    if (title) content.title = title;
    if (description !== undefined) content.description = description;
    if (icon !== undefined) content.icon = icon;
    if (order !== undefined) content.order = order;
    if (isActive !== undefined) content.isActive = isActive;
    if (metadata) content.metadata = metadata;

    await content.save();
    res.json({ message: 'Content updated successfully', content });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete content
router.delete('/content/:id', async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
