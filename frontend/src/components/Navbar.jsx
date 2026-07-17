import { FaHospital, FaUser, FaSignOutAlt, FaCalendarCheck, FaPills, FaFlask, FaUserMd, FaUserShield, FaTachometerAlt, FaUsers, FaHeartbeat } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nav links based on role
  const navLinks = {
    patient: [
      { icon: <FaTachometerAlt />, label: 'Dashboard', path: '/patient-dashboard' },
      { icon: <FaCalendarCheck />, label: 'Appointments', path: '/patient-dashboard' },
      { icon: <FaPills />, label: 'Prescriptions', path: '/patient-dashboard' },
      { icon: <FaFlask />, label: 'Lab Reports', path: '/patient-dashboard' },
      { icon: <FaHeartbeat />, label: 'Medical History', path: '/medical-history' },
    ],
    doctor: [
      { icon: <FaTachometerAlt />, label: 'Dashboard', path: '/doctor-dashboard' },
      { icon: <FaCalendarCheck />, label: 'Appointments', path: '/doctor-dashboard' },
      { icon: <FaPills />, label: 'Prescriptions', path: '/doctor-dashboard' },
      { icon: <FaFlask />, label: 'Lab Reports', path: '/doctor-dashboard' },
      { icon: <FaHeartbeat />, label: 'Medical Histories', path: '/medical-history' },
    ],
    admin: [
      { icon: <FaTachometerAlt />, label: 'Dashboard', path: '/admin-dashboard' },
      { icon: <FaUserMd />, label: 'Doctors', path: '/admin-dashboard' },
      { icon: <FaUsers />, label: 'Patients', path: '/admin-dashboard' },
      { icon: <FaHeartbeat />, label: 'Medical Histories', path: '/medical-history' },
    ],
  };

  const links = navLinks[user?.role] || [];

  const roleColor = {
    admin: '#f59e0b',
    doctor: '#3b82f6',
    patient: '#10b981',
  };

  const roleIcon = {
    admin: <FaUserShield />,
    doctor: <FaUserMd />,
    patient: <FaUser />,
  };

  return (
    <>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 15px rgba(0,0,0,0.2)',
      }}>

        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', color: 'white',
              boxShadow: '0 4px 10px rgba(59,130,246,0.4)',
            }}>
              <FaHospital />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '16px', letterSpacing: '0.5px' }}>
                Saanvi HMS
              </div>
              <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                Hospital Management
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '42px', height: '42px',
              background: `linear-gradient(135deg, ${roleColor[user?.role]}, ${roleColor[user?.role]}99)`,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', color: 'white',
              flexShrink: 0,
            }}>
              {roleIcon[user?.role]}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                color: 'white', fontWeight: 600, fontSize: '13px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.role === 'doctor' ? `Dr. ${user?.name}` : user?.name}
              </div>
              <div style={{
                display: 'inline-block',
                background: `${roleColor[user?.role]}22`,
                color: roleColor[user?.role],
                fontSize: '10px', fontWeight: 600,
                padding: '2px 8px', borderRadius: '20px',
                textTransform: 'uppercase', letterSpacing: '0.5px',
                border: `1px solid ${roleColor[user?.role]}44`,
                marginTop: '3px',
              }}>
                {user?.role}
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ color: '#475569', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', padding: '0 8px', marginBottom: '8px' }}>
            Menu
          </div>
          {links.map((link, i) => {
            const isActive = location.pathname === link.path;
            return (
              <div
                key={i}
                onClick={() => navigate(link.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  marginBottom: '4px',
                  cursor: 'pointer',
                  background: isActive ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'transparent',
                  color: isActive ? 'white' : '#94a3b8',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{link.icon}</span>
                {link.label}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#f87171',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(248,113,113,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <FaSignOutAlt style={{ fontSize: '16px' }} />
            Logout
          </div>
        </div>
      </div>

      {/* Main content offset */}
     
    </>
  );
};

export default Navbar;