const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Super Admin phone numbers (hardcoded)
const SUPER_ADMINS = {
  '9962366104': {
    name: 'Kraja',
    email: 'kraja4700@gmail.com'
  },
  '8179824281': {
    name: 'Sathish',
    email: 'sathishkumar4700@gmail.com'
  }
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.userId = user._id;
    req.user = user;
    req.userPhone = user.phone;
    req.isSuperAdmin = SUPER_ADMINS[user.phone] !== undefined;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    // Check if super admin or regular admin
    const isSuperAdmin = SUPER_ADMINS[user.phone] !== undefined;
    if (!isSuperAdmin && user.role !== 'admin' && user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    req.userId = user._id;
    req.user = user;
    req.userPhone = user.phone;
    req.isSuperAdmin = isSuperAdmin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const superAdminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    // Only super admins allowed
    if (!SUPER_ADMINS[user.phone]) {
      return res.status(403).json({ message: 'Access denied. Super Admin only.' });
    }

    req.userId = user._id;
    req.user = user;
    req.userPhone = user.phone;
    req.isSuperAdmin = true;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const driverAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    if (user.role !== 'driver') {
      return res.status(403).json({ message: 'Access denied. Driver only.' });
    }

    req.userId = user._id;
    req.user = user;
    req.userPhone = user.phone;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { auth, adminAuth, superAdminAuth, driverAuth, SUPER_ADMINS };
