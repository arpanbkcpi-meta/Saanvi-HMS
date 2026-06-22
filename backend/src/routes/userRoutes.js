const express = require('express');
const router = express.Router();
const { getDoctors, getPatients, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/doctors', protect, getDoctors);
router.get('/patients', protect, getPatients);
router.delete('/:id', protect, deleteUser);

module.exports = router;