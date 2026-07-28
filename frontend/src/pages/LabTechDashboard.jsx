import { useState, useEffect } from 'react';
import { FaFlask, FaClipboardList, FaCheckCircle, FaVial } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const LabTechDashboard = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [activeTab, setActiveTab] = useState('queue');
  const [showResultForm, setShowResultForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [resultForm, setResultForm] = useState({ resultValue: '', resultFlag: 'normal', technicianNotes: '' });

  useEffect(() => { fetchQueue(); fetchCompleted(); }, []);

  const fetchQueue = async () => {
    try { const { data } = await axios.get('/lab-orders/queue'); setQueue(data); }
    catch (e) { console.error(e); }
  };

  const fetchCompleted = async () => {
    try { const { data } = await axios.get('/lab-orders/my-completed'); setCompleted(data); }
    catch (e) { console.error(e); }
  };

  const handleAdvanceStatus = async (orderId, nextStatus) => {
    try {
      await axios.put(`/lab-orders/${orderId}/status`, { status: nextStatus });
      toast.success(`Marked as ${nextStatus.replace('_', ' ')}`);
      fetchQueue();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSubmitResults = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/lab-orders/${selectedOrder._id}/results`, resultForm);
      toast.success('Results submitted — patient notified by email');
      setShowResultForm(false);
      setResultForm({ resultValue: '', resultFlag: 'normal', technicianNotes: '' });
      setSelectedOrder(null);
      fetchQueue();
      fetchCompleted();
    } catch (err) {
      toast.error('Failed to submit results');
    }
  };

  // ── Styles (same design system as other dashboards) ──
  const pageStyle = { minHeight: '100vh', background: '#f1f5f9', marginLeft: '250px', padding: '32px' };
  const cardStyle = { background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)', padding: '24px', marginBottom: '24px' };
  const statCardStyle = (bg, shadow) => ({ background: bg, borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: shadow, flex: 1 });
  const iconBoxStyle = { width: '52px', height: '52px', background: 'rgba(255,255,255,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: 'white', flexShrink: 0 };
  const tabStyle = (active) => ({ padding: '10px 20px', borderRadius: '10px', border: 'none', background: active ? '#06b6d4' : 'transparent', color: active ? 'white' : '#64748b', fontWeight: active ? 600 : 400, fontSize: '14px', cursor: 'pointer' });
  const thStyle = { padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' };
  const tdStyle = { padding: '14px 16px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' };
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', background: '#f8fafc', marginTop: '6px', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '13px', fontWeight: 600, color: '#374151' };
  const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const modalStyle = { background: 'white', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' };

  const statusBadge = (status) => {
    const map = {
      ordered: { bg: '#fef9c3', color: '#ca8a04' },
      sample_collected: { bg: '#dbeafe', color: '#2563eb' },
      in_progress: { bg: '#ede9fe', color: '#7c3aed' },
      completed: { bg: '#dcfce7', color: '#16a34a' },
    };
    const s = map[status] || map.ordered;
    return { background: s.bg, color: s.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 };
  };

  const nextStatusFor = (current) => {
    if (current === 'ordered') return 'sample_collected';
    if (current === 'sample_collected') return 'in_progress';
    return null; // in_progress → results submitted via the form, not a simple status bump
  };

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={pageStyle}>

        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Lab Technician Dashboard 🧪
          </h4>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
            Welcome, {user?.name} — here's today's testing queue.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={statCardStyle('linear-gradient(135deg, #f59e0b, #d97706)', '0 4px 16px rgba(245,158,11,0.3)')}>
            <div style={iconBoxStyle}><FaClipboardList /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '13px', fontWeight: 600 }}>In Queue</div>
              <div style={{ color: 'white', fontSize: '32px', fontWeight: 800 }}>{queue.length}</div>
            </div>
          </div>
          <div style={statCardStyle('linear-gradient(135deg, #06b6d4, #0891b2)', '0 4px 16px rgba(6,182,212,0.3)')}>
            <div style={iconBoxStyle}><FaVial /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '13px', fontWeight: 600 }}>In Progress</div>
              <div style={{ color: 'white', fontSize: '32px', fontWeight: 800 }}>{queue.filter(o => o.status === 'in_progress').length}</div>
            </div>
          </div>
          <div style={statCardStyle('linear-gradient(135deg, #10b981, #059669)', '0 4px 16px rgba(16,185,129,0.3)')}>
            <div style={iconBoxStyle}><FaCheckCircle /></div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '13px', fontWeight: 600 }}>Completed by Me</div>
              <div style={{ color: 'white', fontSize: '32px', fontWeight: 800 }}>{completed.length}</div>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, padding: '8px', marginBottom: '24px', display: 'inline-flex', gap: '4px' }}>
          {[{ key: 'queue', label: '📋 Test Queue' }, { key: 'completed', label: '✅ Completed' }].map(tab => (
            <button key={tab.key} style={tabStyle(activeTab === tab.key)} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
          ))}
        </div>

        {activeTab === 'queue' && (
          <div style={cardStyle}>
            <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '20px', fontSize: '16px' }}>📋 Pending Tests</h6>
            {queue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <FaFlask style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }} />
                <p>No pending tests — queue is clear!</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>{['Patient', 'Test', 'Ordered By', 'Status', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {queue.map(order => (
                      <tr key={order._id}>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 600 }}>{order.patientId?.name}</div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>{order.patientId?.age}y • {order.patientId?.gender}</div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 600 }}>{order.testId?.name}</div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>{order.testId?.category}</div>
                        </td>
                        <td style={tdStyle}>Dr. {order.doctorId?.name}</td>
                        <td style={tdStyle}><span style={statusBadge(order.status)}>{order.status.replace('_', ' ')}</span></td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {nextStatusFor(order.status) && (
                              <button onClick={() => handleAdvanceStatus(order._id, nextStatusFor(order.status))}
                                style={{ background: '#dbeafe', color: '#2563eb', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                                Mark {nextStatusFor(order.status).replace('_', ' ')}
                              </button>
                            )}
                            {order.status === 'in_progress' && (
                              <button onClick={() => { setSelectedOrder(order); setShowResultForm(true); }}
                                style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                                Enter Results
                              </button>
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

        {activeTab === 'completed' && (
          <div style={cardStyle}>
            <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '20px', fontSize: '16px' }}>✅ Completed by Me</h6>
            {completed.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No completed tests yet</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Patient', 'Test', 'Completed'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                  <tbody>
                    {completed.map(order => (
                      <tr key={order._id}>
                        <td style={tdStyle}>{order.patientId?.name}</td>
                        <td style={tdStyle}>{order.testId?.name}</td>
                        <td style={tdStyle}>{new Date(order.completedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {showResultForm && selectedOrder && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h5 style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>Enter Results — {selectedOrder.testId?.name}</h5>
              <button onClick={() => setShowResultForm(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', color: '#64748b' }}>✕</button>
            </div>
            <form onSubmit={handleSubmitResults}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Result Value</label>
                <input style={inputStyle} type="text" placeholder="e.g., 6.2 x10^9/L" value={resultForm.resultValue}
                  onChange={e => setResultForm({ ...resultForm, resultValue: e.target.value })} required />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Flag</label>
                <select style={inputStyle} value={resultForm.resultFlag} onChange={e => setResultForm({ ...resultForm, resultFlag: e.target.value })}>
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Technician Notes</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={resultForm.technicianNotes}
                  onChange={e => setResultForm({ ...resultForm, technicianNotes: e.target.value })} />
              </div>
              <button type="submit" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                Submit Results
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTechDashboard;