const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const memoryStore = require('../config/memoryStore');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'ase_aptitude_super_secret_jwt_key_2026_secure_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    let admin = null;

    if (mongoose.connection.readyState === 1) {
      admin = await Admin.findOne({ email: cleanEmail });
    } else {
      admin = memoryStore.admins.find(a => a.email.toLowerCase() === cleanEmail);
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No admin account found with this email.'
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    const token = generateToken(admin._id, admin.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const admin = req.admin;
    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    let admin = null;
    if (mongoose.connection.readyState === 1) {
      admin = await Admin.findById(req.admin._id);
    } else {
      admin = memoryStore.admins.find(a => String(a._id) === String(req.admin._id));
    }

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password.'
      });
    }

    if (mongoose.connection.readyState === 1) {
      admin.password = newPassword;
      await admin.save();
    } else {
      admin.password = await bcrypt.hash(newPassword, 10);
    }

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, logout, getMe, changePassword };
