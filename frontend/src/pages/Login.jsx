import { toast } from 'react-toastify';
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
      
      // ✅ FIXED: Proper role-based redirect with labtech support
      if (data.role === 'admin') {
        navigate('/dashboard');
      } else if (data.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (data.role === 'patient') {
        navigate('/patient-dashboard');
      } else if (data.role === 'labtech') {
        navigate('/labtech-dashboard');
      } else {
        // Fallback for any other role
        console.warn('Unknown role:', data.role);
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      height: '100vh',
      display: 'flex',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: '#e8edf5',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
    },
    leftPanel: {
      flex: '0 0 50%',
      background: 'linear-gradient(145deg, #0a1628 0%, #1a2a4a 50%, #0a1628 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 40px',
      position: 'relative',
      overflow: 'hidden',
      height: '100vh',
    },
    rightPanel: {
      flex: '0 0 50%',
      background: 'linear-gradient(145deg, #e8d5f5 0%, #f0e6f7 50%, #e8d5f5 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 50px',
      overflow: 'hidden',
      height: '100vh',
    },
    logoBox: {
      width: '72px',
      height: '72px',
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '34px',
      boxShadow: '0 12px 40px rgba(59,130,246,0.35)',
      marginBottom: '20px',
      animation: 'float 3s ease-in-out infinite',
      flexShrink: 0,
    },
    brandTitle: {
      color: 'white',
      fontSize: '36px',
      fontWeight: 800,
      letterSpacing: '-1px',
      marginBottom: '10px',
      textAlign: 'center',
      lineHeight: 1.2,
      flexShrink: 0,
    },
    brandSub: {
      color: '#94a3b8',
      fontSize: '15px',
      textAlign: 'center',
      marginBottom: '32px',
      lineHeight: 1.6,
      maxWidth: '360px',
      flexShrink: 0,
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px 24px',
      maxWidth: '380px',
      width: '100%',
      flexShrink: 0,
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#cbd5e1',
      fontSize: '14px',
    },
    featureIcon: {
      width: '36px',
      height: '36px',
      background: 'rgba(59,130,246,0.12)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      flexShrink: 0,
    },
    brandFooter: {
      position: 'absolute',
      bottom: '24px',
      color: '#334155',
      fontSize: '13px',
      letterSpacing: '0.3px',
      flexShrink: 0,
    },
    formContainer: {
      width: '100%',
      maxWidth: '400px',
      flexShrink: 0,
    },
    formHeader: {
      marginBottom: '28px',
    },
    formBadge: {
      display: 'inline-block',
      background: '#7c3aed',
      borderRadius: '20px',
      padding: '6px 16px',
      fontSize: '12px',
      fontWeight: 600,
      color: '#ffffff',
      marginBottom: '12px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    formTitle: {
      fontSize: '28px',
      fontWeight: 800,
      color: '#1e1b4b',
      marginBottom: '6px',
      lineHeight: 1.2,
    },
    formSubtitle: {
      color: '#5b21b6',
      fontSize: '15px',
      lineHeight: 1.5,
    },
    demoBox: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid #c4b5d4',
      borderRadius: '12px',
      padding: '14px 18px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(91, 33, 182, 0.08)',
    },
    demoTitle: {
      fontSize: '11px',
      fontWeight: 700,
      color: '#5b21b6',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    demoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
    },
    demoItem: {
      background: 'rgba(255, 255, 255, 0.8)',
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #c4b5d4',
      fontSize: '12px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    demoRole: {
      fontWeight: 700,
      color: '#1e1b4b',
      display: 'block',
      marginBottom: '2px',
      fontSize: '13px',
    },
    demoEmail: {
      color: '#5b21b6',
      fontSize: '10px',
    },
    inputGroup: {
      marginBottom: '18px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 600,
      color: '#1e1b4b',
      marginBottom: '6px',
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '12px 16px 12px 44px',
      borderRadius: '12px',
      border: '2px solid #c4b5d4',
      fontSize: '15px',
      outline: 'none',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#1e1b4b',
      transition: 'all 0.2s',
      boxSizing: 'border-box',
      height: '50px',
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '18px',
      color: '#7c3aed',
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
      fontSize: '20px',
      color: '#7c3aed',
      padding: '4px',
    },
    errorBox: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '10px 14px',
      borderRadius: '10px',
      fontSize: '14px',
      marginBottom: '18px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    submitBtn: {
      width: '100%',
      padding: '14px',
      background: loading ? '#a78bfa' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: 700,
      cursor: loading ? 'not-allowed' : 'pointer',
      boxShadow: '0 4px 16px rgba(124, 58, 237, 0.35)',
      marginTop: '6px',
      transition: 'all 0.2s',
      height: '50px',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      margin: '24px 0 20px',
      color: '#7c3aed',
      fontSize: '14px',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: '#c4b5d4',
    },
    registerLink: {
      textAlign: 'center',
      fontSize: '15px',
      color: '#5b21b6',
    },
    link: {
      color: '#7c3aed',
      fontWeight: 700,
      textDecoration: 'none',
      fontSize: '15px',
    },
    forgotPassword: {
      textAlign: 'right',
      marginTop: '6px',
      marginBottom: '16px',
    },
    forgotLink: {
      fontSize: '13px',
      color: '#3b82f6',
      fontWeight: 600,
      textDecoration: 'none',
    },
  };

  const features = [
    { icon: '📅', text: 'Smart scheduling' },
    { icon: '💊', text: 'Digital prescriptions' },
    { icon: '🔬', text: 'Lab reports' },
    { icon: '❤️', text: 'Medical records' },
  ];

  // ✅ ADDED Lab Tech to demo accounts
  const demoAccounts = [
    { role: 'Admin', email: 'admin@hospital.com' },
    { role: 'Doctor', email: 'john@doctor.com' },
    { role: 'Patient', email: 'ram@patient.com' },
    { role: 'Lab Tech', email: 'sarah@hospital.com' },  // ✅ ADD THIS
  ];

  const fillDemoCredentials = (email) => {
    setFormData({ email, password: '123456' });
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100%;
          width: 100%;
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .login-input:focus {
          border-color: #7c3aed !important;
          background: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.12);
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(124, 58, 237, 0.45) !important;
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0px);
        }
        .demo-item:hover {
          background: #ede9fe;
          border-color: #7c3aed;
          transform: scale(1.02);
        }
        .left-blob {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .right-blob {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        @media (max-width: 1024px) {
          .left-panel { flex: 0 0 50% !important; padding: 30px 24px !important; }
          .right-panel { flex: 0 0 50% !important; padding: 30px 24px !important; }
          .brand-title { font-size: 30px !important; }
          .brand-sub { font-size: 14px !important; }
          .feature-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
          .form-title { font-size: 24px !important; }
        }
        @media (max-width: 768px) {
          .page { flex-direction: column !important; overflow: auto !important; position: relative !important; height: auto !important; min-height: 100vh !important; }
          .left-panel { flex: 0 0 auto !important; padding: 30px 20px !important; min-height: 40vh !important; height: auto !important; }
          .right-panel { flex: 0 0 auto !important; padding: 24px 20px !important; min-height: 60vh !important; height: auto !important; overflow: auto !important; }
          .brand-title { font-size: 28px !important; }
          .brand-sub { font-size: 14px !important; margin-bottom: 20px !important; }
          .feature-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .feature-item { font-size: 13px !important; }
          .demo-grid { grid-template-columns: 1fr 1fr !important; }
          .form-title { font-size: 22px !important; }
          .form-subtitle { font-size: 14px !important; }
          .input { height: 46px !important; font-size: 14px !important; padding: 10px 14px 10px 40px !important; }
          .submit-btn { height: 46px !important; font-size: 15px !important; }
          .logo-box { width: 60px !important; height: 60px !important; font-size: 28px !important; }
          html, body { overflow: auto !important; }
        }
      `}</style>

      <div style={styles.page} className="page">
        {/* Left Panel - Navy Blue */}
        <div style={styles.leftPanel} className="left-panel">
          <div className="left-blob" style={{ width: '400px', height: '400px', top: '-150px', right: '-150px' }} />
          <div className="left-blob" style={{ width: '300px', height: '300px', bottom: '-100px', left: '-100px' }} />
          
          <div style={styles.logoBox}>🏥</div>
          <h1 style={styles.brandTitle} className="brand-title">Saanvi HMS</h1>
          <p style={styles.brandSub} className="brand-sub">
            Complete Hospital Management System<br />
            Streamlining healthcare operations
          </p>

          <div style={styles.featureGrid} className="feature-grid">
            {features.map((f, i) => (
              <div key={i} style={styles.featureItem} className="feature-item">
                <div style={styles.featureIcon}>{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          <div style={styles.brandFooter}>© 2026 Saanvi HMS · Built with ❤️ by Arpan</div>
        </div>

        {/* Right Panel - Lavender */}
        <div style={styles.rightPanel} className="right-panel">
          <div className="right-blob" style={{ width: '350px', height: '350px', top: '-120px', right: '-120px' }} />
          <div className="right-blob" style={{ width: '250px', height: '250px', bottom: '-80px', left: '-80px' }} />
          
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <div style={styles.formBadge}>Welcome Back</div>
              <h2 style={styles.formTitle} className="form-title">Sign in to your account</h2>
              <p style={styles.formSubtitle} className="form-subtitle">Access your dashboard and manage healthcare</p>
            </div>

            {/* Demo Accounts - Click to fill */}
            <div style={styles.demoBox}>
              <div style={styles.demoTitle}>🔑 Quick Demo Access</div>
              <div style={styles.demoGrid} className="demo-grid">
                {demoAccounts.map((acc) => (
                  <div
                    key={acc.role}
                    style={styles.demoItem}
                    className="demo-item"
                    onClick={() => fillDemoCredentials(acc.email)}
                  >
                    <span style={styles.demoRole}>{acc.role}</span>
                    <span style={styles.demoEmail}>{acc.email}</span>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span style={{ fontSize: '16px' }}>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
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

              {/* Password Field */}
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
                    style={{ ...styles.input, paddingRight: '46px' }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    style={styles.eyeBtn}
                    onClick={() => setShowPassword(prev => !prev)}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
                <div style={styles.forgotPassword}>
                  <Link to="/forgot-password" style={styles.forgotLink}>
                    Forgot Password?
                  </Link>
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
              <Link to="/register" style={styles.link}>
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