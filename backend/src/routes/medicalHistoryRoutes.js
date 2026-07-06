const express = require('express');
const router = express.Router();
const {
  createMedicalHistory,
  getMedicalHistories,
  getMedicalHistoryById,
  getMedicalHistoryByPatientId,
  updateMedicalHistory,
  deleteMedicalHistory
} = require('../controllers/medicalHistoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route configurations

// GET all histories (filtered inside controller by role)
// POST create history (restricted to Admin and Doctor)
router.route('/')
  .post(protect, authorize('admin', 'doctor'), createMedicalHistory)
  .get(protect, getMedicalHistories);

// GET / PUT / DELETE specific history by record ID
router.route('/:id')
  .get(protect, getMedicalHistoryById)
  .put(protect, authorize('admin', 'doctor'), updateMedicalHistory)
  .delete(protect, authorize('admin'), deleteMedicalHistory);

// GET patient history by Patient User ID
router.route('/patient/:patientId')
  .get(protect, getMedicalHistoryByPatientId);

module.exports = router;
