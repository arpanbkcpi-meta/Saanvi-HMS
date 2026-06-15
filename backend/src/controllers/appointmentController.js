const Appointment = require('../models/Appointment');

// @desc    Book an appointment (patient)
// @route   POST /api/appointments
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, reason } = req.body;

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      reason
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

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    console.error('Update appointment error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
};