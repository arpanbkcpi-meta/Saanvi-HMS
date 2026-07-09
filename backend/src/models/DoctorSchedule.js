const mongoose = require('mongoose');

const breakTimeSchema = new mongoose.Schema({
  start: { type: String, required: true }, // "12:00"
  end:   { type: String, required: true }, // "13:00"
}, { _id: false });

const doctorScheduleSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  workingDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  startTime: {
    type: String,
    default: '09:00', // HH:MM 24-hour
  },
  endTime: {
    type: String,
    default: '17:00',
  },
  slotDurationMinutes: {
    type: Number,
    default: 30,
    enum: [15, 30, 45, 60],
  },
  breakTimes: {
    type: [breakTimeSchema],
    default: [],
  },
  // Dates stored as ISO date strings "YYYY-MM-DD" for easy comparison
  unavailableDates: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('DoctorSchedule', doctorScheduleSchema);
