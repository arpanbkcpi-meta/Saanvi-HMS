const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      specialization,
      experience,
      age,
      gender,
      phone
    } = req.body;

    // Only doctor and patient can register
    const allowedRoles = ['doctor', 'patient'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: 'Invalid role'
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      specialization,
      experience,
      age,
      gender,
      phone
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        experience: user.experience,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({
      message: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        specialization: user.specialization, experience: user.experience,
        age: user.age, gender: user.gender, phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('GetMe error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
