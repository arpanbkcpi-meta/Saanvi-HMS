const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bloodGroup: {
    type: String,
    required: true,
    trim: true
  },
  height: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  bmi: {
    type: Number
  },
  allergies: {
    type: [String],
    default: []
  },
  chronicDiseases: {
    type: [String],
    default: []
  },
  currentMedications: {
    type: [String],
    default: []
  },
  previousSurgeries: {
    type: [String],
    default: []
  },
  familyHistory: {
    type: String,
    default: ''
  },
  smokingStatus: {
    type: String,
    enum: ['Never', 'Former', 'Current', 'Occasional', 'Active'],
    default: 'Never'
  },
  alcoholConsumption: {
    type: String,
    enum: ['Never', 'Socially', 'Regularly', 'Heavy'],
    default: 'Never'
  },
  vaccinationHistory: {
    type: String,
    default: ''
  },
  emergencyContact: {
    type: String,
    required: true,
    trim: true
  },
  emergencyPhone: {
    type: String,
    required: true,
    trim: true
  },
  insuranceProvider: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Automatically calculate BMI before saving when height or weight changes
medicalHistorySchema.pre('save', function(next) {
  if (this.isModified('height') || this.isModified('weight')) {
    if (this.height && this.weight && this.height > 0) {
      // If height is entered in cm (greater than 3), convert it to meters
      const heightInMeters = this.height > 3 ? this.height / 100 : this.height;
      this.bmi = parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(2));
    } else {
      this.bmi = 0;
    }
  }
  next();
});

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
