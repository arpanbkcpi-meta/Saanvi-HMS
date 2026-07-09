const DoctorSchedule = require('../models/DoctorSchedule');
const Appointment = require('../models/Appointment');

// ── Helper: convert "HH:MM" to total minutes from midnight ──────────────────
const toMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// ── Helper: convert total minutes back to "HH:MM" ───────────────────────────
const toTimeStr = (mins) => {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

// ── Helper: check if a slot overlaps with any break time ────────────────────
const isInBreak = (slotStart, slotEnd, breakTimes) => {
  return breakTimes.some(({ start, end }) => {
    const bStart = toMinutes(start);
    const bEnd   = toMinutes(end);
    return slotStart < bEnd && slotEnd > bStart;
  });
};

// ── Get day-of-week name from a date string "YYYY-MM-DD" ────────────────────
const getDayName = (dateStr) => {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const date = new Date(dateStr + 'T00:00:00'); // force local midnight parse
  return days[date.getDay()];
};

// POST /api/doctor-schedule — create or update (upsert) schedule
const setSchedule = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can set a schedule' });
    }
    const { workingDays, startTime, endTime, slotDurationMinutes, breakTimes } = req.body;

    const schedule = await DoctorSchedule.findOneAndUpdate(
      { doctorId: req.user._id },
      { workingDays, startTime, endTime, slotDurationMinutes, breakTimes },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/doctor-schedule/:doctorId — get schedule for a doctor
const getSchedule = async (req, res) => {
  try {
    const schedule = await DoctorSchedule.findOne({ doctorId: req.params.doctorId });
    if (!schedule) return res.status(404).json({ message: 'Schedule not set' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/doctor-schedule/:doctorId — update schedule (doctor only)
const updateSchedule = async (req, res) => {
  try {
    if (req.user.role !== 'doctor' || req.user._id.toString() !== req.params.doctorId) {
      return res.status(403).json({ message: 'Not authorized to update this schedule' });
    }
    const schedule = await DoctorSchedule.findOneAndUpdate(
      { doctorId: req.params.doctorId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/doctor-schedule/:doctorId/unavailable — mark dates unavailable
const markUnavailable = async (req, res) => {
  try {
    if (req.user.role !== 'doctor' || req.user._id.toString() !== req.params.doctorId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { dates } = req.body; // array of "YYYY-MM-DD" strings

    const schedule = await DoctorSchedule.findOneAndUpdate(
      { doctorId: req.params.doctorId },
      { $addToSet: { unavailableDates: { $each: dates } } },
      { new: true }
    );
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/doctor-schedule/:doctorId/unavailable — remove a date from unavailable list
const removeUnavailable = async (req, res) => {
  try {
    if (req.user.role !== 'doctor' || req.user._id.toString() !== req.params.doctorId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { date } = req.body; // single "YYYY-MM-DD" string

    const schedule = await DoctorSchedule.findOneAndUpdate(
      { doctorId: req.params.doctorId },
      { $pull: { unavailableDates: date } },
      { new: true }
    );
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/doctor-schedule/:doctorId/available-slots?date=YYYY-MM-DD
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; // "YYYY-MM-DD"

    if (!date) return res.status(400).json({ message: 'date query parameter required' });

    const schedule = await DoctorSchedule.findOne({ doctorId });
    if (!schedule) return res.json({ slots: [], message: 'Doctor has no schedule set' });

    // Check if date is unavailable
    if (schedule.unavailableDates.includes(date)) {
      return res.json({ slots: [], message: 'Doctor is unavailable on this date' });
    }

    // Check if date falls on a working day
    const dayName = getDayName(date);
    if (!schedule.workingDays.includes(dayName)) {
      return res.json({ slots: [], message: `Doctor does not work on ${dayName}` });
    }

    // Generate all possible slots
    const startMins  = toMinutes(schedule.startTime);
    const endMins    = toMinutes(schedule.endTime);
    const duration   = schedule.slotDurationMinutes;

    const allSlots = [];
    for (let t = startMins; t + duration <= endMins; t += duration) {
      const slotStart = t;
      const slotEnd   = t + duration;
      if (!isInBreak(slotStart, slotEnd, schedule.breakTimes)) {
        allSlots.push(toTimeStr(slotStart));
      }
    }

    // Fetch already-booked slots for this doctor on this date
    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay   = new Date(date + 'T23:59:59.999Z');

    const bookedAppointments = await Appointment.find({
      doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'rejected' },
      appointmentTime: { $exists: true, $ne: null },
    }).select('appointmentTime');

    const bookedTimes = new Set(bookedAppointments.map(a => a.appointmentTime));

    const availableSlots = allSlots.filter(slot => !bookedTimes.has(slot));

    res.json({ slots: availableSlots, date, dayName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  setSchedule,
  getSchedule,
  updateSchedule,
  markUnavailable,
  removeUnavailable,
  getAvailableSlots,
};
