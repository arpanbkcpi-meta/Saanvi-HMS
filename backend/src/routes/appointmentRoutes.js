const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, bookAppointment);
router.get('/patient', protect, getPatientAppointments);
router.get('/doctor', protect, getDoctorAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;