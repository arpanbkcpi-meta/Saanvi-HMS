const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getLabTests, getAllLabTestsAdmin, createLabTest, updateLabTest, deleteLabTest
} = require('../controllers/labTestController');

router.get('/', protect, getLabTests);                        // anyone logged in can see the active catalog
router.get('/admin', protect, adminOnly, getAllLabTestsAdmin);  // admin sees everything, including inactive
router.post('/', protect, adminOnly, createLabTest);
router.put('/:id', protect, adminOnly, updateLabTest);
router.delete('/:id', protect, adminOnly, deleteLabTest);

module.exports = router;