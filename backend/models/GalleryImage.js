const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Image title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL or file path is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['building', 'classroom', 'event', 'activity', 'other'],
    default: 'building'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
