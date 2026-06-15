import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaHospital, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-primary px-4">
        <span className="navbar-brand fw-bold">
          <FaHospital className="me-2" />
          Saanvi HMS
        </span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">
            <FaUser className="me-1" />
            {user?.name}
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

      {/* Main Content */}
      <div className="container mt-4">
        <h4 className="mb-4">Welcome, {user?.name}! 👋</h4>

        {/* Stats Cards */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <FaUserMd size={28} className="text-primary" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Doctors</h6>
                  <h3 className="fw-bold mb-0">12</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <FaUser size={28} className="text-success" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Patients</h6>
                  <h3 className="fw-bold mb-0">248</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <FaHospital size={28} className="text-warning" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Appointments Today</h6>
                  <h3 className="fw-bold mb-0">34</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-body">
            <h5 className="card-title">Your Profile</h5>
            <hr />
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> <span className="badge bg-primary">{user?.role}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;