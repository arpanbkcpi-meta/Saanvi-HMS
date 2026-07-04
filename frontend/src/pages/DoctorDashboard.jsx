import { useState, useEffect } from 'react';
import { FaUserMd, FaCalendarCheck, FaClock, FaCheckCircle, FaPills, FaFileUpload, FaTimesCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [showPrescribeForm, setShowPrescribeForm] = useState(false);
  const [showLabForm, setShowLabForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedLabAppointment, setSelectedLabAppointment] = useState(null);
  const [medicineList, setMedicineList] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
  const [notes, setNotes] = useState('');
  const [labForm, setLabForm] = useState({ testName: '', notes: '', file: null });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAppointments();
    fetchPrescriptions();
    fetchLabs();
  }, []);

  const fetchAppointments = async () => {
    try { const { data } = await axios.get('/appointments/doctor'); setAppointments(data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchPrescriptions = async () => {
    try { const { data } = await axios.get('/prescriptions/doctor'); setPrescriptions(data); }
    catch (e) { console.error(e); }
  };

  const fetchLabs = async () => {
    try { const { data } = await axios.get('/labs/doctor'); setLabs(data); }
    catch (e) { console.error(e); }
  };

  const handleStatus = async (id, status) => {
    try { await axios.put(`/appointments/${id}/status`, { status }); fetchAppointments(); }
    catch (e) { console.error(e); }
  };

  const handleMedicineChange = (index, field, value) => {
    const newList = [...medicineList];
    newList[index][field] = value;
    setMedicineList(newList);
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
      fetchAppointments(); fetchPrescriptions();
      setShowPrescribeForm(false);
      setMedicineList([{ name: '', dosage: '', frequency: '', duration: '' }]);
      setNotes(''); setSelectedAppointment(null);
    } catch (e) { console.error(e); }
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
      await axios.post('/labs', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchAppointments(); fetchLabs();
      setShowLabForm(false);
      setLabForm({ testName: '', notes: '', file: null });
      setSelectedLabAppointment(null);
    } catch (e) { console.error(e); }
  };

  const filteredAppointments = appointmentFilter === 'all'
    ? appointments
    : appointments.filter(a => a.status === appointmentFilter);

  const totalApts = appointments.length;
  const pendingApts = appointments.filter(a => a.status === 'pending').length;
  const approvedApts = appointments.filter(a => a.status === 'approved').length;
  const rejectedApts = appointments.filter(a => a.status === 'rejected').length;

  // ── Styles ──────────────────────────────────────────────────
  const pageStyle = {
    minHeight: '100vh',
    background: '#f1f5f9',
    marginLeft: '250px',
    padding: '32px',
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
    padding: '24px',
    marginBottom: '24px',
  };

  const statCardStyle = (bg, shadow) => ({
    background: bg,
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: shadow,
    flex: 1,
  });

  const iconBoxStyle = {
    width: '52px', height: '52px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', color: 'white', flexShrink: 0,
  };

  const tabStyle = (active) => ({
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    background: active ? '#3b82f6' : 'transparent',
    color: active ? 'white' : '#64748b',
    fontWeight: active ? 600 : 400,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    background: '#f8fafc',
    marginTop: '6px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
  };

  const badgeStyle = (status) => {
    const styles = {
      approved: { background: '#dcfce7', color: '#16a34a' },
      rejected: { background: '#fee2e2', color: '#dc2626' },
      pending:  { background: '#fef9c3', color: '#ca8a04' },
    };
    return { ...styles[status], padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 };
  };

  const thStyle = {
    padding: '12px 16px',
    fontSize: '12px', fontWeight: 600,
    color: '#64748b', textTransform: 'uppercase',
    letterSpacing: '0.5px', background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  };

  const tdStyle = {
    padding: '14px 16px',
    fontSize: '14px', color: '#374151',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle',
  };

  const filterBtnStyle = (active) => ({
    padding: '6px 16px',
    borderRadius: '20px',
    border: 'none',
    background: active ? '#3b82f6' : '#f1f5f9',
    color: active ? 'white' : '#64748b',
    fontSize: '13px', fontWeight: active ? 600 : 400,
    cursor: 'pointer', transition: 'all 0.2s',
  });

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.5)',
    zIndex: 2000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  const modalStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    width: '90%', maxWidth: '680px',
    maxHeight: '85vh', overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  };

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={pageStyle}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Good day, Dr. {user?.name}! 👨‍⚕️
          </h4>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
            {user?.specialization} • {user?.experience || 0} years experience
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={statCardStyle('linear-gradient(135deg, #3b82f6, #1d4ed8)', '0 4px 16px rgba(59,130,246,0.3)')}>
            <div style={iconBoxStyle}><FaCalendarCheck /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Total</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{totalApts}</div>
            </div>
          </div>
          <div style={statCardStyle('linear-gradient(135deg, #f59e0b, #d97706)', '0 4px 16px rgba(245,158,11,0.3)')}>
            <div style={iconBoxStyle}><FaClock /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Pending</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{pendingApts}</div>
            </div>
          </div>
          <div style={statCardStyle('linear-gradient(135deg, #10b981, #059669)', '0 4px 16px rgba(16,185,129,0.3)')}>
            <div style={iconBoxStyle}><FaCheckCircle /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Approved</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{approvedApts}</div>
            </div>
          </div>
          <div style={statCardStyle('linear-gradient(135deg, #ef4444, #dc2626)', '0 4px 16px rgba(239,68,68,0.3)')}>
            <div style={iconBoxStyle}><FaTimesCircle /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Rejected</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{rejectedApts}</div>
            </div>
          </div>
          <div style={statCardStyle('linear-gradient(135deg, #8b5cf6, #7c3aed)', '0 4px 16px rgba(139,92,246,0.3)')}>
            <div style={iconBoxStyle}><FaPills /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Prescriptions</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{prescriptions.length}</div>
            </div>
          </div>
          <div style={statCardStyle('linear-gradient(135deg, #06b6d4, #0891b2)', '0 4px 16px rgba(6,182,212,0.3)')}>
            <div style={iconBoxStyle}><FaFileUpload /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Lab Reports</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{labs.length}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ ...cardStyle, padding: '8px', marginBottom: '24px', display: 'inline-flex', gap: '4px' }}>
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'appointments', label: '📅 Appointments' },
            { key: 'prescriptions', label: '💊 Prescriptions' },
            { key: 'labs', label: '🔬 Lab Reports' },
            { key: 'profile', label: '👨‍⚕️ Profile' },
          ].map(tab => (
            <button key={tab.key} style={tabStyle(activeTab === tab.key)} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={cardStyle}>
              <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '16px', fontSize: '16px' }}>
                📅 Recent Appointments
              </h6>
              {appointments.slice(0, 5).length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No appointments yet</p>
              ) : appointments.slice(0, 5).map(apt => (
                <div key={apt._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{apt.patientId?.name}</div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>{new Date(apt.date).toLocaleDateString()} • {apt.reason?.slice(0, 30)}...</div>
                  </div>
                  <span style={badgeStyle(apt.status)}>{apt.status}</span>
                </div>
              ))}
            </div>

            <div style={cardStyle}>
              <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '16px', fontSize: '16px' }}>
                💊 Recent Prescriptions
              </h6>
              {prescriptions.slice(0, 5).length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No prescriptions yet</p>
              ) : prescriptions.slice(0, 5).map(presc => (
                <div key={presc._id} style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{presc.patientId?.name}</div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>{presc.medicines.map(m => m.name).join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h6 style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', margin: 0 }}>📅 Appointments</h6>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'pending', 'approved', 'rejected'].map(f => (
                  <button key={f} style={filterBtnStyle(appointmentFilter === f)} onClick={() => setAppointmentFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading...</div>
            ) : filteredAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No appointments found</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Patient', 'Date', 'Reason', 'Status', 'Actions'].map(h => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map(apt => (
                      <tr key={apt._id}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 600 }}>{apt.patientId?.name}</div>
                        </td>
                        <td style={tdStyle}>{new Date(apt.date).toLocaleDateString()}</td>
                        <td style={{ ...tdStyle, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.reason}</td>
                        <td style={tdStyle}><span style={badgeStyle(apt.status)}>{apt.status}</span></td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {apt.status === 'pending' && (<>
                              <button style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleStatus(apt._id, 'approved')}>✓ Approve</button>
                              <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleStatus(apt._id, 'rejected')}>✕ Reject</button>
                            </>)}
                            {apt.status === 'approved' && (<>
                              <button style={{ background: '#ede9fe', color: '#7c3aed', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => { setSelectedAppointment(apt); setShowPrescribeForm(true); window.scrollTo(0, 0); }}>💊 Rx</button>
                              <button style={{ background: '#cffafe', color: '#0891b2', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => { setSelectedLabAppointment(apt); setShowLabForm(true); window.scrollTo(0, 0); }}>🔬 Lab</button>
                            </>)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div style={cardStyle}>
            <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '20px', fontSize: '16px' }}>
              💊 Prescriptions Given
            </h6>
            {prescriptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <FaPills style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }} />
                <p>No prescriptions given yet</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>{['Patient', 'Medicines', 'Notes', 'Date'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {prescriptions.map(presc => (
                      <tr key={presc._id}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={tdStyle}><div style={{ fontWeight: 600 }}>{presc.patientId?.name}</div></td>
                        <td style={tdStyle}>
                          {presc.medicines.map((med, idx) => (
                            <div key={idx} style={{ background: '#f1f5f9', borderRadius: '6px', padding: '3px 10px', marginBottom: '4px', fontSize: '12px', display: 'inline-block', marginRight: '4px' }}>
                              {med.name} — {med.dosage}
                            </div>
                          ))}
                        </td>
                        <td style={{ ...tdStyle, color: '#64748b', fontSize: '13px' }}>{presc.notes || '—'}</td>
                        <td style={tdStyle}>{new Date(presc.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Lab Reports Tab */}
        {activeTab === 'labs' && (
          <div style={cardStyle}>
            <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '20px', fontSize: '16px' }}>
              🔬 Lab Reports Uploaded
            </h6>
            {labs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <FaFileUpload style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }} />
                <p>No lab reports uploaded yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {labs.map(lab => (
                  <div key={lab._id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1.5px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{lab.testName}</div>
                      <div style={{ background: '#cffafe', color: '#0891b2', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>Lab</div>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>Patient: {lab.patientId?.name}</div>
                    {lab.notes && <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '10px' }}>{lab.notes}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>{new Date(lab.createdAt).toLocaleDateString()}</span>
                      <a href={lab.fileUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#dbeafe', color: '#2563eb', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '500px' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: 'white', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}>
                  <FaUserMd />
                </div>
                <div>
                  <h5 style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>Dr. {user?.name}</h5>
                  <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>{user?.specialization}</p>
                </div>
              </div>
              {[
                { label: 'Email', value: user?.email },
                { label: 'Specialization', value: user?.specialization || 'Not specified' },
                { label: 'Experience', value: `${user?.experience || 0} years` },
                { label: 'Role', value: 'Doctor' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Prescribe Modal */}
      {showPrescribeForm && selectedAppointment && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h5 style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>
                💊 Prescribe for {selectedAppointment.patientId?.name}
              </h5>
              <button onClick={() => setShowPrescribeForm(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', color: '#64748b' }}>✕</button>
            </div>
            <form onSubmit={handlePrescribe}>
              <label style={labelStyle}>Medicines</label>
              {medicineList.map((med, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', marginTop: '10px', alignItems: 'center' }}>
                  <input style={inputStyle} type="text" placeholder="Medicine name" value={med.name} onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)} />
                  <input style={inputStyle} type="text" placeholder="Dosage" value={med.dosage} onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)} />
                  <input style={inputStyle} type="text" placeholder="Frequency" value={med.frequency} onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)} />
                  <input style={inputStyle} type="text" placeholder="Duration" value={med.duration} onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)} />
                  {medicineList.length > 1 && (
                    <button type="button" onClick={() => setMedicineList(medicineList.filter((_, i) => i !== idx))} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontWeight: 700 }}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setMedicineList([...medicineList, { name: '', dosage: '', frequency: '', duration: '' }])} style={{ marginTop: '12px', background: '#ede9fe', color: '#7c3aed', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                + Add Medicine
              </button>
              <div style={{ marginTop: '16px' }}>
                <label style={labelStyle}>Notes</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} placeholder="Additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </div>
              <button type="submit" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
                Create Prescription
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lab Upload Modal */}
      {showLabForm && selectedLabAppointment && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h5 style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>
                🔬 Upload Lab Report for {selectedLabAppointment.patientId?.name}
              </h5>
              <button onClick={() => setShowLabForm(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', color: '#64748b' }}>✕</button>
            </div>
            <form onSubmit={handleUploadLab}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Test Name</label>
                <input type="text" style={inputStyle} placeholder="e.g., Blood Test, X-Ray" value={labForm.testName} onChange={(e) => setLabForm({ ...labForm, testName: e.target.value })} required />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Upload File</label>
                <input type="file" style={inputStyle} onChange={(e) => setLabForm({ ...labForm, file: e.target.files[0] })} accept=".pdf,.jpg,.jpeg,.png" required />
                <small style={{ color: '#94a3b8', fontSize: '12px' }}>PDF, JPG, PNG accepted</small>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Notes</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} placeholder="Notes about the test..." value={labForm.notes} onChange={(e) => setLabForm({ ...labForm, notes: e.target.value })} rows={3} />
              </div>
              <button type="submit" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(6,182,212,0.3)' }}>
                Upload Lab Report
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard;