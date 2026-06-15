const express = require('express');
const router = express.Router();
const { getDoctors, getPatients } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/doctors', protect, getDoctors);
router.get('/patients', protect, getPatients);

module.exports = router;