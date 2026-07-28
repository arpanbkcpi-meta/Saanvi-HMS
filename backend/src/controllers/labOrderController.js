const LabOrder = require('../models/LabOrder');
const sendEmail = require('../utils/sendEmail');

// ── DOCTOR: order a test for a patient ──────────────────────────
const createLabOrder = async (req, res) => {
  try {
    const { patientId, appointmentId, testId } = req.body;
    const order = await LabOrder.create({
      patientId, appointmentId, testId,
      doctorId: req.user._id, // the logged-in doctor, from `protect` middleware
      status: 'ordered'
    });
    const populated = await order.populate([
      { path: 'testId', select: 'name category price' },
      { path: 'patientId', select: 'name email' }
    ]);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DOCTOR: view all tests they've ordered ──────────────────────
const getDoctorLabOrders = async (req, res) => {
  try {
    const orders = await LabOrder.find({ doctorId: req.user._id })
      .populate('testId', 'name category price normalRange')
      .populate('patientId', 'name email')
      .populate('labTechId', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PATIENT: view their own lab orders/results ──────────────────
const getPatientLabOrders = async (req, res) => {
  try {
    const orders = await LabOrder.find({ patientId: req.user._id })
      .populate('testId', 'name category normalRange')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── LAB TECHNICIAN: view all pending/assigned work (queue) ──────
const getLabQueue = async (req, res) => {
  try {
    // Show everything not yet completed — this IS the technician's worklist
    const orders = await LabOrder.find({ status: { $ne: 'completed' }, status: { $ne: 'cancelled' } })
      .populate('testId', 'name category normalRange')
      .populate('patientId', 'name age gender')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: 1 }); // oldest first — first-in-first-out queue
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── LAB TECHNICIAN: view everything they've personally completed ──
const getMyCompletedOrders = async (req, res) => {
  try {
    const orders = await LabOrder.find({ labTechId: req.user._id, status: 'completed' })
      .populate('testId', 'name category')
      .populate('patientId', 'name')
      .sort({ completedAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── LAB TECHNICIAN: move status forward (ordered → sample_collected → in_progress) ──
const updateLabOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await LabOrder.findByIdAndUpdate(
      req.params.id,
      { status, labTechId: req.user._id }, // claim this order as theirs the moment they touch it
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── LAB TECHNICIAN: submit final structured results ─────────────
const submitLabResults = async (req, res) => {
  try {
    const { resultValue, resultFlag, technicianNotes, fileUrl, fileName } = req.body;

    const order = await LabOrder.findByIdAndUpdate(
      req.params.id,
      {
        resultValue, resultFlag, technicianNotes, fileUrl, fileName,
        status: 'completed',
        labTechId: req.user._id,
        completedAt: Date.now()
      },
      { new: true }
    ).populate('patientId', 'name email').populate('testId', 'name');

    // Notify the patient their results are ready
    sendEmail({
      to: order.patientId.email,
      subject: `Lab Results Ready — ${order.testId.name} — Saanvi HMS`,
      html: `<p>Hi ${order.patientId.name},</p><p>Your results for <strong>${order.testId.name}</strong> are now available on your patient dashboard.</p>`
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLabOrder, getDoctorLabOrders, getPatientLabOrders,
  getLabQueue, getMyCompletedOrders, updateLabOrderStatus, submitLabResults
};