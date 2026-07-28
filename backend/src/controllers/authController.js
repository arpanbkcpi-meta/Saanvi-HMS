const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { resetPasswordTemplate } = require('../utils/emailTemplates');
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Deliberately respond with the SAME message whether or not the email
    // exists — this prevents attackers from using this endpoint to check
    // which emails are registered in our system.
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate a random, unguessable token
    const rawToken = crypto.randomBytes(32).toString('hex');

    // Store only the HASHED version in the database — never the raw token
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes from now
    await user.save();

    // Build the link the user will click, containing the RAW token
    const resetUrl = `http://localhost:5173/reset-password/${rawToken}`;

    sendEmail({
      to: user.email,
      subject: 'Password Reset Request — Saanvi HMS',
      html: resetPasswordTemplate(user.name, resetUrl)
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the RAW token from the URL the same way we hashed it when saving —
    // so we can compare it against what's stored in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() } // $gt = "greater than" — must not be expired yet
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    user.password = password; // will be auto-hashed by the pre('save') hook on the User model
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
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

module.exports = { registerUser, loginUser, getMe , forgotPassword, resetPassword };
