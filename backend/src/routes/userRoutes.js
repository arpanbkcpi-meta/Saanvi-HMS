const express = require('express');
const router = express.Router();
const { getDoctors, getPatients, deleteUser, addDoctor, addPatient } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/doctors', protect, getDoctors);
router.get('/patients', protect, getPatients);
router.post('/doctor', protect, addDoctor);
router.post('/patient', protect, addPatient);
router.delete('/:id', protect, deleteUser);

module.exports = router;