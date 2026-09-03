const express = require('express');
const router = express.Router();
const {
  getActiveGallery,
  getAllGallery,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} = require('../controllers/galleryController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getActiveGallery);
router.get('/all', protectAdmin, getAllGallery);
router.post('/', protectAdmin, upload.single('image'), uploadGalleryImage);
router.put('/:id', protectAdmin, upload.single('image'), updateGalleryImage);
router.delete('/:id', protectAdmin, deleteGalleryImage);

module.exports = router;
