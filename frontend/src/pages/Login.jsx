import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const { data } = await axios.post('/auth/login', formData);
      login(data);
      if (data.role === 'doctor') navigate('/doctor-dashboard');
      else if (data.role === 'patient') navigate('/patient-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: '#0f172a',
    },
    leftPanel: {
      flex: 1,
      background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1a2744 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 48px',
      position: 'relative',
      overflow: 'hidden',
    },
    rightPanel: {
      width: '480px',
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 48px',
    },
    logoBox: {
      width: '72px', height: '72px',
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      borderRadius: '20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '32px',
      boxShadow: '0 8px 32px rgba(59,130,246,0.5)',
      marginBottom: '24px',
      animation: 'float 3s ease-in-out infinite',
    },
    brandTitle: {
      color: 'white',
      fontSize: '36px',
      fontWeight: 800,
      letterSpacing: '-0.5px',
      marginBottom: '8px',
      textAlign: 'center',
    },
    brandSub: {
      color: '#94a3b8',
      fontSize: '15px',
      textAlign: 'center',
      marginBottom: '48px',
      lineHeight: 1.6,
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
      color: '#cbd5e1',
      fontSize: '14px',
    },
    featureIcon: {
      width: '36px', height: '36px',
      background: 'rgba(59,130,246,0.15)',
      borderRadius: '10px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '16px',
      flexShrink: 0,
    },
    formTitle: {
      fontSize: '28px',
      fontWeight: 800,
      color: '#0f172a',
      marginBottom: '6px',
      textAlign: 'center',
    },
    formSubtitle: {
      color: '#64748b',
      fontSize: '14px',
      textAlign: 'center',
      marginBottom: '36px',
    },
    inputGroup: {
      marginBottom: '20px',
      width: '100%',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '8px',
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '13px 16px 13px 44px',
      borderRadius: '12px',
      border: '1.5px solid #e2e8f0',
      fontSize: '14px',
      outline: 'none',
      background: '#f8fafc',
      color: '#0f172a',
      transition: 'all 0.2s',
      boxSizing: 'border-box',
    },
    inputIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '16px',
      color: '#94a3b8',
      pointerEvents: 'none',
    },
    eyeBtn: {
      position: 'absolute',
      right: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#94a3b8',
      padding: 0,
    },
    errorBox: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '12px 16px',
      borderRadius: '10px',
      fontSize: '13px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    submitBtn: {
      width: '100%',
      padding: '14px',
      background: loading ? '#93c5fd' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: 700,
      cursor: loading ? 'not-allowed' : 'pointer',
      boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
      marginTop: '8px',
      transition: 'all 0.2s',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '24px 0',
      color: '#cbd5e1',
      fontSize: '13px',
      width: '100%',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: '#e2e8f0',
    },
    registerLink: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#64748b',
    },
    demoBox: {
      background: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '12px',
      padding: '14px 16px',
      marginBottom: '28px',
      width: '100%',
    },
    demoTitle: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#0369a1',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    demoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#0369a1',
      marginBottom: '4px',
    },
  };

  const features = [
    { icon: '📅', text: 'Smart appointment scheduling with time slots' },
    { icon: '💊', text: 'Digital prescriptions & medication tracking' },
    { icon: '🔬', text: 'Lab report upload & download portal' },
    { icon: '❤️', text: 'Complete electronic medical records' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .login-input:focus {
          border-color: #3b82f6 !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59,130,246,0.5) !important;
        }
        .left-blob {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
      `}</style>
      <div style={styles.page}>
        {/* Left Panel */}
        <div style={styles.leftPanel}>
          {/* Decorative blobs */}
          <div className="left-blob" style={{ width: '400px', height: '400px', top: '-100px', left: '-100px' }} />
          <div className="left-blob" style={{ width: '300px', height: '300px', bottom: '-80px', right: '-80px' }} />

          <div style={styles.logoBox}>🏥</div>
          <h1 style={styles.brandTitle}>Saanvi HMS</h1>
          <p style={styles.brandSub}>
            Your complete Hospital Management System.<br />
            Streamlining healthcare, one click at a time.
          </p>

          <div style={{ width: '100%', maxWidth: '360px' }}>
            {features.map((f, i) => (
              <div key={i} style={styles.featureItem}>
                <div style={styles.featureIcon}>{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom tagline */}
          <div style={{ position: 'absolute', bottom: '32px', color: '#475569', fontSize: '12px', letterSpacing: '0.5px' }}>
            © 2026 Saanvi HMS · Built with ❤️ by Arpan
          </div>
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'inline-block', background: '#eff6ff', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, color: '#3b82f6', marginBottom: '16px', letterSpacing: '0.5px' }}>
                WELCOME BACK
              </div>
            </div>
            <h2 style={styles.formTitle}>Sign in to your account</h2>
            <p style={styles.formSubtitle}>Enter your credentials to continue</p>

            {/* Demo Accounts */}
            <div style={styles.demoBox}>
              <div style={styles.demoTitle}>🔑 Demo Accounts</div>
              {[
                { role: 'Admin', email: 'admin@hospital.com' },
                { role: 'Doctor', email: 'john@doctor.com' },
                { role: 'Patient', email: 'ram@patient.com' },
              ].map(acc => (
                <div key={acc.role} style={styles.demoRow}>
                  <span style={{ fontWeight: 600 }}>{acc.role}</span>
                  <span>{acc.email} · 123456</span>
                </div>
              ))}
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              {/* Email */}
              <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="login-email">Email Address</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>✉️</span>
                  <input
                    id="login-email"
                    className="login-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="login-password">Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    id="login-password"
                    className="login-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ ...styles.input, paddingRight: '44px' }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    style={styles.eyeBtn}
                    onClick={() => setShowPassword(prev => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                className="login-btn"
                disabled={loading}
                style={styles.submitBtn}
              >
                {loading ? '⏳ Signing in...' : '→  Sign In'}
              </button>
            </form>

            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span>or</span>
              <div style={styles.dividerLine} />
            </div>

            <p style={styles.registerLink}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>
                Create account →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;