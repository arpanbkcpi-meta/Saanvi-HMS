import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { FaUserMd, FaUsers, FaTrash, FaSort, FaPlus, FaUserShield, FaChevronLeft, FaChevronRight, FaCalendarCheck, FaSearch } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

// ============================================================
// 🔥 FIXED: FormModal moved OUTSIDE AdminDashboard
// This prevents React from remounting the modal on every keystroke
// ============================================================

// ── Styles needed by FormModal ──
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

// ── Reusable Modal Component ──
const FormModal = ({ title, onClose, onSubmit, children, btnLabel, btnColor }) => (
  <div style={overlayStyle} onClick={onClose}>
    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
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

// ============================================================
// ADMIN DASHBOARD
// Handles: Doctor/Patient management (CRUD), system-wide
// appointment oversight (search/sort/pagination), and quick
// navigation to a patient's Medical History (EMR).
// ============================================================
const AdminDashboard = () => {
  const navigate = useNavigate();

  // ── Core data lists (fetched once on load via fetchData) ──
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ D1: NEW STATE for Lab Tests and Lab Techs
  const [labTests, setLabTests] = useState([]);
  const [labTechs, setLabTechs] = useState([]);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showAddLabTech, setShowAddLabTech] = useState(false);
  const [testForm, setTestForm] = useState({ name: '', category: '', price: '', normalRange: '', description: '' });
  const [labTechForm, setLabTechForm] = useState({ name: '', email: '', password: '', phone: '' });

  // ── Doctors tab: sort + pagination state ──
  const [doctorSort, setDoctorSort] = useState('asc');
  const [doctorPage, setDoctorPage] = useState(1);

  // ── Patients tab: sort + pagination state ──
  const [patientSort, setPatientSort] = useState('asc');
  const [patientPage, setPatientPage] = useState(1);

  // ── Appointments tab: search + status filter + sort + pagination ──
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentSort, setAppointmentSort] = useState('date-desc');
  const [appointmentPage, setAppointmentPage] = useState(1);
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('all');

  // ── Modal visibility toggles ──
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);

  // ── Which top-level tab is currently active ──
  const [activeTab, setActiveTab] = useState('overview');

  // ── Add Doctor / Add Patient form data ──
  const [doctorForm, setDoctorForm] = useState({ name: '', email: '', password: '', specialization: '', experience: '', phone: '' });
  const [patientForm, setPatientForm] = useState({ name: '', email: '', password: '', age: '', gender: 'male', phone: '' });

  // ── Alert banners (kept for backward compatibility; toasts now handle most feedback) ──
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const itemsPerPage = 5; // shared page size for all 3 paginated tables

  // Fetch everything once, when the dashboard first mounts
  useEffect(() => { fetchData(); }, []);

  // ✅ D2: UPDATED fetchData with lab tests and lab techs
  const fetchData = async () => {
    try {
      const [docsRes, patientsRes, appointmentsRes, testsRes, techsRes] = await Promise.all([
        axios.get('/users/doctors'),
        axios.get('/users/patients'),
        axios.get('/appointments'), // admin-only: returns EVERY appointment in the system
        axios.get('/lab-tests/admin'), // ✅ NEW: Get all lab tests (including inactive)
        axios.get('/users/labtechs'), // ✅ NEW: Get all lab technicians
      ]);
      setDoctors(docsRes.data);
      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
      setLabTests(testsRes.data); // ✅ NEW
      setLabTechs(techsRes.data); // ✅ NEW
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Admin creates a new doctor account directly (no self-registration)
  const handleAddDoctor = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      const { data } = await axios.post('/users/doctor', doctorForm);
      setDoctors([...doctors, data]); // append the new doctor without a full re-fetch
      setDoctorForm({ name: '', email: '', password: '', specialization: '', experience: '', phone: '' });
      setShowAddDoctor(false);
      setSuccess('Doctor added successfully!');
      toast.success('Doctor added successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add doctor';
      setError(message);
      toast.error(message);
    }
  };

  // Admin creates a new patient account directly
  const handleAddPatient = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      const { data } = await axios.post('/users/patient', patientForm);
      setPatients([...patients, data]);
      setPatientForm({ name: '', email: '', password: '', age: '', gender: 'male', phone: '' });
      setShowAddPatient(false);
      setSuccess('Patient added successfully!');
      toast.success('Patient added successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add patient';
      setError(message);
      toast.error(message);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Delete this doctor?')) {
      try {
        await axios.delete(`/users/${id}`);
        setDoctors(doctors.filter(d => d._id !== id));
        toast.success('Doctor deleted');
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete doctor');
      }
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Delete this patient?')) {
      try {
        await axios.delete(`/users/${id}`);
        setPatients(patients.filter(p => p._id !== id));
        toast.success('Patient deleted');
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete patient');
      }
    }
  };

  // ✅ D3: NEW HANDLERS for Lab Tests and Lab Techs
  const handleAddTest = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/lab-tests', testForm);
      setLabTests([...labTests, data]);
      setTestForm({ name: '', category: '', price: '', normalRange: '', description: '' });
      setShowAddTest(false);
      toast.success('Lab test added to catalog');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add test');
    }
  };

  // ✅ FIXED: Specific handler for test form inputs
  const handleTestFormChange = (e) => {
    const { name, value } = e.target;
    setTestForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeactivateTest = async (id) => {
    if (window.confirm('Remove this test from the catalog?')) {
      try {
        await axios.delete(`/lab-tests/${id}`);
        setLabTests(labTests.map(t => t._id === id ? { ...t, isActive: false } : t));
        toast.success('Test removed from catalog');
      } catch (err) {
        toast.error('Failed to remove test');
      }
    }
  };

  const handleAddLabTech = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/users/labtech', labTechForm);
      setLabTechs([...labTechs, data]);
      setLabTechForm({ name: '', email: '', password: '', phone: '' });
      setShowAddLabTech(false);
      toast.success('Lab technician added successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lab technician');
    }
  };

  // ============================================================
  // DOCTORS: sort (A-Z / Z-A) then slice into the current page
  // ============================================================
  const sortedDoctors = [...doctors].sort((a, b) =>
    doctorSort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
  const doctorStartIdx = (doctorPage - 1) * itemsPerPage;
  const paginatedDoctors = sortedDoctors.slice(doctorStartIdx, doctorStartIdx + itemsPerPage);
  const doctorPages = Math.ceil(sortedDoctors.length / itemsPerPage);

  // ============================================================
  // PATIENTS: sort (A-Z / Z-A) then slice into the current page
  // ============================================================
  const sortedPatients = [...patients].sort((a, b) =>
    patientSort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
  const patientStartIdx = (patientPage - 1) * itemsPerPage;
  const paginatedPatients = sortedPatients.slice(patientStartIdx, patientStartIdx + itemsPerPage);
  const patientPages = Math.ceil(sortedPatients.length / itemsPerPage);

  // ============================================================
  // APPOINTMENTS: filter (search text + status) → sort → paginate
  // ============================================================

  // Step 1: keep only appointments matching BOTH the free-text search
  // AND the selected status filter. Search checks patient name, doctor
  // name, and reason — case-insensitively.
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = appointmentSearch === '' ||
      apt.patientId?.name?.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.doctorId?.name?.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.reason?.toLowerCase().includes(appointmentSearch.toLowerCase());

    const matchesStatus = appointmentStatusFilter === 'all' || apt.status === appointmentStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Step 2: sort the filtered results based on the selected dropdown option
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    switch (appointmentSort) {
      case 'date-desc': return new Date(b.date) - new Date(a.date);   // newest first
      case 'date-asc': return new Date(a.date) - new Date(b.date);    // oldest first
      case 'patient-asc': return (a.patientId?.name || '').localeCompare(b.patientId?.name || '');
      case 'patient-desc': return (b.patientId?.name || '').localeCompare(a.patientId?.name || '');
      default: return 0;
    }
  });

  // Step 3: slice out just the current page's worth of results
  const appointmentStartIdx = (appointmentPage - 1) * itemsPerPage;
  const paginatedAppointments = sortedAppointments.slice(appointmentStartIdx, appointmentStartIdx + itemsPerPage);
  const appointmentPages = Math.ceil(sortedAppointments.length / itemsPerPage);

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

  // ❌ DELETED: overlayStyle and modalStyle from here (moved outside)

  const paginationBtnStyle = (disabled) => ({
    background: disabled ? '#f1f5f9' : 'white',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px', padding: '6px 12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? '#94a3b8' : '#374151',
    fontSize: '13px', fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: '4px',
  });

  // ❌ DELETED: FormModal from here (moved outside)

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

        {/* Stat Cards — quick totals for all 4 tracked entities */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={statCardStyle('linear-gradient(135deg, #3b82f6, #1d4ed8)', '0 4px 16px rgba(59,130,246,0.3)')}>
            <div style={iconBoxStyle}><FaUserMd /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.3px' }}>Total Doctors</div>
              <div style={{ color: 'white', fontSize: '32px', fontWeight: 800, lineHeight: 1.1, marginTop: '2px' }}>{doctors.length}</div>
            </div>
          </div>
          <div style={statCardStyle('linear-gradient(135deg, #10b981, #059669)', '0 4px 16px rgba(16,185,129,0.3)')}>
            <div style={iconBoxStyle}><FaUsers /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.3px' }}>Total Patients</div>
              <div style={{ color: 'white', fontSize: '32px', fontWeight: 800, lineHeight: 1.1, marginTop: '2px' }}>{patients.length}</div>
            </div>
          </div>
          <div style={statCardStyle('linear-gradient(135deg, #8b5cf6, #7c3aed)', '0 4px 16px rgba(139,92,246,0.3)')}>
            <div style={iconBoxStyle}><FaUserShield /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.3px' }}>Total Users</div>
              <div style={{ color: 'white', fontSize: '32px', fontWeight: 800, lineHeight: 1.1, marginTop: '2px' }}>{doctors.length + patients.length}</div>
            </div>
          </div>
          <div style={statCardStyle('linear-gradient(135deg, #f59e0b, #d97706)', '0 4px 16px rgba(245,158,11,0.3)')}>
            <div style={iconBoxStyle}><FaCalendarCheck /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.3px' }}>Total Appointments</div>
              <div style={{ color: 'white', fontSize: '32px', fontWeight: 800, lineHeight: 1.1, marginTop: '2px' }}>{appointments.length}</div>
            </div>
          </div>
        </div>

        {/* ✅ D4: Tab Switcher - ADDED Lab Catalog and Lab Techs tabs */}
        <div style={{ ...cardStyle, padding: '8px', marginBottom: '24px', display: 'inline-flex', gap: '4px' }}>
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'doctors', label: '👨‍⚕️ Doctors' },
            { key: 'patients', label: '👥 Patients' },
            { key: 'appointments', label: '📅 Appointments' },
            { key: 'labtests', label: '🧪 Lab Catalog' },    // ✅ NEW
            { key: 'labtechs', label: '👩‍🔬 Lab Techs' },    // ✅ NEW
          ].map(tab => (
            <button key={tab.key} style={tabStyle(activeTab === tab.key)} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================================
            OVERVIEW TAB — quick glance at the 5 most recent doctors
            and patients, with "View All" shortcuts into their full tabs
           ============================================================ */}
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

        {/* ============================================================
            DOCTORS TAB — full list, sortable A↔Z, paginated 5/page
           ============================================================ */}
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

        {/* ============================================================
            PATIENTS TAB — full list, sortable A↔Z, paginated 5/page,
            plus a quick shortcut into that patient's Medical History (EMR)
           ============================================================ */}
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
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {/* Jumps to the Medical History page, passing this patient's ID via route state */}
                              <button onClick={() => navigate('/medical-history', { state: { patientId: pat._id } })} style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                ❤️ EMR
                              </button>
                              <button onClick={() => handleDeletePatient(pat._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FaTrash size={11} /> Delete
                              </button>
                            </div>
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

        {/* ============================================================
            APPOINTMENTS TAB — system-wide view (all patients/doctors),
            with live search, status filter, sort dropdown, and pagination
           ============================================================ */}
        {activeTab === 'appointments' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h6 style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', margin: 0 }}>
                📅 All Appointments ({sortedAppointments.length})
              </h6>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {/* Live search box — filters as you type, resets to page 1 on each keystroke */}
                <div style={{ position: 'relative' }}>
                  <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px' }} />
                  <input
                    type="text"
                    placeholder="Search patient, doctor, reason..."
                    value={appointmentSearch}
                    onChange={(e) => { setAppointmentSearch(e.target.value); setAppointmentPage(1); }}
                    style={{ padding: '8px 12px 8px 34px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', width: '220px' }}
                  />
                </div>

                {/* Status filter — All / Pending / Approved / Rejected */}
                <select
                  value={appointmentStatusFilter}
                  onChange={(e) => { setAppointmentStatusFilter(e.target.value); setAppointmentPage(1); }}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* Sort dropdown — by date (newest/oldest) or patient name (A-Z/Z-A) */}
                <select
                  value={appointmentSort}
                  onChange={(e) => setAppointmentSort(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="patient-asc">Patient A→Z</option>
                  <option value="patient-desc">Patient Z→A</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading...</div>
            ) : sortedAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <FaCalendarCheck style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }} />
                <p>No appointments found</p>
              </div>
            ) : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>{['Patient', 'Doctor', 'Date', 'Reason', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {paginatedAppointments.map(apt => (
                        <tr key={apt._id}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={tdStyle}>
                            <div style={{ fontWeight: 600 }}>{apt.patientId?.name || 'Unknown'}</div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>{apt.patientId?.email}</div>
                          </td>
                          <td style={tdStyle}>
                            <div style={{ fontWeight: 600 }}>Dr. {apt.doctorId?.name || 'Unknown'}</div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>{apt.doctorId?.specialization}</div>
                          </td>
                          <td style={tdStyle}>{new Date(apt.date).toLocaleDateString()}</td>
                          <td style={{ ...tdStyle, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.reason}</td>
                          <td style={tdStyle}>
                            <span style={{
                              background: apt.status === 'approved' ? '#dcfce7' : apt.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                              color: apt.status === 'approved' ? '#16a34a' : apt.status === 'rejected' ? '#dc2626' : '#ca8a04',
                              padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600
                            }}>
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {appointmentPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>
                      Showing {appointmentStartIdx + 1}–{Math.min(appointmentStartIdx + itemsPerPage, sortedAppointments.length)} of {sortedAppointments.length}
                    </span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button style={paginationBtnStyle(appointmentPage === 1)} onClick={() => setAppointmentPage(p => Math.max(1, p - 1))} disabled={appointmentPage === 1}>
                        <FaChevronLeft size={11} /> Prev
                      </button>
                      {Array.from({ length: appointmentPages }, (_, i) => i + 1).map(pg => (
                        <button key={pg} onClick={() => setAppointmentPage(pg)} style={{ background: appointmentPage === pg ? '#f59e0b' : 'white', color: appointmentPage === pg ? 'white' : '#374151', border: '1.5px solid', borderColor: appointmentPage === pg ? '#f59e0b' : '#e2e8f0', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '13px', fontWeight: appointmentPage === pg ? 600 : 400 }}>
                          {pg}
                        </button>
                      ))}
                      <button style={paginationBtnStyle(appointmentPage === appointmentPages)} onClick={() => setAppointmentPage(p => Math.min(appointmentPages, p + 1))} disabled={appointmentPage === appointmentPages}>
                        Next <FaChevronRight size={11} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ============================================================
            ✅ D5: LAB CATALOG TAB — Manage lab tests
           ============================================================ */}
        {activeTab === 'labtests' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h6 style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', margin: 0 }}>
                🧪 Lab Test Catalog ({labTests.filter(t => t.isActive).length} active)
              </h6>
              <button style={btnPrimary} onClick={() => setShowAddTest(true)}>
                <FaPlus /> Add Test
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['Test Name', 'Category', 'Price', 'Normal Range', 'Status', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {labTests.map(test => (
                    <tr key={test._id}>
                      <td style={tdStyle}><strong>{test.name}</strong></td>
                      <td style={tdStyle}>{test.category}</td>
                      <td style={tdStyle}>Rs. {test.price}</td>
                      <td style={{ ...tdStyle, color: '#64748b', fontSize: '13px' }}>{test.normalRange || '—'}</td>
                      <td style={tdStyle}>
                        <span style={{ 
                          background: test.isActive ? '#dcfce7' : '#fee2e2', 
                          color: test.isActive ? '#16a34a' : '#dc2626', 
                          padding: '3px 10px', 
                          borderRadius: '20px', 
                          fontSize: '12px', 
                          fontWeight: 600 
                        }}>
                          {test.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {test.isActive && (
                          <button onClick={() => handleDeactivateTest(test._id)} 
                            style={{ 
                              background: '#fee2e2', 
                              color: '#dc2626', 
                              border: 'none', 
                              padding: '6px 12px', 
                              borderRadius: '8px', 
                              cursor: 'pointer', 
                              fontSize: '13px', 
                              fontWeight: 600 
                            }}>
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================
            ✅ D6: LAB TECHS TAB — Manage lab technicians
           ============================================================ */}
        {activeTab === 'labtechs' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h6 style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', margin: 0 }}>
                👩‍🔬 Lab Technicians ({labTechs.length})
              </h6>
              <button style={{ 
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)', 
                color: 'white', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: '10px', 
                fontSize: '13px', 
                fontWeight: 600, 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px' 
              }} 
              onClick={() => setShowAddLabTech(true)}>
                <FaPlus /> Add Lab Tech
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['Name', 'Email', 'Phone'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {labTechs.map(tech => (
                    <tr key={tech._id}>
                      <td style={tdStyle}><strong>{tech.name}</strong></td>
                      <td style={{ ...tdStyle, color: '#64748b' }}>{tech.email}</td>
                      <td style={{ ...tdStyle, color: '#64748b' }}>{tech.phone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {/* ✅ D7: COMPLETELY FIXED Add Lab Test Modal */}
      {showAddTest && (
        <FormModal title="🧪 Add Lab Test to Catalog" onClose={() => setShowAddTest(false)} onSubmit={handleAddTest} btnLabel="Add Test" btnColor="linear-gradient(135deg, #3b82f6, #1d4ed8)">
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Test Name</label>
            <input 
              type="text" 
              name="name"
              style={inputStyle} 
              placeholder="e.g., Complete Blood Count (CBC)" 
              value={testForm.name} 
              onChange={handleTestFormChange}
              required 
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Category</label>
            <input 
              type="text" 
              name="category"
              style={inputStyle} 
              placeholder="e.g., Hematology, Radiology" 
              value={testForm.category} 
              onChange={handleTestFormChange}
              required 
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Price (Rs.)</label>
            <input 
              type="number" 
              name="price"
              style={inputStyle} 
              placeholder="e.g., 500" 
              value={testForm.price} 
              onChange={handleTestFormChange}
              required 
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Normal Range</label>
            <input 
              type="text" 
              name="normalRange"
              style={inputStyle} 
              placeholder="e.g., 4.5–11.0 x10^9/L" 
              value={testForm.normalRange} 
              onChange={handleTestFormChange}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Description</label>
            <textarea 
              name="description"
              style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }} 
              value={testForm.description} 
              onChange={handleTestFormChange}
            />
          </div>
        </FormModal>
      )}

      {/* Add Lab Tech Modal */}
      {showAddLabTech && (
        <FormModal title="👩‍🔬 Add Lab Technician" onClose={() => setShowAddLabTech(false)} onSubmit={handleAddLabTech} btnLabel="Add Lab Technician" btnColor="linear-gradient(135deg, #06b6d4, #0891b2)">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Jane Smith' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'labtech@hospital.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
            { label: 'Phone', key: 'phone', type: 'text', placeholder: 'e.g., 9800000003' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>{field.label}</label>
              <input type={field.type} style={inputStyle} placeholder={field.placeholder} value={labTechForm[field.key]} onChange={e => setLabTechForm({ ...labTechForm, [field.key]: e.target.value })} required={['name', 'email', 'password'].includes(field.key)} />
            </div>
          ))}
        </FormModal>
      )}

    </div>
  );
};

export default AdminDashboard;