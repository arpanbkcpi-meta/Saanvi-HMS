import { FaHospital } from 'react-icons/fa';

const AuthCard = ({ title, children }) => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow p-4" style={{ width: '420px' }}>
        <div className="text-center mb-4">
          <FaHospital size={40} className="text-primary mb-2" />
          <h2 className="fw-bold text-primary">Saanvi HMS</h2>
          <p className="text-muted mb-0">Hospital Management System</p>
        </div>
        <h5 className="mb-3 text-center">{title}</h5>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;