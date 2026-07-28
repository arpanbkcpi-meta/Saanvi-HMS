import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../utils/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0f172a', fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: '24px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '40px',
        width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px'
          }}>🔒</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Forgot Password?</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            {submitted
              ? "We've sent a reset link to your email if it exists in our system."
              : "Enter your email and we'll send you a reset link."}
          </p>
        </div>

        {!submitted && (
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@hospital.com"
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px',
                border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none',
                background: '#f8fafc', marginBottom: '20px', boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white', fontWeight: 700, fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(59,130,246,0.35)'
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '20px' }}>
          Remembered your password?{' '}
          <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>
            Back to Login →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;