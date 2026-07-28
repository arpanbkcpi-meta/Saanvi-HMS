const LabTest = require('../models/LabTest');

// Anyone logged in can VIEW the catalog (doctors need it to order tests)
const getLabTests = async (req, res) => {
  try {
    const tests = await LabTest.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin-only: full catalog including inactive tests
const getAllLabTestsAdmin = async (req, res) => {
  try {
    const tests = await LabTest.find({}).sort({ category: 1, name: 1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLabTest = async (req, res) => {
  try {
    const { name, category, price, normalRange, description } = req.body;
    const test = await LabTest.create({ name, category, price, normalRange, description });
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLabTest = async (req, res) => {
  try {
    const test = await LabTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// "Delete" actually just deactivates — see the model comment on isActive
const deleteLabTest = async (req, res) => {
  try {
    await LabTest.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Lab test removed from catalog' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLabTests, getAllLabTestsAdmin, createLabTest, updateLabTest, deleteLabTest };