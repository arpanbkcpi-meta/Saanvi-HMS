import { FaHospital, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-primary px-4">
      <span className="navbar-brand fw-bold fs-4">
        <FaHospital className="me-2" />
        Saanvi HMS
      </span>
      <div className="d-flex align-items-center gap-3">
        <span className="text-white">
          <FaUser className="me-1" />
          {user?.name}
        </span>
        <span className="badge bg-light text-primary">
          {user?.role}
        </span>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-1" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;