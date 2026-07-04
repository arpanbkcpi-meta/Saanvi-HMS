import { useState, useEffect } from 'react';
import { FaUserMd, FaUsers, FaTrash, FaSort, FaPlus, FaUserShield, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
  const [activeTab, setActiveTab] = useState('overview');
  const [doctorForm, setDoctorForm] = useState({ name: '', email: '', password: '', specialization: '', experience: '', phone: '' });
  const [patientForm, setPatientForm] = useState({ name: '', email: '', password: '', age: '', gender: 'male', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const itemsPerPage = 5;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [docsRes, patientsRes] = await Promise.all([
        axios.get('/users/doctors'),
        axios.get('/users/patients')
      ]);
      setDoctors(docsRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      const { data } = await axios.post('/users/doctor', doctorForm);
      setDoctors([...doctors, data]);
      setDoctorForm({ name: '', email: '', password: '', specialization: '', experience: '', phone: '' });
      setShowAddDoctor(false);
      setSuccess('Doctor added successfully!');
    } catch (err) { setError(err.response?.data?.message || 'Failed to add doctor'); }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      const { data } = await axios.post('/users/patient', patientForm);
      setPatients([...patients, data]);
      setPatientForm({ name: '', email: '', password: '', age: '', gender: 'male', phone: '' });
      setShowAddPatient(false);
      setSuccess('Patient added successfully!');
    } catch (err) { setError(err.response?.data?.message || 'Failed to add patient'); }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Delete this doctor?')) {
      try { await axios.delete(`/users/${id}`); setDoctors(doctors.filter(d => d._id !== id)); }
      catch (error) { console.error(error); }
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Delete this patient?')) {
      try { await axios.delete(`/users/${id}`); setPatients(patients.filter(p => p._id !== id)); }
      catch (error) { console.error(error); }
    }
  };

  const sortedDoctors = [...doctors].sort((a, b) =>
    doctorSort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
  const doctorStartIdx = (doctorPage - 1) * itemsPerPage;
  const paginatedDoctors = sortedDoctors.slice(doctorStartIdx, doctorStartIdx + itemsPerPage);
  const doctorPages = Math.ceil(sortedDoctors.length / itemsPerPage);

  const sortedPatients = [...patients].sort((a, b) =>
    patientSort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
  const patientStartIdx = (patientPage - 1) * itemsPerPage;
  const paginatedPatients = sortedPatients.slice(patientStartIdx, patientStartIdx + itemsPerPage);
  const patientPages = Math.ceil(sortedPatients.length / itemsPerPage);

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
    background: bg, borderRadius: '16px',
    padding: '24px', display: 'flex',
    alignItems: 'center', gap: '16px',
    boxShadow: shadow, flex: 1,
  });

  const iconBoxStyle = {
    width: '52px', height: '52px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '14px',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px', color: 'white', flexShrink: 0,
  };

  const tabStyle = (active) => ({
    padding: '10px 20px', borderRadius: '10px',
    border: 'none',
    background: active ? '#3b82f6' : 'transparent',
    color: active ? 'white' : '#64748b',
    fontWeight: active ? 600 : 400,
    fontSize: '14px', cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    borderRadius: '10px', border: '1.5px solid #e2e8f0',
    fontSize: '14px', outline: 'none',
    background: '#f8fafc', marginTop: '6px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '13px', fontWeight: 600, color: '#374151',
  };

  const thStyle = {
    padding: '12px 16px', fontSize: '12px',
    fontWeight: 600, color: '#64748b',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
  };

  const tdStyle = {
    padding: '14px 16px', fontSize: '14px',
    color: '#374151', borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle',
  };

  const btnPrimary = {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white', border: 'none',
    padding: '10px 20px', borderRadius: '10px',
    fontSize: '13px', fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
    display: 'flex', alignItems: 'center', gap: '6px',
  };

  const btnSuccess = {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white', border: 'none',
    padding: '10px 20px', borderRadius: '10px',
    fontSize: '13px', fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
    display: 'flex', alignItems: 'center', gap: '6px',
  };

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.5)',
    zIndex: 2000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  const modalStyle = {
    background: 'white', borderRadius: '20px',
    padding: '32px', width: '90%', maxWidth: '500px',
    maxHeight: '85vh', overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  };

  const paginationBtnStyle = (disabled) => ({
    background: disabled ? '#f1f5f9' : 'white',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px', padding: '6px 12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? '#94a3b8' : '#374151',
    fontSize: '13px', fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: '4px',
  });

  const FormModal = ({ title, onClose, onSubmit, children, btnLabel, btnColor }) => (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h5 style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</h5>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', color: '#64748b' }}>✕</button>
        </div>
        <form onSubmit={onSubmit}>
          {children}
          <button type="submit" style={{ marginTop: '20px', background: btnColor, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
            {btnLabel}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={pageStyle}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Admin Dashboard 👨‍💼
          </h4>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
            Manage doctors, patients, and system settings.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
            ❌ {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
            ✅ {success}
          </div>
        )}

        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={statCardStyle('linear-gradient(135deg, #3b82f6, #1d4ed8)', '0 4px 16px rgba(59,130,246,0.3)')}>
            <div style={iconBoxStyle}><FaUserMd /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Total Doctors</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{doctors.length}</div>
            </div>
          </div>
          <div style={statCardStyle('linear-gradient(135deg, #10b981, #059669)', '0 4px 16px rgba(16,185,129,0.3)')}>
            <div style={iconBoxStyle}><FaUsers /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Total Patients</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{patients.length}</div>
            </div>
          </div>
          <div style={statCardStyle('linear-gradient(135deg, #8b5cf6, #7c3aed)', '0 4px 16px rgba(139,92,246,0.3)')}>
            <div style={iconBoxStyle}><FaUserShield /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Total Users</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{doctors.length + patients.length}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ ...cardStyle, padding: '8px', marginBottom: '24px', display: 'inline-flex', gap: '4px' }}>
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'doctors', label: '👨‍⚕️ Doctors' },
            { key: 'patients', label: '👥 Patients' },
          ].map(tab => (
            <button key={tab.key} style={tabStyle(activeTab === tab.key)} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Recent Doctors */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h6 style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', margin: 0 }}>👨‍⚕️ Recent Doctors</h6>
                <button style={btnPrimary} onClick={() => setActiveTab('doctors')}>View All</button>
              </div>
              {doctors.slice(0, 5).length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No doctors yet</p>
              ) : doctors.slice(0, 5).map(doc => (
                <div key={doc._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>Dr. {doc.name}</div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>{doc.specialization || 'General'}</div>
                  </div>
                  <div style={{ background: '#dbeafe', color: '#2563eb', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>Doctor</div>
                </div>
              ))}
            </div>

            {/* Recent Patients */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h6 style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', margin: 0 }}>👥 Recent Patients</h6>
                <button style={btnSuccess} onClick={() => setActiveTab('patients')}>View All</button>
              </div>
              {patients.slice(0, 5).length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No patients yet</p>
              ) : patients.slice(0, 5).map(pat => (
                <div key={pat._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{pat.name}</div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>Age: {pat.age || '-'} • {pat.gender || '-'}</div>
                  </div>
                  <div style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>Patient</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h6 style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', margin: 0 }}>👨‍⚕️ Doctors ({doctors.length})</h6>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ background: '#f1f5f9', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => setDoctorSort(doctorSort === 'asc' ? 'desc' : 'asc')}>
                  <FaSort /> Sort {doctorSort === 'asc' ? 'A→Z' : 'Z→A'}
                </button>
                <button style={btnPrimary} onClick={() => setShowAddDoctor(true)}>
                  <FaPlus /> Add Doctor
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading...</div>
            ) : doctors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <FaUserMd style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }} />
                <p>No doctors yet</p>
                <button style={btnPrimary} onClick={() => setShowAddDoctor(true)}><FaPlus /> Add First Doctor</button>
              </div>
            ) : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>{['Name', 'Email', 'Specialization', 'Experience', 'Phone', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {paginatedDoctors.map(doc => (
                        <tr key={doc._id}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                                {doc.name.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 600 }}>Dr. {doc.name}</span>
                            </div>
                          </td>
                          <td style={{ ...tdStyle, color: '#64748b' }}>{doc.email}</td>
                          <td style={tdStyle}>
                            <span style={{ background: '#dbeafe', color: '#2563eb', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                              {doc.specialization || 'General'}
                            </span>
                          </td>
                          <td style={{ ...tdStyle, color: '#64748b' }}>{doc.experience || 0} yrs</td>
                          <td style={{ ...tdStyle, color: '#64748b' }}>{doc.phone || '-'}</td>
                          <td style={tdStyle}>
                            <button onClick={() => handleDeleteDoctor(doc._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FaTrash size={11} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {doctorPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>
                      Showing {doctorStartIdx + 1}–{Math.min(doctorStartIdx + itemsPerPage, sortedDoctors.length)} of {sortedDoctors.length}
                    </span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button style={paginationBtnStyle(doctorPage === 1)} onClick={() => setDoctorPage(p => Math.max(1, p - 1))} disabled={doctorPage === 1}>
                        <FaChevronLeft size={11} /> Prev
                      </button>
                      {Array.from({ length: doctorPages }, (_, i) => i + 1).map(pg => (
                        <button key={pg} onClick={() => setDoctorPage(pg)} style={{ background: doctorPage === pg ? '#3b82f6' : 'white', color: doctorPage === pg ? 'white' : '#374151', border: '1.5px solid', borderColor: doctorPage === pg ? '#3b82f6' : '#e2e8f0', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '13px', fontWeight: doctorPage === pg ? 600 : 400 }}>
                          {pg}
                        </button>
                      ))}
                      <button style={paginationBtnStyle(doctorPage === doctorPages)} onClick={() => setDoctorPage(p => Math.min(doctorPages, p + 1))} disabled={doctorPage === doctorPages}>
                        Next <FaChevronRight size={11} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h6 style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', margin: 0 }}>👥 Patients ({patients.length})</h6>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ background: '#f1f5f9', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => setPatientSort(patientSort === 'asc' ? 'desc' : 'asc')}>
                  <FaSort /> Sort {patientSort === 'asc' ? 'A→Z' : 'Z→A'}
                </button>
                <button style={btnSuccess} onClick={() => setShowAddPatient(true)}>
                  <FaPlus /> Add Patient
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading...</div>
            ) : patients.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <FaUsers style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }} />
                <p>No patients yet</p>
                <button style={btnSuccess} onClick={() => setShowAddPatient(true)}><FaPlus /> Add First Patient</button>
              </div>
            ) : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>{['Name', 'Email', 'Age', 'Gender', 'Phone', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {paginatedPatients.map(pat => (
                        <tr key={pat._id}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                                {pat.name.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 600 }}>{pat.name}</span>
                            </div>
                          </td>
                          <td style={{ ...tdStyle, color: '#64748b' }}>{pat.email}</td>
                          <td style={tdStyle}>{pat.age || '-'}</td>
                          <td style={tdStyle}>
                            <span style={{ background: pat.gender === 'female' ? '#fce7f3' : '#dbeafe', color: pat.gender === 'female' ? '#be185d' : '#2563eb', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                              {pat.gender || '-'}
                            </span>
                          </td>
                          <td style={{ ...tdStyle, color: '#64748b' }}>{pat.phone || '-'}</td>
                          <td style={tdStyle}>
                            <button onClick={() => handleDeletePatient(pat._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FaTrash size={11} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {patientPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>
                      Showing {patientStartIdx + 1}–{Math.min(patientStartIdx + itemsPerPage, sortedPatients.length)} of {sortedPatients.length}
                    </span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button style={paginationBtnStyle(patientPage === 1)} onClick={() => setPatientPage(p => Math.max(1, p - 1))} disabled={patientPage === 1}>
                        <FaChevronLeft size={11} /> Prev
                      </button>
                      {Array.from({ length: patientPages }, (_, i) => i + 1).map(pg => (
                        <button key={pg} onClick={() => setPatientPage(pg)} style={{ background: patientPage === pg ? '#10b981' : 'white', color: patientPage === pg ? 'white' : '#374151', border: '1.5px solid', borderColor: patientPage === pg ? '#10b981' : '#e2e8f0', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '13px', fontWeight: patientPage === pg ? 600 : 400 }}>
                          {pg}
                        </button>
                      ))}
                      <button style={paginationBtnStyle(patientPage === patientPages)} onClick={() => setPatientPage(p => Math.min(patientPages, p + 1))} disabled={patientPage === patientPages}>
                        Next <FaChevronRight size={11} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <FormModal title="👨‍⚕️ Add New Doctor" onClose={() => setShowAddDoctor(false)} onSubmit={handleAddDoctor} btnLabel="Add Doctor" btnColor="linear-gradient(135deg, #3b82f6, #1d4ed8)">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Dr. John Smith' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'doctor@hospital.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
            { label: 'Specialization', key: 'specialization', type: 'text', placeholder: 'e.g., Cardiologist' },
            { label: 'Experience (years)', key: 'experience', type: 'number', placeholder: 'e.g., 5' },
            { label: 'Phone', key: 'phone', type: 'text', placeholder: 'e.g., 9800000001' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>{field.label}</label>
              <input type={field.type} style={inputStyle} placeholder={field.placeholder} value={doctorForm[field.key]} onChange={e => setDoctorForm({ ...doctorForm, [field.key]: e.target.value })} required={['name', 'email', 'password'].includes(field.key)} />
            </div>
          ))}
        </FormModal>
      )}

      {/* Add Patient Modal */}
      {showAddPatient && (
        <FormModal title="👥 Add New Patient" onClose={() => setShowAddPatient(false)} onSubmit={handleAddPatient} btnLabel="Add Patient" btnColor="linear-gradient(135deg, #10b981, #059669)">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Patient Name' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'patient@email.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
            { label: 'Age', key: 'age', type: 'number', placeholder: 'e.g., 28' },
            { label: 'Phone', key: 'phone', type: 'text', placeholder: 'e.g., 9800000002' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>{field.label}</label>
              <input type={field.type} style={inputStyle} placeholder={field.placeholder} value={patientForm[field.key]} onChange={e => setPatientForm({ ...patientForm, [field.key]: e.target.value })} required={['name', 'email', 'password'].includes(field.key)} />
            </div>
          ))}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Gender</label>
            <select style={inputStyle} value={patientForm.gender} onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </FormModal>
      )}

    </div>
  );
};

export default AdminDashboard;