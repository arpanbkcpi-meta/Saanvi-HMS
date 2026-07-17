import { toast } from 'react-toastify';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'patient',
    specialization: '', experience: '', age: '', gender: 'male', phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/auth/register', formData);
      login(data);
      toast.success(`Welcome, ${data.name}! Your account is ready.`);
      if (data.role === 'doctor') navigate('/doctor-dashboard');
      else if (data.role === 'patient') navigate('/patient-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: '#0f172a',
    },
    leftPanel: {
      flex: 1,
      background: 'linear-gradient(135deg, #1a2e1a 0%, #0f172a 50%, #1a2a3a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 48px',
      position: 'relative',
      overflow: 'hidden',
    },
    rightPanel: {
      width: '520px',
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
      overflowY: 'auto',
    },
    logoBox: {
      width: '72px', height: '72px',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      borderRadius: '20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '32px',
      boxShadow: '0 8px 32px rgba(16,185,129,0.4)',
      marginBottom: '24px',
      animation: 'float 3s ease-in-out infinite',
    },
    brandTitle: {
      color: 'white',
      fontSize: '36px', fontWeight: 800,
      letterSpacing: '-0.5px',
      marginBottom: '8px', textAlign: 'center',
    },
    brandSub: {
      color: '#94a3b8',
      fontSize: '15px',
      textAlign: 'center',
      marginBottom: '48px',
      lineHeight: 1.6,
    },
    stepItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      marginBottom: '20px',
    },
    stepNum: {
      width: '32px', height: '32px',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '13px', fontWeight: 700, color: 'white',
      flexShrink: 0,
    },
    formTitle: {
      fontSize: '26px', fontWeight: 800,
      color: '#0f172a', marginBottom: '6px', textAlign: 'center',
    },
    formSubtitle: {
      color: '#64748b', fontSize: '14px',
      textAlign: 'center', marginBottom: '28px',
    },
    label: {
      display: 'block',
      fontSize: '13px', fontWeight: 600,
      color: '#374151', marginBottom: '7px',
    },
    inputWrapper: { position: 'relative' },
    input: {
      width: '100%',
      padding: '12px 16px 12px 42px',
      borderRadius: '11px',
      border: '1.5px solid #e2e8f0',
      fontSize: '14px', outline: 'none',
      background: '#f8fafc', color: '#0f172a',
      transition: 'all 0.2s', boxSizing: 'border-box',
    },
    inputNoIcon: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '11px',
      border: '1.5px solid #e2e8f0',
      fontSize: '14px', outline: 'none',
      background: '#f8fafc', color: '#0f172a',
      transition: 'all 0.2s', boxSizing: 'border-box',
    },
    inputIcon: {
      position: 'absolute', left: '13px',
      top: '50%', transform: 'translateY(-50%)',
      fontSize: '15px', color: '#94a3b8', pointerEvents: 'none',
    },
    eyeBtn: {
      position: 'absolute', right: '13px',
      top: '50%', transform: 'translateY(-50%)',
      background: 'none', border: 'none',
      cursor: 'pointer', fontSize: '15px', color: '#94a3b8', padding: 0,
    },
    errorBox: {
      background: '#fef2f2', border: '1px solid #fecaca',
      color: '#dc2626', padding: '12px 16px', borderRadius: '10px',
      fontSize: '13px', marginBottom: '18px',
      display: 'flex', alignItems: 'center', gap: '8px',
    },
    submitBtn: (disabled) => ({
      width: '100%', padding: '14px',
      background: disabled ? '#a7f3d0' : 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white', border: 'none', borderRadius: '12px',
      fontSize: '15px', fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
      marginTop: '6px', transition: 'all 0.2s',
    }),
  };

  const steps = [
    { num: '1', text: 'Choose your role (Patient or Doctor)' },
    { num: '2', text: 'Fill in your personal details' },
    { num: '3', text: 'Start using Saanvi HMS instantly' },
  ];

  const roleCards = [
    { role: 'patient', icon: '🧑‍⚕️', label: 'Patient', desc: 'Book appointments & track health' },
    { role: 'doctor', icon: '👨‍⚕️', label: 'Doctor', desc: 'Manage patients & schedule' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .reg-input:focus {
          border-color: #10b981 !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
        }
        .reg-select:focus {
          border-color: #10b981 !important;
          background: #fff !important;
          outline: none;
        }
        .reg-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16,185,129,0.45) !important;
        }
        .left-blob-green {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
      `}</style>
      <div style={s.page}>

        {/* Left Panel */}
        <div style={s.leftPanel}>
          <div className="left-blob-green" style={{ width: '400px', height: '400px', top: '-100px', left: '-100px' }} />
          <div className="left-blob-green" style={{ width: '300px', height: '300px', bottom: '-80px', right: '-80px' }} />

          <div style={s.logoBox}>🏥</div>
          <h1 style={s.brandTitle}>Join Saanvi HMS</h1>
          <p style={s.brandSub}>
            Create your account in minutes.<br />
            Healthcare made simple & digital.
          </p>

          <div style={{ width: '100%', maxWidth: '360px' }}>
            {steps.map((step) => (
              <div key={step.num} style={s.stepItem}>
                <div style={s.stepNum}>{step.num}</div>
                <div style={{ color: '#cbd5e1', fontSize: '14px', paddingTop: '6px' }}>{step.text}</div>
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', bottom: '32px', color: '#475569', fontSize: '12px', letterSpacing: '0.5px' }}>
            © 2026 Saanvi HMS · Built with ❤️ by Arpan
          </div>
        </div>

        {/* Right Panel */}
        <div style={s.rightPanel}>
          <div style={{ width: '100%', maxWidth: '420px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'inline-block', background: '#f0fdf4', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, color: '#10b981', marginBottom: '16px', letterSpacing: '0.5px' }}>
                GET STARTED FREE
              </div>
            </div>
            <h2 style={s.formTitle}>Create your account</h2>
            <p style={s.formSubtitle}>Join thousands of healthcare professionals</p>

            {error && (
              <div style={s.errorBox}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>

              {/* Role Toggle */}
              <div style={{ marginBottom: '22px' }}>
                <label style={s.label}>I am a</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {roleCards.map(({ role, icon, label, desc }) => {
                    const isActive = formData.role === role;
                    return (
                      <div
                        key={role}
                        onClick={() => handleRoleSelect(role)}
                        style={{
                          border: `2px solid ${isActive ? '#10b981' : '#e2e8f0'}`,
                          borderRadius: '12px',
                          padding: '14px 12px',
                          cursor: 'pointer',
                          background: isActive ? '#f0fdf4' : '#f8fafc',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          boxShadow: isActive ? '0 2px 12px rgba(16,185,129,0.2)' : 'none',
                        }}
                      >
                        <div style={{ fontSize: '24px', marginBottom: '4px' }}>{icon}</div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: isActive ? '#059669' : '#374151' }}>{label}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Full Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={s.label} htmlFor="reg-name">Full Name</label>
                <div style={s.inputWrapper}>
                  <span style={s.inputIcon}>👤</span>
                  <input id="reg-name" className="reg-input" type="text" name="name"
                    placeholder="Dr. Jane Doe" value={formData.name} onChange={handleChange}
                    required style={s.input} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={s.label} htmlFor="reg-email">Email Address</label>
                <div style={s.inputWrapper}>
                  <span style={s.inputIcon}>✉️</span>
                  <input id="reg-email" className="reg-input" type="email" name="email"
                    placeholder="you@hospital.com" value={formData.email} onChange={handleChange}
                    required style={s.input} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '16px' }}>
                <label style={s.label} htmlFor="reg-password">Password</label>
                <div style={s.inputWrapper}>
                  <span style={s.inputIcon}>🔒</span>
                  <input id="reg-password" className="reg-input"
                    type={showPassword ? 'text' : 'password'} name="password"
                    placeholder="Min. 6 characters" value={formData.password} onChange={handleChange}
                    required style={{ ...s.input, paddingRight: '42px' }} />
                  <button type="button" style={s.eyeBtn} onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '16px' }}>
                <label style={s.label} htmlFor="reg-phone">Phone Number</label>
                <div style={s.inputWrapper}>
                  <span style={s.inputIcon}>📱</span>
                  <input id="reg-phone" className="reg-input" type="text" name="phone"
                    placeholder="+977 98XXXXXXXX" value={formData.phone} onChange={handleChange}
                    style={s.input} />
                </div>
              </div>

              {/* Doctor fields */}
              {formData.role === 'doctor' && (
                <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    👨‍⚕️ Doctor Details
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={s.label}>Specialization</label>
                    <input className="reg-input" type="text" name="specialization"
                      placeholder="e.g. Cardiologist, Dentist" value={formData.specialization}
                      onChange={handleChange} style={s.inputNoIcon} />
                  </div>
                  <div>
                    <label style={s.label}>Years of Experience</label>
                    <input className="reg-input" type="number" name="experience"
                      placeholder="e.g. 5" value={formData.experience}
                      onChange={handleChange} style={s.inputNoIcon} min="0" />
                  </div>
                </div>
              )}

              {/* Patient fields */}
              {formData.role === 'patient' && (
                <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid #bae6fd' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🧑 Patient Details
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={s.label}>Age</label>
                      <input className="reg-input" type="number" name="age"
                        placeholder="e.g. 28" value={formData.age}
                        onChange={handleChange} style={s.inputNoIcon} min="1" />
                    </div>
                    <div>
                      <label style={s.label}>Gender</label>
                      <select name="gender" className="reg-select" value={formData.gender}
                        onChange={handleChange} style={{ ...s.inputNoIcon, cursor: 'pointer' }}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button id="register-submit" type="submit" className="reg-btn"
                disabled={loading} style={s.submitBtn(loading)}>
                {loading ? '⏳ Creating account...' : '🚀  Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '24px' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#10b981', fontWeight: 600, textDecoration: 'none' }}>
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;