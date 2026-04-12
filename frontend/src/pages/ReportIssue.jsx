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
    ShieldAlert,
    Info,
    ArrowRight
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
        <div className="container" style={{ padding: '40px 0 100px 0' }}>
            {/* Minimal Back Button */}
            <button
                onClick={() => navigate('/catalogue')}
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    color: '#6B7280',
                    padding: '10px 20px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    fontWeight: '800',
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s'
                }}
            >
                <ArrowLeft size={16} /> Catalogue
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start' }}>
                {/* Main Action Area */}
                <div className="premium-card" style={{ padding: '50px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#EF4444' }} />

                    <div style={{ marginBottom: '45px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            <AlertTriangle size={16} /> Incident Triage Entry
                        </div>
                        <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '900', letterSpacing: '-1.5px' }}>Report Malfunction</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '10px' }}>Provide evidence and details to deploy a maintenance crew.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                    <Briefcase size={16} color="#EF4444" /> Service Category
                                </label>
                                <select value={formData.category} className="premium-input"
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="IT_EQUIPMENT">IT / Digital Technology</option>
                                    <option value="FURNITURE">Furniture / Hardware</option>
                                    <option value="PLUMBING">Plumbing / Infrastructure</option>
                                    <option value="OTHER">General Maintenance</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                    <ShieldAlert size={16} color="#EF4444" /> Severity Level
                                </label>
                                <select value={formData.priority} className="premium-input"
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                    <option value="LOW">Low (Not blocking usage)</option>
                                    <option value="MEDIUM">Medium (Affects session quality)</option>
                                    <option value="HIGH">High (Critical failure)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label className="form-label" style={{ color: '#111827' }}>Evidence & Observations</label>
                            <textarea required rows="5" value={formData.description} className="premium-input"
                                style={{ lineHeight: '1.7' }}
                                placeholder="Detail the malfunction. Specifically mention what happened and any error codes visible..."
                                onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                <Phone size={16} color="#EF4444" /> Requester Correspondence
                            </label>
                            <input required type="text" value={formData.contactDetails} className="premium-input"
                                placeholder="University email or internal extension number..."
                                onChange={e => setFormData({ ...formData, contactDetails: e.target.value })} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label className="form-label">Multimedia Evidence (Max 3)</label>
                            <div style={{
                                position: 'relative', border: '2px dashed #E5E7EB', padding: '30px',
                                borderRadius: '20px', textAlign: 'center', transition: 'all 0.2s',
                                background: '#F9FAFB'
                            }} onMouseOver={e => e.currentTarget.style.borderColor = '#EF4444'} onMouseOut={e => e.currentTarget.style.borderColor = '#E5E7EB'}>
                                <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files))}
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                                <Upload size={32} color="#9CA3AF" style={{ marginBottom: '10px', opacity: 0.5 }} />
                                <div style={{ color: '#6B7280', fontSize: '14px' }}>
                                    {files.length > 0 ? (
                                        <div style={{ color: '#EF4444', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <FileImage size={18} /> {files.length} evidence files attached
                                        </div>
                                    ) : (
                                        'Click or drag scene photos here for the technician'
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', paddingTop: '10px' }}>
                            <button type="submit" style={{
                                flex: 1, padding: '20px', background: '#EF4444', color: 'white',
                                border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '18px',
                                fontWeight: '900', boxShadow: '0 15px 30px rgba(239, 68, 68, 0.2)',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
                            }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Deploy Ticket <ArrowRight size={20} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sticky Side Information */}
                <div style={{ position: 'sticky', top: '110px' }}>
                    <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
                        {resource.image && (
                            <div style={{ width: '100%', height: '240px', position: 'relative' }}>
                                <img
                                    src={`data:${resource.imageContentType};base64,${resource.image}`}
                                    alt={resource.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Impacted Asset</div>
                                    <div style={{ fontSize: '24px', fontWeight: '900' }}>{resource.name}</div>
                                </div>
                            </div>
                        )}

                        <div style={{ padding: '30px' }}>
                            <div style={{ background: '#FEF2F2', padding: '20px', borderRadius: '16px', border: '1px solid #FEE2E2', marginBottom: '30px' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <ShieldAlert size={18} color="#EF4444" style={{ marginTop: '2px' }} />
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#B91C1C', marginBottom: '5px' }}>Critical Protocol</div>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#991B1B', lineHeight: '1.5', fontWeight: '500' }}>
                                            False reporting may result in administrative disciplinary action. Please provide accurate observations.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#F9FAFB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563' }}>
                                        <Info size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '800', textTransform: 'uppercase' }}>Routing</div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>Technician Direct Desk</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '50px', color: '#6B7280', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <CheckCircle2 size={16} color="#10B981" /> Incident report will be timestamped and assigned immediately.
            </div>
        </div>
    );
};

export default ReportIssue;
