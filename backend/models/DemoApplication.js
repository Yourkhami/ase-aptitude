const mongoose = require('mongoose');

const demoApplicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    default: ''
  },
  courseInterested: {
    type: String,
    required: [true, 'Course selection is required'],
    trim: true
  },
  preferredTime: {
    type: String,
    default: 'Morning Batch (8:00 AM - 11:00 AM)'
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'admitted', 'rejected'],
    default: 'new'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DemoApplication', demoApplicationSchema);
