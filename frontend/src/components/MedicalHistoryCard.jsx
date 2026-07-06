import React from 'react';
import { FaHeartbeat, FaWeight, FaRulerVertical, FaUser, FaPhoneAlt, FaExclamationTriangle, FaFileMedical, FaShieldAlt, FaSyringe, FaSmoking, FaWineGlassAlt } from 'react-icons/fa';

const MedicalHistoryCard = ({ history, onEdit, canEdit }) => {
  if (!history) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1.5px dashed #cbd5e1'
      }}>
        <div style={{ fontSize: '48px', color: '#94a3b8', marginBottom: '16px' }}>
          <FaFileMedical />
        </div>
        <h5 style={{ fontWeight: 700, color: '#0f172a' }}>No Medical History</h5>
        <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
          This patient does not have a medical history record initialized in the system.
        </p>
        {canEdit && onEdit && (
          <button
            onClick={onEdit}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '10px',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
            }}
          >
            + Initialize Medical History
          </button>
        )}
      </div>
    );
  }

  const {
    patientId,
    bloodGroup,
    height,
    weight,
    bmi,
    allergies = [],
    chronicDiseases = [],
    currentMedications = [],
    previousSurgeries = [],
    familyHistory = '',
    smokingStatus = 'Never',
    alcoholConsumption = 'Never',
    vaccinationHistory = '',
    emergencyContact = '',
    emergencyPhone = '',
    insuranceProvider = '',
    notes = '',
    updatedAt
  } = history;

  // Determine BMI status and badge styling
  const getBmiStatus = (val) => {
    if (!val || val <= 0) return { label: 'N/A', color: '#64748b', bg: '#f1f5f9' };
    if (val < 18.5) return { label: 'Underweight', color: '#2563eb', bg: '#dbeafe' };
    if (val < 25) return { label: 'Normal', color: '#16a34a', bg: '#dcfce7' };
    if (val < 30) return { label: 'Overweight', color: '#ca8a04', bg: '#fef9c3' };
    return { label: 'Obese', color: '#dc2626', bg: '#fee2e2' };
  };

  const bmiStatus = getBmiStatus(bmi);

  // Styles
  const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.08)',
    padding: '28px',
    marginBottom: '24px',
    border: '1px solid #e2e8f0'
  };

  const sectionTitleStyle = {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '8px'
  };

  const metricBoxStyle = {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    border: '1px solid #e2e8f0'
  };

  const badgeListStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    margin: '8px 0'
  };

  const badgeItemStyle = (bg, color) => ({
    background: bg,
    color: color,
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
  });

  const bulletListStyle = {
    paddingLeft: '20px',
    margin: '0',
    fontSize: '13px',
    color: '#475569'
  };

  return (
    <div style={cardStyle}>
      {/* Top Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h5 style={{ fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#ef4444' }}><FaHeartbeat /></span> Electronic Medical Record
          </h5>
          <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0' }}>
            Last Updated: {new Date(updatedAt).toLocaleString()}
          </p>
        </div>
        {canEdit && onEdit && (
          <button
            onClick={onEdit}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white', border: 'none',
              padding: '8px 18px', borderRadius: '8px',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59,130,246,0.25)'
            }}
          >
            Edit Record
          </button>
        )}
      </div>

      {/* Patient Summary Block */}
      {patientId && (
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Patient Name</div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <FaUser style={{ fontSize: '12px', color: '#64748b' }} /> {patientId.name}
            </div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Age & Gender</div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#334155', marginTop: '2px' }}>
              {patientId.age || 'N/A'} yrs • <span style={{ textTransform: 'capitalize' }}>{patientId.gender || 'N/A'}</span>
            </div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Phone Number</div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#334155', marginTop: '2px' }}>
              {patientId.phone || 'N/A'}
            </div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Email Address</div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#334155', marginTop: '2px', wordBreak: 'break-all' }}>
              {patientId.email || 'N/A'}
            </div>
          </div>
        </div>
      )}

      {/* Grid for Primary Metrics (Blood, Height, Weight, BMI) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={metricBoxStyle}>
          <div style={{ background: '#fee2e2', color: '#dc2626', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
            🩸
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Blood Group</div>
            <div style={{ fontWeight: 800, fontSize: '18px', color: '#0f172a' }}>{bloodGroup}</div>
          </div>
        </div>

        <div style={metricBoxStyle}>
          <div style={{ background: '#dbeafe', color: '#2563eb', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
            <FaRulerVertical />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Height</div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>
              {height > 3 ? `${height} cm` : `${height} m`}
            </div>
          </div>
        </div>

        <div style={metricBoxStyle}>
          <div style={{ background: '#fef3c7', color: '#d97706', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
            <FaWeight />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Weight</div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>{weight} kg</div>
          </div>
        </div>

        <div style={{ ...metricBoxStyle, background: bmiStatus.bg, borderColor: `${bmiStatus.color}22` }}>
          <div style={{ background: bmiStatus.color, color: 'white', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
            {bmi || '—'}
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>BMI Status</div>
            <div style={{ fontWeight: 800, fontSize: '14px', color: bmiStatus.color }}>
              {bmiStatus.label}
            </div>
          </div>
        </div>
      </div>

      {/* Main Medical Conditions Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Allergies & Chronic Diseases */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={sectionTitleStyle}>
              <FaExclamationTriangle style={{ color: '#ef4444' }} /> Allergies
            </div>
            {allergies.length === 0 ? (
              <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No known allergies</span>
            ) : (
              <div style={badgeListStyle}>
                {allergies.map((allergy, i) => (
                  <span key={i} style={badgeItemStyle('#fee2e2', '#dc2626')}>
                    {allergy}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={sectionTitleStyle}>
              🩺 Chronic Diseases
            </div>
            {chronicDiseases.length === 0 ? (
              <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No chronic diseases reported</span>
            ) : (
              <div style={badgeListStyle}>
                {chronicDiseases.map((disease, i) => (
                  <span key={i} style={badgeItemStyle('#ede9fe', '#7c3aed')}>
                    {disease}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Medications & Surgeries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={sectionTitleStyle}>
              💊 Current Medications
            </div>
            {currentMedications.length === 0 ? (
              <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No active medications</span>
            ) : (
              <div style={badgeListStyle}>
                {currentMedications.map((med, i) => (
                  <span key={i} style={badgeItemStyle('#e0f2fe', '#0369a1')}>
                    {med}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={sectionTitleStyle}>
              🔪 Previous Surgeries
            </div>
            {previousSurgeries.length === 0 ? (
              <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No prior surgeries</span>
            ) : (
              <ul style={bulletListStyle}>
                {previousSurgeries.map((surg, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{surg}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Social, Vaccinations & Insurance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div>
          <div style={sectionTitleStyle}>
            🗣 Social Habits & Insurance
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaSmoking style={{ color: '#64748b' }} /> Smoking:</span>
              <strong style={{ color: '#0f172a' }}>{smokingStatus}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaWineGlassAlt style={{ color: '#64748b' }} /> Alcohol:</span>
              <strong style={{ color: '#0f172a' }}>{alcoholConsumption}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaShieldAlt style={{ color: '#64748b' }} /> Insurance:</span>
              <strong style={{ color: '#0f172a' }}>{insuranceProvider || 'None'}</strong>
            </div>
          </div>
        </div>

        <div>
          <div style={sectionTitleStyle}>
            <FaSyringe style={{ color: '#06b6d4' }} /> Vaccination History
          </div>
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
            {vaccinationHistory || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No record provided</span>}
          </p>
        </div>
      </div>

      {/* Emergency Contacts & Notes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #fef3c7',
          borderRadius: '12px',
          padding: '18px 20px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#b45309', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            🚨 Emergency Contact
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#78350f' }}>
            <div>
              <strong>Name:</strong> {emergencyContact}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <FaPhoneAlt style={{ fontSize: '11px' }} /> <strong>Phone:</strong> {emergencyPhone}
            </div>
          </div>
        </div>

        <div>
          <div style={sectionTitleStyle}>
            📝 Family History & Notes
          </div>
          {familyHistory && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Family Medical History</div>
              <p style={{ fontSize: '13px', color: '#475569', margin: '2px 0 0', lineHeight: 1.4 }}>{familyHistory}</p>
            </div>
          )}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Clinical Notes</div>
            <p style={{ fontSize: '13px', color: '#475569', margin: '2px 0 0', lineHeight: 1.4 }}>
              {notes || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No clinical notes added</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryCard;
