const express = require('express');
const router = express.Router();
const {
  getActiveReviews,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getActiveReviews);
router.get('/all', protectAdmin, getAllReviews);
router.post('/', protectAdmin, createReview);
router.put('/:id', protectAdmin, updateReview);
router.delete('/:id', protectAdmin, deleteReview);

module.exports = router;
