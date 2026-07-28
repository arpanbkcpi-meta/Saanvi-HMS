import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../utils/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successful! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
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
            background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px'
          }}>🔑</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Reset Your Password</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Choose a new password below.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '10px',
              border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none',
              background: '#f8fafc', marginBottom: '16px', boxSizing: 'border-box'
            }}
          />

          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
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
              background: loading ? '#a7f3d0' : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white', fontWeight: 700, fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(16,185,129,0.35)'
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '20px' }}>
          <Link to="/login" style={{ color: '#10b981', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;