const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  uploadLabReport,
  getLabsByPatient,
  getLabsByDoctor
} = require('../controllers/labController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', protect, upload.single('file'), uploadLabReport);
router.get('/patient', protect, getLabsByPatient);
router.get('/doctor', protect, getLabsByDoctor);

module.exports = router;
