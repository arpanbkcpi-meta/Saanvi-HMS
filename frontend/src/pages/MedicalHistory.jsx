import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MedicalHistoryCard from '../components/MedicalHistoryCard';
import MedicalHistoryForm from '../components/MedicalHistoryForm';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { FaHeartbeat, FaSearch, FaUserShield, FaNotesMedical, FaTrashAlt, FaFolderOpen } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const MedicalHistory = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentHistory, setCurrentHistory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isPatient) {
      fetchPatientOwnHistory();
    } else {
      fetchPatients().then((patientsList) => {
        if (location.state?.patientId && patientsList) {
          const pat = patientsList.find(p => p._id === location.state.patientId);
          if (pat) {
            fetchHistoryForPatient(pat);
          }
        }
      });
    }
  }, [isPatient, location.state]);

  // Fetch patient's own history
  const fetchPatientOwnHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/medical-histories');
      if (data && data.length > 0) {
        setCurrentHistory(data[0]);
      } else {
        setCurrentHistory(null);
      }
    } catch (err) {
      console.error('Error fetching patient medical history:', err);
      setError(err.response?.data?.message || 'Failed to fetch medical history record.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients list (for Doctors & Admins)
  const fetchPatients = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/users/patients');
      setPatients(data);
      return data;
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to fetch patients list.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch history for a specific patient
  const fetchHistoryForPatient = async (patient) => {
    setSelectedPatient(patient);
    setIsEditing(false);
    setHistoryLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await axios.get(`/medical-histories/patient/${patient._id}`);
      setCurrentHistory(data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setCurrentHistory(null); // No record yet
      } else {
        console.error('Error fetching patient medical history:', err);
        setError('Failed to retrieve medical history for this patient.');
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  // Form submit handler
  const handleFormSubmit = async (submissionData) => {
    setError('');
    setSuccess('');
    try {
      if (currentHistory) {
        // Update
        const { data } = await axios.put(`/medical-histories/${currentHistory._id}`, submissionData);
        setCurrentHistory(data);
        setSuccess('Medical history updated successfully!');
      } else {
        // Create new
        const { data } = await axios.post('/medical-histories', submissionData);
        setCurrentHistory(data);
        setSuccess('Medical history created successfully!');
      }
      setIsEditing(false);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error submitting medical history:', err);
      throw err; // Form component will capture it and show error message
    }
  };

  // Delete history handler (Admin only)
  const handleDeleteHistory = async () => {
    if (!currentHistory) return;
    if (window.confirm('Are you absolutely sure you want to permanently delete this medical record? This cannot be undone.')) {
      setError('');
      setSuccess('');
      try {
        await axios.delete(`/medical-histories/${currentHistory._id}`);
        setCurrentHistory(null);
        setSuccess('Medical record deleted successfully!');
        setIsEditing(false);
      } catch (err) {
        console.error('Error deleting medical record:', err);
        setError(err.response?.data?.message || 'Failed to delete medical record.');
      }
    }
  };

  // Filter patients by search query
  const filteredPatients = patients.filter(pat =>
    pat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pat.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (pat.phone && pat.phone.includes(searchQuery))
  );

  // Styles
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

  const listGroupItemStyle = (isSelected) => ({
    padding: '14px 18px',
    border: 'none',
    borderBottom: '1px solid #f1f5f9',
    background: isSelected ? 'linear-gradient(135deg, #e0f2fe, #f0f9ff)' : 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderRadius: '8px',
    marginBottom: '4px'
  });

  const searchInputStyle = {
    width: '100%',
    padding: '10px 14px 10px 38px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    background: '#f8fafc',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={pageStyle}>
        {/* Header */}
        <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#ef4444' }}><FaHeartbeat /></span> Electronic Medical Records (EMR)
            </h4>
            <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
              {isPatient
                ? 'View your certified medical history, allergies, vaccination records, and metrics.'
                : 'Lookup, initialize, and update comprehensive medical histories for hospital patients.'}
            </p>
          </div>
          {isAdmin && currentHistory && !isEditing && (
            <button
              onClick={handleDeleteHistory}
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(220,38,38,0.1)'
              }}
            >
              <FaTrashAlt /> Delete Record
            </button>
          )}
        </div>

        {success && (
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: 500 }}>
            ✅ {success}
          </div>
        )}

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: 500 }}>
            ❌ {error}
          </div>
        )}

        {isPatient ? (
          /* Patient View: Displays their own history card directly */
          loading ? (
            <div style={cardStyle}>
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading your medical records...</div>
            </div>
          ) : (
            <MedicalHistoryCard
              history={currentHistory}
              canEdit={false}
            />
          )
        ) : (
          /* Doctor / Admin View: Side-by-side search & display list */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px', alignItems: 'start' }}>
            
            {/* Left Column: Patients List */}
            <div style={{ ...cardStyle, position: 'sticky', top: '32px', maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
              <h6 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                👥 Patient Directory
              </h6>
              
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#94a3b8', fontSize: '14px' }}>
                  <FaSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search patient name/email..."
                  style={searchInputStyle}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px' }}>Loading directory...</div>
              ) : filteredPatients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px' }}>No patients found</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {filteredPatients.map(pat => {
                    const isSelected = selectedPatient?._id === pat._id;
                    return (
                      <div
                        key={pat._id}
                        onClick={() => fetchHistoryForPatient(pat)}
                        style={listGroupItemStyle(isSelected)}
                        onMouseEnter={e => {
                          if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '14px', color: isSelected ? '#0369a1' : '#1e293b' }}>
                          {pat.name}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>
                          {pat.email}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                          Age: {pat.age || 'N/A'} • {pat.gender || 'N/A'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Detail View or Form */}
            <div>
              {!selectedPatient ? (
                <div style={{
                  ...cardStyle,
                  textAlign: 'center',
                  padding: '60px 40px',
                  border: '1.5px dashed #e2e8f0',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ width: '60px', height: '60px', background: '#e0f2fe', color: '#0284c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    <FaFolderOpen />
                  </div>
                  <div>
                    <h5 style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Select a Patient</h5>
                    <p style={{ color: '#64748b', fontSize: '13px', maxWidth: '300px', margin: 0 }}>
                      Choose a patient from the directory to load their electronic medical records.
                    </p>
                  </div>
                </div>
              ) : historyLoading ? (
                <div style={cardStyle}>
                  <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading record for {selectedPatient.name}...</div>
                </div>
              ) : isEditing ? (
                <MedicalHistoryForm
                  patient={selectedPatient}
                  initialData={currentHistory}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <MedicalHistoryCard
                  history={currentHistory}
                  canEdit={true}
                  onEdit={() => setIsEditing(true)}
                />
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
