import { useState, useEffect } from 'react';
import { FaCalendarPlus, FaCalendarCheck, FaClock, FaTimesCircle, FaPills, FaFileDownload } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    reason: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    fetchPrescriptions();
    fetchLabs();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get('/users/doctors');
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('/appointments/patient');
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const { data } = await axios.get('/prescriptions/patient');
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const fetchLabs = async () => {
    try {
      const { data } = await axios.get('/labs/patient');
      setLabs(data);
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/appointments/${id}`);
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/appointments', formData);
      setSuccess('Appointment booked successfully!');
      setFormData({ doctorId: '', date: '', reason: '' });
      setSelectedDepartment('');
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleFollowUp = (apt) => {
    setSelectedDepartment(apt.doctorId?.specialization);
    setFormData({
      doctorId: apt.doctorId?._id,
      date: '',
      reason: `Follow-up: ${apt.reason}`
    });
    window.scrollTo(0, 0);
  };

  const departments = [...new Set(doctors.map(doc => doc.specialization))].filter(Boolean);
  const doctorsInDepartment = selectedDepartment 
    ? doctors.filter(doc => doc.specialization === selectedDepartment)
    : doctors;

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-4">Patient Dashboard 🏥</h4>

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
                  <h3 className="fw-bold mb-0">
                    {appointments.filter(a => a.status === 'pending').length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-danger bg-opacity-10 p-3 rounded">
                  <FaTimesCircle size={28} className="text-danger" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Rejected</h6>
                  <h3 className="fw-bold mb-0">
                    {appointments.filter(a => a.status === 'rejected').length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-5">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  <FaCalendarPlus className="me-2 text-primary" />
                  Book Appointment
                </h5>
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleBooking}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Select Department</label>
                    <select
                      className="form-select"
                      value={selectedDepartment}
                      onChange={(e) => {
                        setSelectedDepartment(e.target.value);
                        setFormData({...formData, doctorId: ''});
                      }}
                      required
                    >
                      <option value="">Choose a department...</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Select Doctor</label>
                    <select
                      name="doctorId"
                      className="form-select"
                      value={formData.doctorId}
                      onChange={handleChange}
                      disabled={!selectedDepartment}
                      required
                    >
                      <option value="">Choose a doctor...</option>
                      {doctorsInDepartment.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                          Dr. {doc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Date</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Reason</label>
                    <textarea
                      name="reason"
                      className="form-control"
                      placeholder="Describe your symptoms or reason for visit"
                      value={formData.reason}
                      onChange={handleChange}
                      rows={3}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Book Appointment
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title mb-3">My Appointments</h5>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : appointments.length === 0 ? (
                  <p className="text-muted text-center py-4">
                    No appointments yet
                  </p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Doctor</th>
                          <th>Date</th>
                          <th>Reason</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((apt) => (
                          <tr key={apt._id}>
                            <td>Dr. {apt.doctorId?.name}</td>
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
                              <div className="d-flex gap-2">
                                {apt.status === 'pending' && (
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleDelete(apt._id)}
                                  >
                                    Cancel
                                  </button>
                                )}
                                {apt.status === 'approved' && (
                                  <button
                                    className="btn btn-info btn-sm"
                                    onClick={() => handleFollowUp(apt)}
                                  >
                                    Follow-up
                                  </button>
                                )}
                              </div>
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

        {/* My Prescriptions */}
        {prescriptions.length > 0 && (
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <FaPills className="me-2 text-primary" />
                My Prescriptions
              </h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Doctor</th>
                      <th>Medicines</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((presc) => (
                      <tr key={presc._id}>
                        <td>Dr. {presc.doctorId?.name}</td>
                        <td>
                          {presc.medicines.map((med, idx) => (
                            <div key={idx} className="small">
                              {med.name} - {med.dosage}, {med.frequency}, {med.duration}
                            </div>
                          ))}
                        </td>
                        <td>{new Date(presc.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* My Lab Reports */}
        {labs.length > 0 && (
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <FaFileDownload className="me-2 text-warning" />
                My Lab Reports
              </h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Doctor</th>
                      <th>Test Name</th>
                      <th>File</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labs.map((lab) => (
                      <tr key={lab._id}>
                        <td>Dr. {lab.doctorId?.name}</td>
                        <td>{lab.testName}</td>
                        <td>
                          <a href={lab.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                            Download
                          </a>
                        </td>
                        <td>{new Date(lab.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;