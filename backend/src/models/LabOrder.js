const mongoose = require('mongoose');

const labOrderSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },     // who ordered it
  labTechId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },                      // who processed it (set later)
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTest', required: true },

  status: {
    type: String,
    enum: ['ordered', 'sample_collected', 'in_progress', 'completed', 'cancelled'],
    default: 'ordered'
  },

  // Structured result — filled in by the lab technician once processing is done
  resultValue: { type: String, default: '' },      // e.g. "6.2 x10^9/L"
  resultFlag: { type: String, enum: ['normal', 'abnormal', 'critical', ''], default: '' },
  technicianNotes: { type: String, default: '' },

  // Optional attached report file (PDF/image) — same pattern as before, now supplementary to structured data
  fileUrl: { type: String, default: '' },
  fileName: { type: String, default: '' },

  orderedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('LabOrder', labOrderSchema);