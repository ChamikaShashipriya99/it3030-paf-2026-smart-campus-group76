import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import {
    AlertTriangle,
    ArrowLeft,
    Briefcase,
    Phone,
    Upload,
    FileImage,
    CheckCircle2,
    ShieldAlert
} from 'lucide-react';

const ReportIssue = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [resource, setResource] = useState(null);
    const [formData, setFormData] = useState({ category: 'IT_EQUIPMENT', priority: 'MEDIUM', description: '', contactDetails: '' });
    const [files, setFiles] = useState([]);

    useEffect(() => {
        api.get(`/resources/${id}`).then(res => setResource(res.data)).catch(err => console.error(err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.description.trim() || !formData.contactDetails.trim()) {
            showNotification('Please fill in all required fields properly.', 'error');
            return;
        }
        try {
            if (files.length > 3) {
                showNotification('Maximum 3 attachments allowed.', 'error');
                return;
            }

            const res = await api.post('/tickets', {
                creatorId: user.id,
                resourceId: id,
                category: formData.category,
                priority: formData.priority,
                description: formData.description,
                contactDetails: formData.contactDetails
            });
            const ticketId = res.data.id;

            for (const file of files) {
                const fd = new FormData();
                fd.append('file', file);
                await api.post(`/tickets/${ticketId}/attachments`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }

            showNotification('Incident Ticket and attachments submitted successfully!', 'success');
            navigate('/dashboard');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Failed to submit ticket.', 'error');
        }
    };

    if (!resource) return (
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <div className="skeleton" style={{ width: '100%', maxWidth: '800px', height: '400px', borderRadius: '32px', margin: '0 auto' }} />
        </div>
    );

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <button
                onClick={() => navigate('/catalogue')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '800', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
            >
                <ArrowLeft size={16} /> Return to Catalogue
            </button>

            <div className="premium-card" style={{ padding: '0', overflow: 'hidden', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', padding: '60px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: '15px', opacity: 0.8 }}>Technical Support &bull; Incident Triage</div>
                        <h2 style={{ margin: 0, fontSize: '42px', letterSpacing: '-1.5px', fontWeight: '900' }}>{resource.name}</h2>
                        <p style={{ margin: '20px 0 0 0', opacity: 0.9, fontSize: '16px', lineHeight: '1.6', maxWidth: '600px' }}>
                            Report malfunctions or infrastructure damages. Our maintenance crew will prioritize this ticket based on the severity described.
                        </p>
                    </div>
                    {resource.image && (
                        <div style={{ width: '180px', height: '180px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '4px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
                            <img
                                src={`data:${resource.imageContentType};base64,${resource.image}`}
                                alt={resource.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                </div>

                <div style={{ padding: '60px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div className="form-grid">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Briefcase size={16} color="#ef4444" /> Service Category
                                </label>
                                <select value={formData.category} className="premium-input" style={{ padding: '16px' }}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="IT_EQUIPMENT">IT / Digital Technology</option>
                                    <option value="FURNITURE">Furniture / Hardware</option>
                                    <option value="PLUMBING">Plumbing / Infrastructure</option>
                                    <option value="OTHER">General Maintenance</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ShieldAlert size={16} color="#ef4444" /> Severity Level
                                </label>
                                <select value={formData.priority} className="premium-input" style={{ padding: '16px' }}
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                    <option value="LOW">Low (Not blocking usage)</option>
                                    <option value="MEDIUM">Medium (Affects session quality)</option>
                                    <option value="HIGH">High (Critical failure / Safety risk)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label className="form-label">Evidence & Observations</label>
                            <textarea required rows="5" value={formData.description} className="premium-input"
                                style={{ padding: '20px', lineHeight: '1.6' }}
                                placeholder="Detail the malfunction. Specifically mention what happened and any error codes visible..."
                                onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Phone size={16} color="#ef4444" /> Requester Correspondence
                            </label>
                            <input required type="text" value={formData.contactDetails} className="premium-input"
                                style={{ padding: '16px' }}
                                placeholder="University email or internal extension number..."
                                onChange={e => setFormData({ ...formData, contactDetails: e.target.value })} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label className="form-label">Multimedia Evidence (Max 3)</label>
                            <div style={{
                                position: 'relative', border: '2px dashed var(--border)', padding: '40px',
                                borderRadius: '24px', textAlign: 'center', transition: 'all 0.2s',
                                background: 'rgba(255,255,255,0.02)'
                            }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files))}
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                                <Upload size={32} color="var(--text-muted)" style={{ marginBottom: '15px', opacity: 0.5 }} />
                                <div style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                                    {files.length > 0 ? (
                                        <div style={{ color: 'var(--primary)', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <FileImage size={18} /> {files.length} evidence files attached
                                        </div>
                                    ) : (
                                        'Click or drag scene photos here for the technician'
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                            <button type="submit" style={{
                                flex: 2, padding: '20px', background: '#ef4444', color: 'white',
                                border: 'none', borderRadius: '16px', cursor: 'pointer', fontSize: '16px',
                                fontWeight: '900', boxShadow: '0 12px 24px rgba(239, 68, 68, 0.3)',
                                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                            }}
                                onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                                onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                            >
                                <AlertTriangle size={20} /> Deploy Maintenance Request
                            </button>
                            <button type="button" onClick={() => navigate('/catalogue')} style={{
                                flex: 1, padding: '20px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)',
                                border: '1px solid var(--border)', borderRadius: '16px', cursor: 'pointer', fontSize: '16px',
                                fontWeight: '800'
                            }}>
                                Discard
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} /> Tickets are routed to the nearest available technician automatically.
            </div>
        </div>
    );
};

export default ReportIssue;
