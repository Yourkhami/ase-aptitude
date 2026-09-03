const mongoose = require('mongoose');
const DemoApplication = require('../models/DemoApplication');
const memoryStore = require('../config/memoryStore');

const submitDemoApplication = async (req, res, next) => {
  try {
    const { fullName, phone, email, courseInterested, preferredTime, message } = req.body;

    if (!fullName || !phone || !courseInterested) {
      return res.status(400).json({
        success: false,
        message: 'Full Name, Phone Number, and Course Interested In are required.'
      });
    }

    const phoneClean = String(phone).replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.'
      });
    }

    let application = null;
    const docData = {
      fullName: fullName.trim(),
      phone: phoneClean,
      email: email ? email.trim().toLowerCase() : '',
      courseInterested: courseInterested.trim(),
      preferredTime: preferredTime || 'Morning Batch (8:00 AM - 11:00 AM)',
      message: message ? message.trim() : '',
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      application = await DemoApplication.create(docData);
    } else {
      docData._id = 'demo_' + Date.now();
      memoryStore.demoApplications.unshift(docData);
      application = docData;
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your Free Demo Class request has been submitted successfully. We will contact you soon.',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

const getDemoApplications = async (req, res, next) => {
  try {
    const { status, course, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (status && status !== 'all') filter.status = status;
      if (course && course !== 'all') filter.courseInterested = new RegExp(course, 'i');
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [{ fullName: searchRegex }, { phone: searchRegex }, { email: searchRegex }];
      }

      const applications = await DemoApplication.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        total: applications.length,
        data: applications
      });
    }

    let list = [...memoryStore.demoApplications];
    if (status && status !== 'all') list = list.filter(a => a.status === status);
    if (course && course !== 'all') list = list.filter(a => a.courseInterested.toLowerCase().includes(course.toLowerCase()));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a => (a.fullName || '').toLowerCase().includes(q) || (a.phone || '').includes(q) || (a.email || '').toLowerCase().includes(q));
    }

    res.status(200).json({
      success: true,
      total: list.length,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

const getDemoApplicationById = async (req, res, next) => {
  try {
    let app = null;
    if (mongoose.connection.readyState === 1) {
      app = await DemoApplication.findById(req.params.id);
    } else {
      app = memoryStore.demoApplications.find(a => String(a._id) === String(req.params.id));
    }

    if (!app) {
      return res.status(404).json({ success: false, message: 'Demo application not found' });
    }
    res.status(200).json({ success: true, data: app });
  } catch (error) {
    next(error);
  }
};

const updateDemoApplication = async (req, res, next) => {
  try {
    const { status, message } = req.body;

    if (mongoose.connection.readyState === 1) {
      const application = await DemoApplication.findById(req.params.id);
      if (!application) return res.status(404).json({ success: false, message: 'Demo application not found' });
      if (status) application.status = status;
      if (message !== undefined) application.message = message;
      await application.save();
      return res.status(200).json({ success: true, message: 'Application updated successfully', data: application });
    }

    const item = memoryStore.demoApplications.find(a => String(a._id) === String(req.params.id));
    if (!item) return res.status(404).json({ success: false, message: 'Demo application not found' });
    if (status) item.status = status;
    if (message !== undefined) item.message = message;
    item.updatedAt = new Date();

    res.status(200).json({ success: true, message: 'Application updated successfully', data: item });
  } catch (error) {
    next(error);
  }
};

const deleteDemoApplication = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const app = await DemoApplication.findByIdAndDelete(req.params.id);
      if (!app) return res.status(404).json({ success: false, message: 'Demo application not found' });
      return res.status(200).json({ success: true, message: 'Demo application deleted successfully' });
    }

    const idx = memoryStore.demoApplications.findIndex(a => String(a._id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ success: false, message: 'Demo application not found' });
    memoryStore.demoApplications.splice(idx, 1);

    res.status(200).json({ success: true, message: 'Demo application deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitDemoApplication,
  getDemoApplications,
  getDemoApplicationById,
  updateDemoApplication,
  deleteDemoApplication
};
