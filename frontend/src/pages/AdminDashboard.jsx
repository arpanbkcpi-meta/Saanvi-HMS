import { useState, useEffect } from 'react';
import { FaUserMd, FaUsers, FaTrash, FaSort, FaPlus } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorSort, setDoctorSort] = useState('asc');
  const [patientSort, setPatientSort] = useState('asc');
  const [doctorPage, setDoctorPage] = useState(1);
  const [patientPage, setPatientPage] = useState(1);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '', email: '', password: '', specialization: '', experience: '', phone: ''
  });
  const [patientForm, setPatientForm] = useState({
    name: '', email: '', password: '', age: '', gender: 'male', phone: ''
  });
  const [error, setError] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docsRes, patientsRes] = await Promise.all([
        axios.get('/users/doctors'),
        axios.get('/users/patients')
      ]);
      setDoctors(docsRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post('/users/doctor', doctorForm);
      setDoctors([...doctors, data]);
      setDoctorForm({ name: '', email: '', password: '', specialization: '', experience: '', phone: '' });
      setShowAddDoctor(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add doctor');
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post('/users/patient', patientForm);
      setPatients([...patients, data]);
      setPatientForm({ name: '', email: '', password: '', age: '', gender: 'male', phone: '' });
      setShowAddPatient(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add patient');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Delete this doctor?')) {
      try {
        await axios.delete(`/users/${id}`);
        setDoctors(doctors.filter(d => d._id !== id));
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Delete this patient?')) {
      try {
        await axios.delete(`/users/${id}`);
        setPatients(patients.filter(p => p._id !== id));
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const sortedDoctors = [...doctors].sort((a, b) => {
    return doctorSort === 'asc' 
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const doctorStartIdx = (doctorPage - 1) * itemsPerPage;
  const paginatedDoctors = sortedDoctors.slice(doctorStartIdx, doctorStartIdx + itemsPerPage);
  const doctorPages = Math.ceil(sortedDoctors.length / itemsPerPage);

  const sortedPatients = [...patients].sort((a, b) => {
    return patientSort === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const patientStartIdx = (patientPage - 1) * itemsPerPage;
  const paginatedPatients = sortedPatients.slice(patientStartIdx, patientStartIdx + itemsPerPage);
  const patientPages = Math.ceil(sortedPatients.length / itemsPerPage);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-4">Admin Dashboard 👨‍💼</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Stats */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <FaUserMd size={28} className="text-primary" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Doctors</h6>
                  <h3 className="fw-bold mb-0">{doctors.length}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <FaUsers size={28} className="text-success" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Patients</h6>
                  <h3 className="fw-bold mb-0">{patients.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Doctors List */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">
                    <FaUserMd className="me-2 text-primary" />
                    Doctors
                  </h5>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setShowAddDoctor(!showAddDoctor)}
                    >
                      <FaPlus className="me-1" />
                      Add
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setDoctorSort(doctorSort === 'asc' ? 'desc' : 'asc')}
                    >
                      <FaSort className="me-1" />
                      Sort
                    </button>
                  </div>
                </div>

                {showAddDoctor && (
                  <form onSubmit={handleAddDoctor} className="mb-3 p-3 bg-light rounded">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Name"
                      value={doctorForm.name}
                      onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                      required
                    />
                    <input
                      type="email"
                      className="form-control mb-2"
                      placeholder="Email"
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                      required
                    />
                    <input
                      type="password"
                      className="form-control mb-2"
                      placeholder="Password"
                      value={doctorForm.password}
                      onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Specialization"
                      value={doctorForm.specialization}
                      onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})}
                    />
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder="Experience (years)"
                      value={doctorForm.experience}
                      onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Phone"
                      value={doctorForm.phone}
                      onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                    />
                    <button type="submit" className="btn btn-primary w-100 btn-sm">Add Doctor</button>
                  </form>
                )}

                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : doctors.length === 0 ? (
                  <p className="text-muted text-center py-4">No doctors yet</p>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Name</th>
                            <th>Specialization</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedDoctors.map((doc) => (
                            <tr key={doc._id}>
                              <td>{doc.name}</td>
                              <td>{doc.specialization || 'General'}</td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteDoctor(doc._id)}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {doctorPages > 1 && (
                      <div className="d-flex justify-content-center gap-2 mt-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setDoctorPage(prev => Math.max(1, prev - 1))}
                          disabled={doctorPage === 1}
                        >
                          Previous
                        </button>
                        <span className="align-self-center">Page {doctorPage} of {doctorPages}</span>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setDoctorPage(prev => Math.min(doctorPages, prev + 1))}
                          disabled={doctorPage === doctorPages}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Patients List */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">
                    <FaUsers className="me-2 text-success" />
                    Patients
                  </h5>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => setShowAddPatient(!showAddPatient)}
                    >
                      <FaPlus className="me-1" />
                      Add
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => setPatientSort(patientSort === 'asc' ? 'desc' : 'asc')}
                    >
                      <FaSort className="me-1" />
                      Sort
                    </button>
                  </div>
                </div>

                {showAddPatient && (
                  <form onSubmit={handleAddPatient} className="mb-3 p-3 bg-light rounded">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Name"
                      value={patientForm.name}
                      onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
                      required
                    />
                    <input
                      type="email"
                      className="form-control mb-2"
                      placeholder="Email"
                      value={patientForm.email}
                      onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                      required
                    />
                    <input
                      type="password"
                      className="form-control mb-2"
                      placeholder="Password"
                      value={patientForm.password}
                      onChange={(e) => setPatientForm({...patientForm, password: e.target.value})}
                      required
                    />
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder="Age"
                      value={patientForm.age}
                      onChange={(e) => setPatientForm({...patientForm, age: e.target.value})}
                    />
                    <select
                      className="form-select mb-2"
                      value={patientForm.gender}
                      onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Phone"
                      value={patientForm.phone}
                      onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
                    />
                    <button type="submit" className="btn btn-success w-100 btn-sm">Add Patient</button>
                  </form>
                )}

                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-success" />
                  </div>
                ) : patients.length === 0 ? (
                  <p className="text-muted text-center py-4">No patients yet</p>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedPatients.map((pat) => (
                            <tr key={pat._id}>
                              <td>{pat.name}</td>
                              <td>{pat.age || '-'}</td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeletePatient(pat._id)}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {patientPages > 1 && (
                      <div className="d-flex justify-content-center gap-2 mt-3">
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => setPatientPage(prev => Math.max(1, prev - 1))}
                          disabled={patientPage === 1}
                        >
                          Previous
                        </button>
                        <span className="align-self-center">Page {patientPage} of {patientPages}</span>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => setPatientPage(prev => Math.min(patientPages, prev + 1))}
                          disabled={patientPage === patientPages}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;