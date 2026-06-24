import { useState, useEffect } from 'react';
import { FaUserMd, FaCalendarCheck, FaClock, FaCheckCircle, FaPills, FaFileUpload } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrescribeForm, setShowPrescribeForm] = useState(false);
  const [showLabForm, setShowLabForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedLabAppointment, setSelectedLabAppointment] = useState(null);
  const [medicineList, setMedicineList] = useState([
    { name: '', dosage: '', frequency: '', duration: '' }
  ]);
  const [notes, setNotes] = useState('');
  const [labForm, setLabForm] = useState({
    testName: '',
    notes: '',
    file: null
  });

  useEffect(() => {
    fetchAppointments();
    fetchPrescriptions();
    fetchLabs();
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

  const fetchPrescriptions = async () => {
    try {
      const { data } = await axios.get('/prescriptions/doctor');
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const fetchLabs = async () => {
    try {
      const { data } = await axios.get('/labs/doctor');
      setLabs(data);
    } catch (error) {
      console.error('Error fetching labs:', error);
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

  const handleMedicineChange = (index, field, value) => {
    const newList = [...medicineList];
    newList[index][field] = value;
    setMedicineList(newList);
  };

  const addMedicine = () => {
    setMedicineList([...medicineList, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handlePrescribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/prescriptions', {
        appointmentId: selectedAppointment._id,
        patientId: selectedAppointment.patientId._id,
        medicines: medicineList.filter(m => m.name),
        notes
      });
      fetchAppointments();
      fetchPrescriptions();
      setShowPrescribeForm(false);
      setMedicineList([{ name: '', dosage: '', frequency: '', duration: '' }]);
      setNotes('');
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error creating prescription:', error);
    }
  };

  const handleUploadLab = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('appointmentId', selectedLabAppointment._id);
    formData.append('patientId', selectedLabAppointment.patientId._id);
    formData.append('testName', labForm.testName);
    formData.append('notes', labForm.notes);
    formData.append('file', labForm.file);

    try {
      await axios.post('/labs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchAppointments();
      fetchLabs();
      setShowLabForm(false);
      setLabForm({ testName: '', notes: '', file: null });
      setSelectedLabAppointment(null);
    } catch (error) {
      console.error('Error uploading lab:', error);
    }
  };

  const pending = appointments.filter(a => a.status === 'pending');
  const approved = appointments.filter(a => a.status === 'approved');

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-4">Doctor Dashboard 👨‍⚕️</h4>

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

        {showPrescribeForm && selectedAppointment && (
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <FaPills className="me-2 text-primary" />
                  Prescribe for {selectedAppointment.patientId?.name}
                </h5>
                <button className="btn-close" onClick={() => setShowPrescribeForm(false)} />
              </div>
              <form onSubmit={handlePrescribe}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Medicines</label>
                  {medicineList.map((med, idx) => (
                    <div key={idx} className="row g-2 mb-2">
                      <div className="col-md-3">
                        <input type="text" className="form-control form-control-sm" placeholder="Medicine name" value={med.name} onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)} />
                      </div>
                      <div className="col-md-3">
                        <input type="text" className="form-control form-control-sm" placeholder="Dosage (e.g., 500mg)" value={med.dosage} onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)} />
                      </div>
                      <div className="col-md-2">
                        <input type="text" className="form-control form-control-sm" placeholder="Frequency (e.g., 2x daily)" value={med.frequency} onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)} />
                      </div>
                      <div className="col-md-2">
                        <input type="text" className="form-control form-control-sm" placeholder="Duration (e.g., 7 days)" value={med.duration} onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)} />
                      </div>
                      <div className="col-md-1">
                        {medicineList.length > 1 && <button type="button" className="btn btn-danger btn-sm w-100" onClick={() => setMedicineList(medicineList.filter((_, i) => i !== idx))}>✕</button>}
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={addMedicine}>+ Add Medicine</button>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Notes</label>
                  <textarea className="form-control" placeholder="Additional notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                </div>
                <button type="submit" className="btn btn-primary">Create Prescription</button>
              </form>
            </div>
          </div>
        )}

        {showLabForm && selectedLabAppointment && (
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <FaFileUpload className="me-2 text-warning" />
                  Upload Lab Report for {selectedLabAppointment.patientId?.name}
                </h5>
                <button className="btn-close" onClick={() => setShowLabForm(false)} />
              </div>
              <form onSubmit={handleUploadLab}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Test Name</label>
                  <input type="text" className="form-control" placeholder="e.g., Blood Test, X-Ray" value={labForm.testName} onChange={(e) => setLabForm({...labForm, testName: e.target.value})} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Upload File</label>
                  <input type="file" className="form-control" onChange={(e) => setLabForm({...labForm, file: e.target.files[0]})} accept=".pdf,.jpg,.jpeg,.png" required />
                  <small className="text-muted">PDF, JPG, PNG accepted</small>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Notes</label>
                  <textarea className="form-control" placeholder="Additional notes about the test" value={labForm.notes} onChange={(e) => setLabForm({...labForm, notes: e.target.value})} rows={3} />
                </div>
                <button type="submit" className="btn btn-warning">Upload Lab Report</button>
              </form>
            </div>
          </div>
        )}

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="card-title"><FaUserMd className="me-2 text-primary" />Your Profile</h5>
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

        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title mb-3">Appointments</h5>
            {loading ? <div className="text-center py-4"><div className="spinner-border text-primary" /></div> : appointments.length === 0 ? <p className="text-muted text-center py-4">No appointments yet</p> : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light"><tr><th>Patient</th><th>Date</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt._id}>
                        <td>{apt.patientId?.name}</td>
                        <td>{new Date(apt.date).toLocaleDateString()}</td>
                        <td>{apt.reason}</td>
                        <td><span className={`badge bg-${apt.status === 'approved' ? 'success' : apt.status === 'rejected' ? 'danger' : 'warning'}`}>{apt.status}</span></td>
                        <td>
                          {apt.status === 'pending' && (
                            <div className="d-flex gap-2">
                              <button className="btn btn-success btn-sm" onClick={() => handleStatus(apt._id, 'approved')}>Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleStatus(apt._id, 'rejected')}>Reject</button>
                            </div>
                          )}
                          {apt.status === 'approved' && (
                            <div className="d-flex gap-1">
                              <button className="btn btn-info btn-sm" onClick={() => { setSelectedAppointment(apt); setShowPrescribeForm(true); }}><FaPills className="me-1" />Rx</button>
                              <button className="btn btn-warning btn-sm" onClick={() => { setSelectedLabAppointment(apt); setShowLabForm(true); }}><FaFileUpload className="me-1" />Lab</button>
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

        {prescriptions.length > 0 && (
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3"><FaPills className="me-2 text-primary" />Prescriptions Given</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light"><tr><th>Patient</th><th>Medicines</th><th>Date</th></tr></thead>
                  <tbody>
                    {prescriptions.map((presc) => (
                      <tr key={presc._id}>
                        <td>{presc.patientId?.name}</td>
                        <td>{presc.medicines.map((med, idx) => <div key={idx} className="small">{med.name} - {med.dosage}</div>)}</td>
                        <td>{new Date(presc.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {labs.length > 0 && (
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3"><FaFileUpload className="me-2 text-warning" />Lab Reports Uploaded</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light"><tr><th>Patient</th><th>Test Name</th><th>File</th><th>Date</th></tr></thead>
                  <tbody>
                    {labs.map((lab) => (
                      <tr key={lab._id}>
                        <td>{lab.patientId?.name}</td>
                        <td>{lab.testName}</td>
                        <td><a href={lab.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">View</a></td>
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

export default DoctorDashboard;