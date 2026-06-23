const User = require('../models/User');

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, experience, phone } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const doctor = await User.create({
      name, email, password, phone,
      role: 'doctor',
      specialization: specialization || '',
      experience: experience || 0
    });

    res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      role: doctor.role,
      specialization: doctor.specialization,
      experience: doctor.experience
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addPatient = async (req, res) => {
  try {
    const { name, email, password, age, gender, phone } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const patient = await User.create({
      name, email, password, phone,
      role: 'patient',
      age: age || 0,
      gender: gender || 'male'
    });

    res.status(201).json({
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      role: patient.role,
      age: patient.age,
      gender: patient.gender
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getPatients, deleteUser, addDoctor, addPatient };