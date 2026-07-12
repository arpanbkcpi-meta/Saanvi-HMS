const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { prescriptionTemplate } = require('../utils/emailTemplates');
const Prescription = require('../models/Prescription');

const createPrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, medicines, notes } = req.body;
    const prescription = await Prescription.create({
      appointmentId, doctorId: req.user._id, patientId, medicines, notes
    });

    // req.user IS the doctor (set by protect middleware) — fetch the patient for their email
    const patient = await User.findById(patientId);
    sendEmail({
      to: patient.email,
      subject: 'New Prescription — Saanvi HMS',
      html: prescriptionTemplate(patient.name, req.user.name, medicines)
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrescriptionsByPatient = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.user._id
    }).populate('doctorId', 'name specialization').populate('appointmentId');

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrescriptionsByDoctor = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      doctorId: req.user._id
    }).populate('patientId', 'name').populate('appointmentId');

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPrescription, getPrescriptionsByPatient, getPrescriptionsByDoctor };
