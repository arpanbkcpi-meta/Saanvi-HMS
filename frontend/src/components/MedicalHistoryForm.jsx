import React, { useState, useEffect } from 'react';

const MedicalHistoryForm = ({ patient, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    bloodGroup: 'O+',
    height: '',
    weight: '',
    allergies: '',
    chronicDiseases: '',
    currentMedications: '',
    previousSurgeries: '',
    familyHistory: '',
    smokingStatus: 'Never',
    alcoholConsumption: 'Never',
    vaccinationHistory: '',
    emergencyContact: '',
    emergencyPhone: '',
    insuranceProvider: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [liveBmi, setLiveBmi] = useState(null);

  // Populate form with initial data for updates
  useEffect(() => {
    if (initialData) {
      setFormData({
        bloodGroup: initialData.bloodGroup || 'O+',
        height: initialData.height || '',
        weight: initialData.weight || '',
        allergies: Array.isArray(initialData.allergies) ? initialData.allergies.join(', ') : '',
        chronicDiseases: Array.isArray(initialData.chronicDiseases) ? initialData.chronicDiseases.join(', ') : '',
        currentMedications: Array.isArray(initialData.currentMedications) ? initialData.currentMedications.join(', ') : '',
        previousSurgeries: Array.isArray(initialData.previousSurgeries) ? initialData.previousSurgeries.join(', ') : '',
        familyHistory: initialData.familyHistory || '',
        smokingStatus: initialData.smokingStatus || 'Never',
        alcoholConsumption: initialData.alcoholConsumption || 'Never',
        vaccinationHistory: initialData.vaccinationHistory || '',
        emergencyContact: initialData.emergencyContact || '',
        emergencyPhone: initialData.emergencyPhone || '',
        insuranceProvider: initialData.insuranceProvider || '',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  // Calculate live BMI on change
  useEffect(() => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) {
      const heightInMeters = h > 3 ? h / 100 : h;
      const bmiVal = (w / (heightInMeters * heightInMeters)).toFixed(2);
      setLiveBmi(bmiVal);
    } else {
      setLiveBmi(null);
    }
  }, [formData.height, formData.weight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate required fields
    if (!formData.bloodGroup || !formData.height || !formData.weight || !formData.emergencyContact || !formData.emergencyPhone) {
      setError('Please fill in all required fields (Blood Group, Height, Weight, Emergency Contact, and Emergency Phone)');
      setLoading(false);
      return;
    }

    // Map comma-separated string inputs to arrays
    const parseCommaSeparated = (str) => {
      if (!str) return [];
      return str.split(',').map(item => item.trim()).filter(Boolean);
    };

    const submissionData = {
      patientId: patient?._id || initialData?.patientId?._id || initialData?.patientId,
      bloodGroup: formData.bloodGroup,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      allergies: parseCommaSeparated(formData.allergies),
      chronicDiseases: parseCommaSeparated(formData.chronicDiseases),
      currentMedications: parseCommaSeparated(formData.currentMedications),
      previousSurgeries: parseCommaSeparated(formData.previousSurgeries),
      familyHistory: formData.familyHistory,
      smokingStatus: formData.smokingStatus,
      alcoholConsumption: formData.alcoholConsumption,
      vaccinationHistory: formData.vaccinationHistory,
      emergencyContact: formData.emergencyContact,
      emergencyPhone: formData.emergencyPhone,
      insuranceProvider: formData.insuranceProvider,
      notes: formData.notes
    };

    try {
      await onSubmit(submissionData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit medical record form');
    } finally {
      setLoading(false);
    }
  };

  // Live BMI badge styles
  const getBmiBadgeStyle = (bmi) => {
    if (!bmi) return {};
    const val = parseFloat(bmi);
    if (val < 18.5) return { color: '#2563eb', background: '#dbeafe' };
    if (val < 25) return { color: '#16a34a', background: '#dcfce7' };
    if (val < 30) return { color: '#ca8a04', background: '#fef9c3' };
    return { color: '#dc2626', background: '#fee2e2' };
  };

  const bmiBadgeStyle = getBmiBadgeStyle(liveBmi);

  // Styles
  const formGroupStyle = {
    marginBottom: '16px'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '6px',
    display: 'block'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    background: '#f8fafc',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '80px'
  };

  const sectionHeaderStyle = {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0f172a',
    marginTop: '24px',
    marginBottom: '14px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const btnPrimary = {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white', border: 'none',
    padding: '12px 24px', borderRadius: '10px',
    fontSize: '14px', fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
    transition: 'all 0.2s'
  };

  const btnCancel = {
    background: '#f1f5f9',
    color: '#475569', border: 'none',
    padding: '12px 24px', borderRadius: '10px',
    fontSize: '14px', fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h5 style={{ fontWeight: 800, color: '#0f172a', margin: 0 }}>
          {initialData ? '📝 Edit Medical History' : '➕ Create Medical History'}
        </h5>
        {patient && (
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>
            Patient: <strong>{patient.name}</strong> ({patient.email})
          </p>
        )}
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', fontWeight: 500 }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Core Metrics */}
        <div style={sectionHeaderStyle}>Physical Metrics</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Blood Group *</label>
            <select name="bloodGroup" style={inputStyle} value={formData.bloodGroup} onChange={handleChange} required>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Height (cm or m) *</label>
            <input type="number" step="any" name="height" style={inputStyle} placeholder="e.g. 175 or 1.75" value={formData.height} onChange={handleChange} required />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Weight (kg) *</label>
            <input type="number" step="any" name="weight" style={inputStyle} placeholder="e.g. 70" value={formData.weight} onChange={handleChange} required />
          </div>

          {liveBmi !== null && (
            <div style={{ ...formGroupStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={labelStyle}>Calculated BMI</label>
              <div style={{
                ...bmiBadgeStyle,
                padding: '10px 14px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                textAlign: 'center',
                border: `1.5px solid ${bmiBadgeStyle.color}33`
              }}>
                {liveBmi} — {liveBmi < 18.5 ? 'Underweight' : liveBmi < 25 ? 'Normal' : liveBmi < 30 ? 'Overweight' : 'Obese'}
              </div>
            </div>
          )}
        </div>

        {/* Social Habits */}
        <div style={sectionHeaderStyle}>Social Habits & Insurance</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Smoking Status</label>
            <select name="smokingStatus" style={inputStyle} value={formData.smokingStatus} onChange={handleChange}>
              {['Never', 'Former', 'Current', 'Occasional', 'Active'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Alcohol Consumption</label>
            <select name="alcoholConsumption" style={inputStyle} value={formData.alcoholConsumption} onChange={handleChange}>
              {['Never', 'Socially', 'Regularly', 'Heavy'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Insurance Provider</label>
            <input type="text" name="insuranceProvider" style={inputStyle} placeholder="e.g. Cigna, Blue Cross" value={formData.insuranceProvider} onChange={handleChange} />
          </div>
        </div>

        {/* Medical History lists */}
        <div style={sectionHeaderStyle}>Medical History Lists (Comma Separated)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Allergies</label>
            <textarea name="allergies" style={textareaStyle} placeholder="e.g. Penicillin, Peanuts, Pollen" value={formData.allergies} onChange={handleChange} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Chronic Diseases</label>
            <textarea name="chronicDiseases" style={textareaStyle} placeholder="e.g. Asthma, Hypertension, Diabetes Type II" value={formData.chronicDiseases} onChange={handleChange} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Current Medications</label>
            <textarea name="currentMedications" style={textareaStyle} placeholder="e.g. Metformin 500mg, Albuterol Inhaler" value={formData.currentMedications} onChange={handleChange} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Previous Surgeries</label>
            <textarea name="previousSurgeries" style={textareaStyle} placeholder="e.g. Appendectomy (2018), Tonsillectomy (2005)" value={formData.previousSurgeries} onChange={handleChange} />
          </div>
        </div>

        {/* Medical Text Details */}
        <div style={sectionHeaderStyle}>History Details & Notes</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Family Medical History</label>
            <textarea name="familyHistory" style={{ ...textareaStyle, minHeight: '100px' }} placeholder="Detail genetic/hereditary diseases in family (e.g. Father: Heart Disease)" value={formData.familyHistory} onChange={handleChange} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Vaccination History</label>
            <textarea name="vaccinationHistory" style={{ ...textareaStyle, minHeight: '100px' }} placeholder="e.g. COVID-19 (3 doses), Tetanus (2023), MMR" value={formData.vaccinationHistory} onChange={handleChange} />
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Clinical / History Notes</label>
          <textarea name="notes" style={{ ...textareaStyle, minHeight: '100px' }} placeholder="Enter additional notes, remarks or patient observations..." value={formData.notes} onChange={handleChange} />
        </div>

        {/* Emergency Contacts */}
        <div style={sectionHeaderStyle}>Emergency Contacts</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Emergency Contact Name *</label>
            <input type="text" name="emergencyContact" style={inputStyle} placeholder="Full name of contact" value={formData.emergencyContact} onChange={handleChange} required />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Emergency Phone *</label>
            <input type="text" name="emergencyPhone" style={inputStyle} placeholder="Phone number" value={formData.emergencyPhone} onChange={handleChange} required />
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <button type="button" style={btnCancel} onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" style={btnPrimary} disabled={loading}>
            {loading ? 'Submitting...' : initialData ? 'Update Record' : 'Create Record'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalHistoryForm;
