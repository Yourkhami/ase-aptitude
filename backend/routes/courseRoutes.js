const express = require('express');
const router = express.Router();
const {
  getActiveCourses,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getActiveCourses);
router.get('/all', protectAdmin, getAllCourses);
router.post('/', protectAdmin, createCourse);
router.put('/:id', protectAdmin, updateCourse);
router.delete('/:id', protectAdmin, deleteCourse);

module.exports = router;
