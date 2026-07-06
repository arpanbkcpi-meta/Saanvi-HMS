const MedicalHistory = require('../models/MedicalHistory');
const User = require('../models/User');

// @desc    Create medical history
// @route   POST /api/medical-histories
// @access  Private (Admin, Doctor)
const createMedicalHistory = async (req, res) => {
  try {
    const {
      patientId,
      bloodGroup,
      height,
      weight,
      allergies,
      chronicDiseases,
      currentMedications,
      previousSurgeries,
      familyHistory,
      smokingStatus,
      alcoholConsumption,
      vaccinationHistory,
      emergencyContact,
      emergencyPhone,
      insuranceProvider,
      notes
    } = req.body;

    // Validate required fields
    if (!patientId || !bloodGroup || height === undefined || weight === undefined || !emergencyContact || !emergencyPhone) {
      return res.status(400).json({ message: 'Please provide all required fields: patientId, bloodGroup, height, weight, emergencyContact, emergencyPhone' });
    }

    // Check if patient exists
    const patientExists = await User.findById(patientId);
    if (!patientExists) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if medical history already exists for this patient
    const existingHistory = await MedicalHistory.findOne({ patientId });
    if (existingHistory) {
      return res.status(400).json({ message: 'Medical history already exists for this patient' });
    }

    const medicalHistory = new MedicalHistory({
      patientId,
      bloodGroup,
      height,
      weight,
      allergies: allergies || [],
      chronicDiseases: chronicDiseases || [],
      currentMedications: currentMedications || [],
      previousSurgeries: previousSurgeries || [],
      familyHistory: familyHistory || '',
      smokingStatus: smokingStatus || 'Never',
      alcoholConsumption: alcoholConsumption || 'Never',
      vaccinationHistory: vaccinationHistory || '',
      emergencyContact,
      emergencyPhone,
      insuranceProvider: insuranceProvider || '',
      notes: notes || ''
    });

    await medicalHistory.save();

    res.status(201).json(medicalHistory);
  } catch (error) {
    console.error('Create medical history error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all medical histories or patient's own
// @route   GET /api/medical-histories
// @access  Private
const getMedicalHistories = async (req, res) => {
  try {
    // If the logged-in user is a patient, only return their own history
    if (req.user.role === 'patient') {
      const history = await MedicalHistory.findOne({ patientId: req.user._id })
        .populate('patientId', 'name email age gender phone');
      
      if (!history) {
        return res.status(404).json({ message: 'Medical history not found' });
      }
      return res.json([history]); // Return as array for consistency
    }

    // If admin or doctor, return all histories
    const histories = await MedicalHistory.find({})
      .populate('patientId', 'name email age gender phone');
    res.json(histories);
  } catch (error) {
    console.error('Get medical histories error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get medical history by ID
// @route   GET /api/medical-histories/:id
// @access  Private
const getMedicalHistoryById = async (req, res) => {
  try {
    const history = await MedicalHistory.findById(req.params.id)
      .populate('patientId', 'name email age gender phone');

    if (!history) {
      return res.status(404).json({ message: 'Medical history not found' });
    }

    // Patient can only view their own record
    if (req.user.role === 'patient' && history.patientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this record' });
    }

    res.json(history);
  } catch (error) {
    console.error('Get medical history by ID error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get medical history by Patient ID
// @route   GET /api/medical-histories/patient/:patientId
// @access  Private
const getMedicalHistoryByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Patient can only view their own record
    if (req.user.role === 'patient' && patientId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this record' });
    }

    const history = await MedicalHistory.findOne({ patientId })
      .populate('patientId', 'name email age gender phone');

    if (!history) {
      return res.status(404).json({ message: 'Medical history not found for this patient' });
    }

    res.json(history);
  } catch (error) {
    console.error('Get medical history by patient ID error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update medical history
// @route   PUT /api/medical-histories/:id
// @access  Private (Admin, Doctor)
const updateMedicalHistory = async (req, res) => {
  try {
    const history = await MedicalHistory.findById(req.params.id);

    if (!history) {
      return res.status(404).json({ message: 'Medical history not found' });
    }

    // Update fields
    const fieldsToUpdate = [
      'bloodGroup',
      'height',
      'weight',
      'allergies',
      'chronicDiseases',
      'currentMedications',
      'previousSurgeries',
      'familyHistory',
      'smokingStatus',
      'alcoholConsumption',
      'vaccinationHistory',
      'emergencyContact',
      'emergencyPhone',
      'insuranceProvider',
      'notes'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        history[field] = req.body[field];
      }
    });

    await history.save(); // BMI is calculated dynamically in pre-save hook

    const updatedHistory = await MedicalHistory.findById(history._id)
      .populate('patientId', 'name email age gender phone');

    res.json(updatedHistory);
  } catch (error) {
    console.error('Update medical history error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete medical history
// @route   DELETE /api/medical-histories/:id
// @access  Private (Admin only)
const deleteMedicalHistory = async (req, res) => {
  try {
    const history = await MedicalHistory.findById(req.params.id);

    if (!history) {
      return res.status(404).json({ message: 'Medical history not found' });
    }

    await history.deleteOne();
    res.json({ message: 'Medical history deleted successfully' });
  } catch (error) {
    console.error('Delete medical history error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMedicalHistory,
  getMedicalHistories,
  getMedicalHistoryById,
  getMedicalHistoryByPatientId,
  updateMedicalHistory,
  deleteMedicalHistory
};
