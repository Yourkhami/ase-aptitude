const mongoose = require('mongoose');
const Review = require('../models/Review');
const memoryStore = require('../config/memoryStore');

const getActiveReviews = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const reviews = await Review.find({ isActive: true }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: reviews.length, data: reviews });
    }

    const active = memoryStore.reviews.filter(r => r.isActive);
    res.status(200).json({ success: true, count: active.length, data: active });
  } catch (error) {
    next(error);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const reviews = await Review.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: reviews.length, data: reviews });
    }

    res.status(200).json({ success: true, count: memoryStore.reviews.length, data: memoryStore.reviews });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { studentName, reviewText, rating, role, isActive } = req.body;

    if (!studentName || !reviewText) {
      return res.status(400).json({ success: false, message: 'Student name and review text are required.' });
    }

    const doc = {
      studentName: studentName.trim(),
      reviewText: reviewText.trim(),
      rating: rating ? Number(rating) : 5,
      role: role ? role.trim() : 'Student',
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let review = null;
    if (mongoose.connection.readyState === 1) {
      review = await Review.create(doc);
    } else {
      doc._id = 'review_' + Date.now();
      memoryStore.reviews.unshift(doc);
      review = doc;
    }

    res.status(201).json({ success: true, message: 'Review created successfully', data: review });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
      return res.status(200).json({ success: true, message: 'Review updated successfully', data: review });
    }

    const idx = memoryStore.reviews.findIndex(r => String(r._id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ success: false, message: 'Review not found' });

    memoryStore.reviews[idx] = { ...memoryStore.reviews[idx], ...req.body, updatedAt: new Date() };
    res.status(200).json({ success: true, message: 'Review updated successfully', data: memoryStore.reviews[idx] });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const review = await Review.findByIdAndDelete(req.params.id);
      if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
      return res.status(200).json({ success: true, message: 'Review deleted successfully' });
    }

    const idx = memoryStore.reviews.findIndex(r => String(r._id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ success: false, message: 'Review not found' });
    memoryStore.reviews.splice(idx, 1);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActiveReviews, getAllReviews, createReview, updateReview, deleteReview };
