const express = require('express');
const router = express.Router();
const { login, logout, getMe, changePassword } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectAdmin, getMe);
router.put('/change-password', protectAdmin, changePassword);

module.exports = router;
