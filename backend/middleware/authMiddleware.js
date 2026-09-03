const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const memoryStore = require('../config/memoryStore');

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Authentication token is missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ase_aptitude_super_secret_jwt_key_2026_secure_key');
    let admin = null;

    if (mongoose.connection.readyState === 1) {
      admin = await Admin.findById(decoded.id).select('-password');
    } else {
      admin = memoryStore.admins.find(a => String(a._id) === String(decoded.id));
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'The admin user belonging to this token no longer exists.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

module.exports = { protectAdmin };
