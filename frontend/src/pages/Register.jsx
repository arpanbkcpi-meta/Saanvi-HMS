import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import AuthCard from '../components/AuthCard';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    specialization: '',
    experience: '',
    age: '',
    gender: 'male',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/auth/register', formData);
      login(data);
      if (data.role === 'doctor') navigate('/doctor-dashboard');
      else if (data.role === 'patient') navigate('/patient-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Register">
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <InputField
          label="Full Name"
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="Minimum 6 characters"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <InputField
          label="Phone"
          type="text"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
        />

        {/* Role Selection */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Role</label>
          <select
            name="role"
            className="form-select"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            
          </select>
        </div>

        {/* Doctor specific fields */}
        {formData.role === 'doctor' && (
          <>
            <InputField
              label="Specialization"
              type="text"
              name="specialization"
              placeholder="e.g. Cardiologist, Dentist"
              value={formData.specialization}
              onChange={handleChange}
            />
            <InputField
              label="Years of Experience"
              type="number"
              name="experience"
              placeholder="Enter years of experience"
              value={formData.experience}
              onChange={handleChange}
            />
          </>
        )}

        {/* Patient specific fields */}
        {formData.role === 'patient' && (
          <>
            <InputField
              label="Age"
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
            />
            <div className="mb-3">
              <label className="form-label fw-semibold">Gender</label>
              <select
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        )}

        <Button
          text="Register"
          type="submit"
          loading={loading}
        />
      </form>
      <p className="text-center mt-3 mb-0">
        Already have an account?{' '}
        <Link to="/login">Login here</Link>
      </p>
    </AuthCard>
  );
};

export default Register;