const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor
} = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPrescription);
router.get('/patient', protect, getPrescriptionsByPatient);
router.get('/doctor', protect, getPrescriptionsByDoctor);

module.exports = router;
