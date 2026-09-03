const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContactMessages,
  getContactMessageById,
  updateContactStatus,
  deleteContactMessage
} = require('../controllers/contactController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/', protectAdmin, getContactMessages);
router.get('/:id', protectAdmin, getContactMessageById);
router.put('/:id', protectAdmin, updateContactStatus);
router.delete('/:id', protectAdmin, deleteContactMessage);

module.exports = router;
