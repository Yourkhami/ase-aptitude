const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  subject: {
    type: String,
    trim: true,
    default: 'Course / General Enquiry'
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'archived'],
    default: 'new'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
