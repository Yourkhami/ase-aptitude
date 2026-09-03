const mongoose = require('mongoose');
const DemoApplication = require('../models/DemoApplication');
const ContactMessage = require('../models/ContactMessage');
const Course = require('../models/Course');
const Review = require('../models/Review');
const GalleryImage = require('../models/GalleryImage');
const memoryStore = require('../config/memoryStore');

const getDashboardStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const [
        totalDemoApplications,
        newDemoApplications,
        totalContactMessages,
        newContactMessages,
        activeCourses,
        activeReviews,
        totalGalleryImages,
        recentApplications,
        recentMessages
      ] = await Promise.all([
        DemoApplication.countDocuments(),
        DemoApplication.countDocuments({ status: 'new' }),
        ContactMessage.countDocuments(),
        ContactMessage.countDocuments({ status: 'new' }),
        Course.countDocuments({ isActive: true }),
        Review.countDocuments({ isActive: true }),
        GalleryImage.countDocuments({ isActive: true }),
        DemoApplication.find().sort({ createdAt: -1 }).limit(5),
        ContactMessage.find().sort({ createdAt: -1 }).limit(5)
      ]);

      return res.status(200).json({
        success: true,
        data: {
          totalDemoApplications,
          newDemoApplications,
          totalContactMessages,
          newContactMessages,
          activeCourses,
          activeReviews,
          totalGalleryImages,
          recentApplications,
          recentMessages
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalDemoApplications: memoryStore.demoApplications.length,
        newDemoApplications: memoryStore.demoApplications.filter(a => a.status === 'new').length,
        totalContactMessages: memoryStore.contactMessages.length,
        newContactMessages: memoryStore.contactMessages.filter(m => m.status === 'new').length,
        activeCourses: memoryStore.courses.filter(c => c.isActive).length,
        activeReviews: memoryStore.reviews.filter(r => r.isActive).length,
        totalGalleryImages: memoryStore.gallery.filter(g => g.isActive).length,
        recentApplications: memoryStore.demoApplications.slice(0, 5),
        recentMessages: memoryStore.contactMessages.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
