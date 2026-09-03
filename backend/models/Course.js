const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  icon: {
    type: String,
    default: 'fa-graduation-cap'
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true
  },
  courseDetails: [{
    type: String,
    trim: true
  }],
  theme: {
    type: String,
    enum: ['theme-blue', 'theme-orange', 'theme-teal', 'theme-purple'],
    default: 'theme-blue'
  },
  duration: {
    type: String,
    default: '3 to 6 Months'
  },
  fee: {
    type: String,
    default: 'Affordable'
  },
  badge: {
    type: String,
    default: 'Active Course'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-generate slug if not provided
courseSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
