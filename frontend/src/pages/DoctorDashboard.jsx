import { useState, useEffect } from 'react';
import { FaUserMd, FaCalendarCheck, FaClock, FaCheckCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('/appointments/doctor');
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await axios.put(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const pending = appointments.filter(a => a.status === 'pending');
  const approved = appointments.filter(a => a.status === 'approved');

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-4">Doctor Dashboard 👨‍⚕️</h4>

        {/* Stats */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <FaCalendarCheck size={28} className="text-primary" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Appointments</h6>
                  <h3 className="fw-bold mb-0">{appointments.length}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <FaClock size={28} className="text-warning" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Pending</h6>
                  <h3 className="fw-bold mb-0">{pending.length}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <FaCheckCircle size={28} className="text-success" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Approved</h6>
                  <h3 className="fw-bold mb-0">{approved.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="card-title">
              <FaUserMd className="me-2 text-primary" />
              Your Profile
            </h5>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <p><strong>Name:</strong> Dr. {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Specialization:</strong> {user?.specialization || 'Not specified'}</p>
                <p><strong>Experience:</strong> {user?.experience || 0} years</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title mb-3">Appointments</h5>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" />
              </div>
            ) : appointments.length === 0 ? (
              <p className="text-muted text-center py-4">No appointments yet</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt._id}>
                        <td>{apt.patientId?.name}</td>
                        <td>{new Date(apt.date).toLocaleDateString()}</td>
                        <td>{apt.reason}</td>
                        <td>
                          <span className={`badge bg-${
                            apt.status === 'approved' ? 'success' :
                            apt.status === 'rejected' ? 'danger' : 'warning'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td>
                          {apt.status === 'pending' && (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleStatus(apt._id, 'approved')}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleStatus(apt._id, 'rejected')}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;