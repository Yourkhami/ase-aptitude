const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
    default: 5
  },
  role: {
    type: String,
    default: 'Student'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
