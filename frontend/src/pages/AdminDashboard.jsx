import { useState, useEffect } from 'react';
import { FaUserMd, FaUsers, FaTrash, FaSort } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorSort, setDoctorSort] = useState('asc');
  const [patientSort, setPatientSort] = useState('asc');

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

  const sortedPatients = [...patients].sort((a, b) => {
    return patientSort === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-4">Admin Dashboard 👨‍💼</h4>

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
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setDoctorSort(doctorSort === 'asc' ? 'desc' : 'asc')}
                  >
                    <FaSort className="me-1" />
                    Sort
                  </button>
                </div>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : doctors.length === 0 ? (
                  <p className="text-muted text-center py-4">No doctors yet</p>
                ) : (
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
                        {sortedDoctors.map((doc) => (
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
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => setPatientSort(patientSort === 'asc' ? 'desc' : 'asc')}
                  >
                    <FaSort className="me-1" />
                    Sort
                  </button>
                </div>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-success" />
                  </div>
                ) : patients.length === 0 ? (
                  <p className="text-muted text-center py-4">No patients yet</p>
                ) : (
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
                        {sortedPatients.map((pat) => (
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