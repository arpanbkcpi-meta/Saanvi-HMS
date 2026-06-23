const Prescription = require('../models/Prescription');

const createPrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, medicines, notes } = req.body;

    const prescription = await Prescription.create({
      appointmentId,
      doctorId: req.user._id,
      patientId,
      medicines,
      notes
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
