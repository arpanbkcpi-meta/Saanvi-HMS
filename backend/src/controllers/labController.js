const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { labReportTemplate } = require('../utils/emailTemplates');
const Lab = require('../models/Lab');

const uploadLabReport = async (req, res) => {
  try {
    const { appointmentId, patientId, testName, notes } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }
    const lab = await Lab.create({
      appointmentId, doctorId: req.user._id, patientId, testName,
      fileUrl: `http://localhost:3001/uploads/${req.file.filename}`,
      fileName: req.file.originalname, notes
    });

    const patient = await User.findById(patientId);
    sendEmail({
      to: patient.email,
      subject: 'New Lab Report Available — Saanvi HMS',
      html: labReportTemplate(patient.name, req.user.name, testName)
    });

    res.status(201).json(lab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLabsByPatient = async (req, res) => {
  try {
    const labs = await Lab.find({
      patientId: req.user._id
    }).populate('doctorId', 'name specialization').populate('appointmentId');

    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLabsByDoctor = async (req, res) => {
  try {
    const labs = await Lab.find({
      doctorId: req.user._id
    }).populate('patientId', 'name').populate('appointmentId');

    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadLabReport, getLabsByPatient, getLabsByDoctor };