const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllAppointments,
  deleteAppointment
} = require('../controllers/appointmentController');

router.get('/', protect, adminOnly, getAllAppointments);
router.post('/', protect, bookAppointment);
router.get('/patient', protect, getPatientAppointments);
router.get('/doctor', protect, getDoctorAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;