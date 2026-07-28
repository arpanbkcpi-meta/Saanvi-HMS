const express = require('express');
const router = express.Router();
const { 
  getDoctors, 
  getPatients, 
  deleteUser, 
  addDoctor, 
  addPatient,
  addLabTech,      // ✅ ADD THIS
  getLabTechs      // ✅ ADD THIS
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware'); // ✅ ADD adminOnly

// Existing routes
router.get('/doctors', protect, getDoctors);
router.get('/patients', protect, getPatients);
router.post('/doctor', protect, addDoctor);
router.post('/patient', protect, addPatient);
router.delete('/:id', protect, deleteUser);

// ✅ NEW LAB TECHNICIAN ROUTES
router.post('/labtech', protect, adminOnly, addLabTech);
router.get('/labtechs', protect, adminOnly, getLabTechs);

module.exports = router;