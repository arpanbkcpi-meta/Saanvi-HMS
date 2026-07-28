const express = require('express');
const router = express.Router();
const { protect, labTechOnly } = require('../middleware/authMiddleware');
const {
  createLabOrder, getDoctorLabOrders, getPatientLabOrders,
  getLabQueue, getMyCompletedOrders, updateLabOrderStatus, submitLabResults
} = require('../controllers/labOrderController');

router.post('/', protect, createLabOrder);                          // doctor orders a test
router.get('/doctor', protect, getDoctorLabOrders);
router.get('/patient', protect, getPatientLabOrders);
router.get('/queue', protect, labTechOnly, getLabQueue);
router.get('/my-completed', protect, labTechOnly, getMyCompletedOrders);
router.put('/:id/status', protect, labTechOnly, updateLabOrderStatus);
router.put('/:id/results', protect, labTechOnly, submitLabResults);

module.exports = router;