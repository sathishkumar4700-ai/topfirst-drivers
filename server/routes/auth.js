const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');
const AdminRequest = require('../models/AdminRequest');
const { auth, SUPER_ADMINS } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/driver-documents/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

// ===== PHONE-BASED AUTHENTICATION =====

// Check if phone number exists and return user type
router.post('/check-phone', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // Check if super admin
    if (SUPER_ADMINS[phone]) {
      return res.json({
        exists: true,
        userType: 'super_admin',
        requiresPassword: true,
        name: SUPER_ADMINS[phone].name
      });
    }

    // Check in database
    const user = await User.findOne({ phone });
    
    if (!user) {
      return res.json({ exists: false });
    }

    return res.json({
      exists: true,
      userType: user.role,
      requiresPassword: user.role !== 'customer',
      name: user.name,
      isActive: user.isActive
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin/Driver Login with Phone + Password
router.post('/login-password', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password required' });
    }

    // Check if super admin
    if (SUPER_ADMINS[phone]) {
      // Super admin hardcoded password: Tharish@4700
      if (password !== 'Tharish@4700') {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create or get super admin user
      let user = await User.findOne({ phone });
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
          name: SUPER_ADMINS[phone].name,
          email: SUPER_ADMINS[phone].email,
          phone,
          password: hashedPassword,
          role: 'super_admin',
          isSuperAdmin: true
        });
        await user.save();
      }

      const token = jwt.sign(
        { userId: user._id, role: 'super_admin', phone },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          role: 'super_admin',
          isSuperAdmin: true
        }
      });
    }

    // Regular user login
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Check if driver is deactivated
    if (user.role === 'driver') {
      const driver = await Driver.findOne({ userId: user._id });
      if (driver && driver.approvalStatus === 'deactivated') {
        return res.status(403).json({ 
          message: 'Your driver account has been deactivated. Please contact admin.',
          contacts: {
            email: ['kraja4700@gmail.com', 'sathishkumar4700@gmail.com'],
            phone: ['+91 9962366104', '+91 8179824281']
          }
        });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, phone: user.phone },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Customer OTP Generation
const otpStore = {}; // In production, use Redis

router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // Check if phone belongs to driver or admin
    const existingUser = await User.findOne({ phone });
    if (existingUser && existingUser.role !== 'customer') {
      return res.status(400).json({ 
        message: `This phone number is registered as ${existingUser.role}. Please login as ${existingUser.role}.`
      });
    }

    // Check if super admin
    if (SUPER_ADMINS[phone]) {
      return res.status(400).json({ 
        message: 'This phone number is registered as admin. Please login as admin.'
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[phone] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    // TODO: Send OTP via SMS (Twilio, etc.)
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ 
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only in dev
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Customer OTP Verification & Login/Register
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP required' });
    }

    // Verify OTP
    const storedOtp = otpStore[phone];
    if (!storedOtp || storedOtp.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > storedOtp.expiresAt) {
      delete otpStore[phone];
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Clear OTP
    delete otpStore[phone];

    // Find or create customer
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = new User({
        name: 'Customer',
        phone,
        role: 'customer'
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, phone: user.phone },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        totalBookings: user.totalBookings
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== DRIVER REGISTRATION =====

router.post('/register-driver', upload.fields([
  { name: 'licenseDoc', maxCount: 1 },
  { name: 'aadharDoc', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]), async (req, res) => {
  try {
    const { 
      name, email, phone, password, 
      licenseNumber, vehicleType, experience, 
      address, aadharNumber 
    } = req.body;

    // Check for duplicate phone
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ 
        message: `This phone number is already registered as ${existingUser.role}`
      });
    }

    // Check if super admin phone
    if (SUPER_ADMINS[phone]) {
      return res.status(400).json({ 
        message: 'This phone number is registered as admin'
      });
    }

    // Check if license number already exists
    const existingDriver = await Driver.findOne({ licenseNumber });
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver with this license number already exists' });
    }

    // Create user account
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'driver'
    });
    await user.save();

    // Prepare document paths
    const documents = {};
    if (req.files) {
      if (req.files.licenseDoc) documents.licenseDoc = req.files.licenseDoc[0].path;
      if (req.files.aadharDoc) documents.aadharDoc = req.files.aadharDoc[0].path;
      if (req.files.photo) documents.photo = req.files.photo[0].path;
    }

    // Create driver profile (pending approval)
    const driver = new Driver({
      userId: user._id,
      licenseNumber,
      vehicleType: vehicleType || 'manual',
      experience: experience || 0,
      address,
      aadharNumber,
      documents,
      isApproved: false,
      approvalStatus: 'pending',
      registeredAt: new Date()
    });
    await driver.save();

    // TODO: Send email/WhatsApp notification to admin
    console.log(`New driver registration: ${user.name} (${user.phone})`);

    res.status(201).json({
      message: 'Driver registration successful. Please wait for admin approval.',
      driver: {
        id: driver._id,
        name: user.name,
        phone: user.phone,
        approvalStatus: driver.approvalStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== CUSTOMER REGISTRATION =====

router.post('/register-customer', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // Check for duplicate phone
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ 
        message: `This phone number is already registered as ${existingUser.role}`
      });
    }

    // Check if super admin phone
    if (SUPER_ADMINS[phone]) {
      return res.status(400).json({ 
        message: 'This phone number is registered as admin'
      });
    }

    // Create customer account
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const user = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      role: 'customer'
    });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role, phone: user.phone },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== ADMIN REQUEST SYSTEM =====

router.post('/request-admin', async (req, res) => {
  try {
    const { phone, name, email } = req.body;

    // Check for duplicate phone
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ 
        message: `This phone number is already registered as ${existingUser.role}`
      });
    }

    // Check if already requested
    const existingRequest = await AdminRequest.findOne({ phone, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ 
        message: 'You already have a pending admin request'
      });
    }

    // Create admin request
    const adminRequest = new AdminRequest({
      phone,
      name,
      email,
      status: 'pending'
    });
    await adminRequest.save();

    // TODO: Send notification to super admins
    console.log(`New admin request from ${name} (${phone})`);

    res.status(201).json({
      message: 'Admin access request submitted. Please wait for approval.',
      request: {
        id: adminRequest._id,
        phone: adminRequest.phone,
        status: adminRequest.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    let additionalData = {};
    
    // If driver, get driver profile
    if (user.role === 'driver') {
      const driver = await Driver.findOne({ userId: user._id });
      additionalData.driverProfile = driver;
    }

    res.json({
      ...user.toObject(),
      ...additionalData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Driver Password Reset
router.put('/reset-driver-password', auth, async (req, res) => {
  try {
    const { phone, newPassword } = req.body;

    // Only admins can reset driver passwords
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && !req.isSuperAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const driver = await User.findOne({ phone, role: 'driver' });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    driver.password = hashedPassword;
    await driver.save();

    res.json({ message: 'Driver password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change Password (for logged-in users)
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Get user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if super admin
    if (user.isSuperAdmin || SUPER_ADMINS[user.phone]) {
      return res.status(403).json({ 
        message: 'Super admin password cannot be changed through this method. Please contact system administrator.' 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password must be different from current password' });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
