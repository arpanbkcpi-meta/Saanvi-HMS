const mongoose = require('mongoose'); // THIS IS LIKE importing the mongoose library, which is used for interacting with MongoDB databases in a Node.js environment. DEFINE the schema for a LabTest model using mongoose.Schema. This schema outlines the structure of the LabTest documents that will be stored in the MongoDB collection.

// This os the CATALOG of the tests the hospital offers - managed by Admin.
//Doctor pick FROM this list when ordering a test for a patient.

const labTestSchema = new mongoose.Schema({
    name: { type: String , required : true, trim: true}, // eg "Complete Blood Count (CBC)"
    category :{type: String, required: true, trim : true}, // e.g "Hematology ,Radiology , Biochemistry "
     price: { type: Number, required: true, default: 0 },
     normalRange: { type: String, default: '' },                 // e.g. "4.5–11.0 x10^9/L"
      description: { type: String, default: '' },
      isActive: { type: Boolean, default: true },                 // admin can "retire" a test without deleting history
}, { timestamps: true });

module.exports = mongoose.model('LabTest', labTestSchema); // Export the LabTest model so it can be used in other parts of the application.