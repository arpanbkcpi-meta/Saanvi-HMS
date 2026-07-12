const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');//The word require literally means: "Go and bring this file so i can use it".
const {appointmentBookedTemplate, appointmentStatusTemplate} = require('../utils/emailTemplates');//only two templates were required, so we destructured them from the module.exports object in emailTemplates.js
const Appointment = require('../models/Appointment');

// @desc    Book an appointment (patient)
// @route   POST /api/appointments
const bookAppointment = async (req, res) => {//This is the most important express concept , Frontend sends->Backend receives->Backend replies
  //async is one of the biggest concepts it says continue working 
  try {
    const { doctorId, date, reason } = req.body;

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      reason
    });

    // Send confirmation email- ferch doctor'sm name for the email content
    const doctor = await User.findById(doctorId);
    sendEmail({
      to:req.user.email,
      subject: 'Appointment Request Received-Saanvi HMS',
      html: appointmentBookedTemplate(req.user.name, doctor.name,date,reason)
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Book appointment error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments for logged in patient
// @route   GET /api/appointments/patient
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user._id
    }).populate('doctorId', 'name specialization');

    res.json(appointments);
  } catch (error) {
    console.error('Get patient appointments error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments for logged in doctor
// @route   GET /api/appointments/doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user._id
    }).populate('patientId', 'name age gender phone');

    res.json(appointments);
  } catch (error) {
    console.error('Get doctor appointments error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status (doctor)
// @route   PUT /api/appointments/:id/status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    ).populate('patientId', 'name email').populate('doctorId', 'name');

    // Send status update email to the patient
    sendEmail({
      to: appointment.patientId.email,
      subject: `Appointment ${status === 'approved' ? 'Approved ✅' : 'Rejected'} — Saanvi HMS`,
      html: appointmentStatusTemplate(
        appointment.patientId.name,
        appointment.doctorId.name,
        appointment.date,
        status
      )
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all the appointments for admin dashboard
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllAppointments,
  deleteAppointment
};