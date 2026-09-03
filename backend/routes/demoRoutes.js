const express = require('express');
const router = express.Router();
const {
  submitDemoApplication,
  getDemoApplications,
  getDemoApplicationById,
  updateDemoApplication,
  deleteDemoApplication
} = require('../controllers/demoController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/', submitDemoApplication);
router.get('/', protectAdmin, getDemoApplications);
router.get('/:id', protectAdmin, getDemoApplicationById);
router.put('/:id', protectAdmin, updateDemoApplication);
router.delete('/:id', protectAdmin, deleteDemoApplication);

module.exports = router;
