const User = require('../models/User');

// @desc    Get all doctors
// @route   GET /api/users/doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select(
      '-password'
    );
    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all patients
// @route   GET /api/users/patients
const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select(
      '-password'
    );
    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getPatients };
