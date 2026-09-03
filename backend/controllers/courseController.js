const mongoose = require('mongoose');
const Course = require('../models/Course');
const memoryStore = require('../config/memoryStore');

const getActiveCourses = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const courses = await Course.find({ isActive: true }).sort({ createdAt: 1 });
      return res.status(200).json({ success: true, count: courses.length, data: courses });
    }

    const active = memoryStore.courses.filter(c => c.isActive);
    res.status(200).json({ success: true, count: active.length, data: active });
  } catch (error) {
    next(error);
  }
};

const getAllCourses = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const courses = await Course.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: courses.length, data: courses });
    }

    res.status(200).json({ success: true, count: memoryStore.courses.length, data: memoryStore.courses });
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { title, slug, icon, shortDescription, courseDetails, theme, duration, fee, badge, isActive } = req.body;

    if (!title || !shortDescription) {
      return res.status(400).json({ success: false, message: 'Course title and short description are required.' });
    }

    const doc = {
      title: title.trim(),
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      icon: icon || 'fa-graduation-cap',
      shortDescription: shortDescription.trim(),
      courseDetails: Array.isArray(courseDetails) ? courseDetails : (courseDetails ? courseDetails.split(',').map(s => s.trim()) : []),
      theme: theme || 'theme-blue',
      duration: duration || '3 to 6 Months',
      fee: fee || 'Affordable',
      badge: badge || 'Active Course',
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let course = null;
    if (mongoose.connection.readyState === 1) {
      course = await Course.create(doc);
    } else {
      doc._id = 'course_' + Date.now();
      memoryStore.courses.push(doc);
      course = doc;
    }

    res.status(201).json({ success: true, message: 'Course created successfully', data: course });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    if (req.body.courseDetails && typeof req.body.courseDetails === 'string') {
      req.body.courseDetails = req.body.courseDetails.split(',').map(s => s.trim());
    }

    if (mongoose.connection.readyState === 1) {
      const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
      return res.status(200).json({ success: true, message: 'Course updated successfully', data: course });
    }

    const idx = memoryStore.courses.findIndex(c => String(c._id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ success: false, message: 'Course not found' });

    memoryStore.courses[idx] = { ...memoryStore.courses[idx], ...req.body, updatedAt: new Date() };
    res.status(200).json({ success: true, message: 'Course updated successfully', data: memoryStore.courses[idx] });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
      return res.status(200).json({ success: true, message: 'Course deleted successfully' });
    }

    const idx = memoryStore.courses.findIndex(c => String(c._id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ success: false, message: 'Course not found' });
    memoryStore.courses.splice(idx, 1);
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActiveCourses, getAllCourses, createCourse, updateCourse, deleteCourse };
