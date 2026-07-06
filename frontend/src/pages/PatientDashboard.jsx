import { useState, useEffect } from 'react';
import { FaCalendarPlus, FaCalendarCheck, FaClock, FaTimesCircle, FaPills, FaFileDownload, FaCheckCircle, FaHeartbeat } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import MedicalHistoryCard from '../components/MedicalHistoryCard';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labs, setLabs] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [formData, setFormData] = useState({ doctorId: '', date: '', reason: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    fetchPrescriptions();
    fetchLabs();
    fetchMedicalHistory();
  }, []);

  const fetchDoctors = async () => {
    try { const { data } = await axios.get('/users/doctors'); setDoctors(data); }
    catch (error) { console.error(error); }
  };

  const fetchAppointments = async () => {
    try { const { data } = await axios.get('/appointments/patient'); setAppointments(data); }
    catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const fetchPrescriptions = async () => {
    try { const { data } = await axios.get('/prescriptions/patient'); setPrescriptions(data); }
    catch (error) { console.error(error); }
  };

  const fetchLabs = async () => {
    try { const { data } = await axios.get('/labs/patient'); setLabs(data); }
    catch (error) { console.error(error); }
  };

  const fetchMedicalHistory = async () => {
    try {
      const { data } = await axios.get('/medical-histories');
      if (data && data.length > 0) {
        setMedicalHistory(data[0]);
      }
    } catch (e) {
      console.error('Error fetching history:', e);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDelete = async (id) => {
    try { await axios.delete(`/appointments/${id}`); fetchAppointments(); }
    catch (error) { console.error(error); }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('/appointments', formData);
      setSuccess('Appointment booked successfully!');
      setFormData({ doctorId: '', date: '', reason: '' });
      setSelectedDepartment('');
      fetchAppointments();
      setActiveTab('appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleFollowUp = (apt) => {
    setSelectedDepartment(apt.doctorId?.specialization);
    setFormData({ doctorId: apt.doctorId?._id, date: '', reason: `Follow-up: ${apt.reason}` });
    setActiveTab('book');
    window.scrollTo(0, 0);
  };

  const departments = [...new Set(doctors.map(doc => doc.specialization))].filter(Boolean);
  const doctorsInDepartment = selectedDepartment
    ? doctors.filter(doc => doc.specialization === selectedDepartment)
    : doctors;

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

  const iconBoxStyle = (bg) => ({
    width: '52px', height: '52px',
    background: bg,
    borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', color: 'white', flexShrink: 0,
  });

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
    transition: 'border 0.2s',
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
    return {
      ...styles[status],
      padding: '4px 12px', borderRadius: '20px',
      fontSize: '12px', fontWeight: 600,
    };
  };

  const btnPrimary = {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white', border: 'none',
    padding: '12px 24px', borderRadius: '10px',
    fontSize: '14px', fontWeight: 600,
    cursor: 'pointer', width: '100%',
    boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
  };

  const btnDanger = {
    background: '#fee2e2', color: '#dc2626',
    border: 'none', padding: '6px 14px',
    borderRadius: '8px', fontSize: '12px',
    fontWeight: 600, cursor: 'pointer',
  };

  const btnInfo = {
    background: '#dbeafe', color: '#2563eb',
    border: 'none', padding: '6px 14px',
    borderRadius: '8px', fontSize: '12px',
    fontWeight: 600, cursor: 'pointer',
  };

  const thStyle = {
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  };

  const tdStyle = {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle',
  };

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={pageStyle}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Welcome back, {user?.name}! 👋
          </h4>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
            Here's your health overview for today.
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={statCardStyle('linear-gradient(135deg, #3b82f6, #1d4ed8)', '0 4px 16px rgba(59,130,246,0.3)')}>
            <div style={iconBoxStyle('rgba(255,255,255,0.2)')}>
              <FaCalendarCheck />
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Total Appointments</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{totalApts}</div>
            </div>
          </div>

          <div style={statCardStyle('linear-gradient(135deg, #f59e0b, #d97706)', '0 4px 16px rgba(245,158,11,0.3)')}>
            <div style={iconBoxStyle('rgba(255,255,255,0.2)')}>
              <FaClock />
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Pending</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{pendingApts}</div>
            </div>
          </div>

          <div style={statCardStyle('linear-gradient(135deg, #10b981, #059669)', '0 4px 16px rgba(16,185,129,0.3)')}>
            <div style={iconBoxStyle('rgba(255,255,255,0.2)')}>
              <FaCheckCircle />
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Approved</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{approvedApts}</div>
            </div>
          </div>

          <div style={statCardStyle('linear-gradient(135deg, #ef4444, #dc2626)', '0 4px 16px rgba(239,68,68,0.3)')}>
            <div style={iconBoxStyle('rgba(255,255,255,0.2)')}>
              <FaTimesCircle />
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Rejected</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{rejectedApts}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ ...cardStyle, padding: '8px', marginBottom: '24px', display: 'inline-flex', gap: '4px' }}>
          {[
            { key: 'overview', label: '📋 Overview' },
            { key: 'book', label: '📅 Book Appointment' },
            { key: 'appointments', label: '🗓 My Appointments' },
            { key: 'prescriptions', label: '💊 Prescriptions' },
            { key: 'labs', label: '🔬 Lab Reports' },
            { key: 'history', label: '❤️ Medical History' },
          ].map(tab => (
            <button key={tab.key} style={tabStyle(activeTab === tab.key)} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Recent Appointments */}
            <div style={cardStyle}>
              <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '16px', fontSize: '16px' }}>
                📅 Recent Appointments
              </h6>
              {appointments.slice(0, 4).length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No appointments yet</p>
              ) : (
                appointments.slice(0, 4).map(apt => (
                  <div key={apt._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>Dr. {apt.doctorId?.name}</div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>{new Date(apt.date).toLocaleDateString()}</div>
                    </div>
                    <span style={badgeStyle(apt.status)}>{apt.status}</span>
                  </div>
                ))
              )}
            </div>

            {/* Recent Prescriptions */}
            <div style={cardStyle}>
              <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '16px', fontSize: '16px' }}>
                💊 Recent Prescriptions
              </h6>
              {prescriptions.slice(0, 4).length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No prescriptions yet</p>
              ) : (
                prescriptions.slice(0, 4).map(presc => (
                  <div key={presc._id} style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>Dr. {presc.doctorId?.name}</div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>
                      {presc.medicines.map(m => m.name).join(', ')}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Medical Info */}
            <div style={cardStyle}>
              <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#ef4444' }}><FaHeartbeat /></span> Quick Medical Info
              </h6>
              {!medicalHistory ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 12px' }}>No medical history record initialized.</p>
                  <button
                    onClick={() => setActiveTab('history')}
                    style={{
                      background: '#ede9fe',
                      color: '#7c3aed',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Set History Info
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Blood Group</span>
                    <strong style={{ color: '#0f172a', fontSize: '14px' }}>{medicalHistory.bloodGroup}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>BMI Value</span>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '12px',
                      color: medicalHistory.bmi < 18.5 ? '#2563eb' : medicalHistory.bmi < 25 ? '#16a34a' : medicalHistory.bmi < 30 ? '#ca8a04' : '#dc2626',
                      background: medicalHistory.bmi < 18.5 ? '#dbeafe' : medicalHistory.bmi < 25 ? '#dcfce7' : medicalHistory.bmi < 30 ? '#fef9c3' : '#fee2e2',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>{medicalHistory.bmi || '—'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Allergies</span>
                    <span style={{ color: '#0f172a', fontSize: '13px', textAlign: 'right', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {medicalHistory.allergies?.join(', ') || 'None'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Chronic Diseases</span>
                    <span style={{ color: '#0f172a', fontSize: '13px', textAlign: 'right', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {medicalHistory.chronicDiseases?.join(', ') || 'None'}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('history')}
                    style={{
                      background: '#e0f2fe',
                      color: '#0369a1',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginTop: '4px',
                      width: '100%'
                    }}
                  >
                    View Full Medical History
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Book Appointment Tab */}
        {activeTab === 'book' && (
          <div style={{ maxWidth: '560px' }}>
            <div style={cardStyle}>
              <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '20px', fontSize: '16px' }}>
                📅 Book New Appointment
              </h6>
              {success && (
                <div style={{ background: '#dcfce7', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
                  ✅ {success}
                </div>
              )}
              {error && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
                  ❌ {error}
                </div>
              )}
              <form onSubmit={handleBooking}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Select Department</label>
                  <select style={inputStyle} value={selectedDepartment} onChange={(e) => { setSelectedDepartment(e.target.value); setFormData({ ...formData, doctorId: '' }); }} required>
                    <option value="">Choose a department...</option>
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Select Doctor</label>
                  <select style={{ ...inputStyle, opacity: !selectedDepartment ? 0.6 : 1 }} name="doctorId" value={formData.doctorId} onChange={handleChange} disabled={!selectedDepartment} required>
                    <option value="">Choose a doctor...</option>
                    {doctorsInDepartment.map(doc => <option key={doc._id} value={doc._id}>Dr. {doc.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Date</label>
                  <input type="date" name="date" style={inputStyle} value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Reason for Visit</label>
                  <textarea name="reason" style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }} placeholder="Describe your symptoms..." value={formData.reason} onChange={handleChange} rows={3} required />
                </div>
                <button type="submit" style={btnPrimary}>Book Appointment</button>
              </form>
            </div>
          </div>
        )}

        {/* My Appointments Tab */}
        {activeTab === 'appointments' && (
          <div style={cardStyle}>
            <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '20px', fontSize: '16px' }}>
              🗓 My Appointments
            </h6>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading...</div>
            ) : appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <FaCalendarCheck style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }} />
                <p>No appointments yet</p>
                <button style={{ ...btnPrimary, width: 'auto', padding: '10px 20px' }} onClick={() => setActiveTab('book')}>
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Doctor', 'Department', 'Date', 'Reason', 'Status', 'Action'].map(h => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(apt => (
                      <tr key={apt._id} style={{ transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 600 }}>Dr. {apt.doctorId?.name}</div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>{apt.doctorId?.specialization}</div>
                        </td>
                        <td style={tdStyle}>{apt.doctorId?.specialization}</td>
                        <td style={tdStyle}>{new Date(apt.date).toLocaleDateString()}</td>
                        <td style={{ ...tdStyle, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.reason}</td>
                        <td style={tdStyle}><span style={badgeStyle(apt.status)}>{apt.status}</span></td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {apt.status === 'pending' && (
                              <button style={btnDanger} onClick={() => handleDelete(apt._id)}>Cancel</button>
                            )}
                            {apt.status === 'approved' && (
                              <button style={btnInfo} onClick={() => handleFollowUp(apt)}>Follow-up</button>
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
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div style={cardStyle}>
            <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '20px', fontSize: '16px' }}>
              💊 My Prescriptions
            </h6>
            {prescriptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <FaPills style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }} />
                <p>No prescriptions yet</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Doctor', 'Medicines', 'Notes', 'Date'].map(h => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map(presc => (
                      <tr key={presc._id}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 600 }}>Dr. {presc.doctorId?.name}</div>
                        </td>
                        <td style={tdStyle}>
                          {presc.medicines.map((med, idx) => (
                            <div key={idx} style={{ background: '#f1f5f9', borderRadius: '6px', padding: '4px 10px', marginBottom: '4px', fontSize: '12px', display: 'inline-block', marginRight: '4px' }}>
                              {med.name} — {med.dosage}, {med.frequency}, {med.duration}
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
              🔬 My Lab Reports
            </h6>
            {labs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <FaFileDownload style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }} />
                <p>No lab reports yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {labs.map(lab => (
                  <div key={lab._id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1.5px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{lab.testName}</div>
                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Dr. {lab.doctorId?.name}</div>
                      </div>
                      <div style={{ background: '#dbeafe', color: '#2563eb', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                        Report
                      </div>
                    </div>
                    {lab.notes && <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '12px' }}>{lab.notes}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>{new Date(lab.createdAt).toLocaleDateString()}</span>
                      <a href={lab.fileUrl} download={lab.fileName || 'lab-report'} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}>
                        ⬇ Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Medical History Tab */}
        {activeTab === 'history' && (
          <MedicalHistoryCard
            history={medicalHistory}
            canEdit={false}
          />
        )}

      </div>
    </div>
  );
};

export default PatientDashboard;