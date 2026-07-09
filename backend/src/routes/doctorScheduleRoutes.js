const express = require('express');
const router = express.Router();
const {
  setSchedule,
  getSchedule,
  updateSchedule,
  markUnavailable,
  removeUnavailable,
  getAvailableSlots,
} = require('../controllers/doctorScheduleController');
const { protect } = require('../middleware/authMiddleware');

// Create or upsert schedule (doctor only)
router.post('/', protect, setSchedule);

// Get a doctor's schedule (any authenticated user)
router.get('/:doctorId', protect, getSchedule);

// Update schedule (doctor only)
router.put('/:doctorId', protect, updateSchedule);

// Mark dates unavailable (doctor only)
router.post('/:doctorId/unavailable', protect, markUnavailable);

// Remove a date from unavailable list (doctor only)
router.delete('/:doctorId/unavailable', protect, removeUnavailable);

// Get available time slots for a specific date
router.get('/:doctorId/available-slots', protect, getAvailableSlots);

module.exports = router;
