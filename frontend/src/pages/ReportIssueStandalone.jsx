import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    ShieldAlert,
    MapPin,
    Tag,
    ArrowRight,
    Mail
} from 'lucide-react';

const ReportIssueStandalone = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [resources, setResources] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        resourceId: '',
        location: '',
        category: 'IT_EQUIPMENT',
        priority: 'MEDIUM',
        description: '',
        contactEmail: '',
        contactPhone: ''
    });
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Using static options as requested
        const staticResources = [
            { id: 1, name: "Main Hall" },
            { id: 2, name: "IT Lab" },
            { id: 3, name: "Library" },
            { id: 4, name: "Cafeteria" },
            { id: 5, name: "Gym" }
        ];
        setResources(staticResources);
    }, []);

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^07[0-9]{8}$/;

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.resourceId) newErrors.resourceId = 'Facility selection is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        if (!formData.contactEmail.trim()) {
            newErrors.contactEmail = 'Email is required';
        } else if (!emailRegex.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Invalid email format';
        }

        if (!formData.contactPhone.trim()) {
            newErrors.contactPhone = 'Phone is required';
        } else if (!phoneRegex.test(formData.contactPhone)) {
            newErrors.contactPhone = 'Invalid phone (07XXXXXXXX)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            showNotification('Please correct the errors before submitting.', 'error');
            return;
        }

        try {
            if (files.length > 3) {
                showNotification('Maximum 3 attachments allowed.', 'error');
                return;
            }

            const contactDetails = `E: ${formData.contactEmail} | P: ${formData.contactPhone}`;

            const res = await api.post('/tickets', {
                creatorId: user.id,
                resourceId: formData.resourceId,
                category: formData.category,
                priority: formData.priority,
                description: `TITLE: ${formData.title}\nLOCATION: ${formData.location}\nDESC: ${formData.description}`,
                contactDetails: contactDetails
            });
            const ticketId = res.data.id;

            for (const file of files) {
                const fd = new FormData();
                fd.append('file', file);
                await api.post(`/tickets/${ticketId}/attachments`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }

            showNotification('Ticket submitted successfully!', 'success');
            navigate('/dashboard');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Failed to submit ticket.', 'error');
        }
    };

    return (
        <div className="container" style={{ padding: '40px 0 100px 0' }}>
            <button
                onClick={() => navigate('/dashboard')}
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
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="premium-card" style={{ padding: '50px', position: 'relative', overflow: 'hidden', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#EF4444' }} />

                <div style={{ marginBottom: '45px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                        <AlertTriangle size={16} /> General Service Request
                    </div>
                    <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '900', letterSpacing: '-1.5px' }}>Report an Issue</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '10px' }}>Describe the problem and location to help our technical team.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                            <Tag size={16} color="#EF4444" /> Title
                        </label>
                        <input 
                            type="text" 
                            className="premium-input" 
                            placeholder="Briefly describe the issue"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                        {errors.title && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.title}</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                <Briefcase size={16} color="#EF4444" /> Related Facility
                            </label>
                            <select 
                                className="premium-input"
                                value={formData.resourceId}
                                onChange={e => setFormData({ ...formData, resourceId: e.target.value })}
                            >
                                <option value="">Select a facility...</option>
                                {resources.map(res => (
                                    <option key={res.id} value={res.id}>{res.name}</option>
                                ))}
                            </select>
                            {errors.resourceId && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.resourceId}</span>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                <MapPin size={16} color="#EF4444" /> Location
                            </label>
                            <input 
                                type="text" 
                                className="premium-input" 
                                placeholder="Room, floor, or area..."
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                <Briefcase size={16} color="#EF4444" /> Category
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
                                <ShieldAlert size={16} color="#EF4444" /> Priority
                            </label>
                            <select value={formData.priority} className="premium-input"
                                onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label className="form-label" style={{ color: '#111827' }}>Description</label>
                        <textarea rows="4" value={formData.description} className="premium-input"
                            style={{ lineHeight: '1.7' }}
                            placeholder="Details of the malfunction..."
                            onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        {errors.description && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.description}</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                <Mail size={16} color="#EF4444" /> Contact Email
                            </label>
                            <input 
                                type="email" 
                                className="premium-input" 
                                placeholder="university@email.com"
                                value={formData.contactEmail}
                                onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                            />
                            {errors.contactEmail && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.contactEmail}</span>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                <Phone size={16} color="#EF4444" /> Contact Phone
                            </label>
                            <input 
                                type="text" 
                                className="premium-input" 
                                placeholder="07XXXXXXXX"
                                value={formData.contactPhone}
                                onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                            />
                            {errors.contactPhone && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.contactPhone}</span>}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label className="form-label">Evidence Photos (Max 3)</label>
                        <div style={{
                            position: 'relative', border: '2px dashed #E5E7EB', padding: '30px',
                            borderRadius: '20px', textAlign: 'center', transition: 'all 0.2s',
                            background: '#F9FAFB'
                        }}>
                            <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files))}
                                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                            <Upload size={32} color="#9CA3AF" style={{ marginBottom: '10px', opacity: 0.5 }} />
                            <div style={{ color: '#6B7280', fontSize: '14px' }}>
                                {files.length > 0 ? (
                                    <div style={{ color: '#EF4444', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <FileImage size={18} /> {files.length} files selected
                                    </div>
                                ) : (
                                    'Click or drag scene photos here'
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', paddingTop: '20px' }}>
                        <button 
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            style={{
                                flex: 1, padding: '18px', background: '#F3F4F6', color: '#374151',
                                border: 'none', borderRadius: '18px', cursor: 'pointer', fontSize: '16px',
                                fontWeight: '700'
                            }}
                        >
                            Cancel
                        </button>
                        <button type="submit" style={{
                            flex: 2, padding: '18px', background: '#EF4444', color: 'white',
                            border: 'none', borderRadius: '18px', cursor: 'pointer', fontSize: '16px',
                            fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
                        }}>
                            Submit Ticket <ArrowRight size={20} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportIssueStandalone;
