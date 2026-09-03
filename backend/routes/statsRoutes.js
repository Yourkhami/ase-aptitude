const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', protectAdmin, getDashboardStats);

module.exports = router;
