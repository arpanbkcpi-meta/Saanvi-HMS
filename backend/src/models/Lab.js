const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Lab', labSchema);
