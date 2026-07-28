const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/appointments', require('./src/routes/appointmentRoutes'));
app.use('/api/prescriptions', require('./src/routes/prescriptionRoutes'));
app.use('/api/labs', require('./src/routes/labRoutes'));
app.use('/uploads', express.static('uploads'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/medical-histories', require('./src/routes/medicalHistoryRoutes'));
app.use('/api/doctor-schedule', require('./src/routes/doctorScheduleRoutes'));

// ✅ NEW ROUTES - Add them here (after existing routes)
app.use('/api/lab-tests', require('./src/routes/labTestRoutes'));
app.use('/api/lab-orders', require('./src/routes/labOrderRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Saanvi HMS Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});