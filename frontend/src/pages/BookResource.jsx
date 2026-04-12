import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Tag,
    ArrowLeft,
    AlertCircle,
    CheckCircle2,
    CalendarPlus
} from 'lucide-react';

const BookResource = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [resource, setResource] = useState(null);
    const [formData, setFormData] = useState({ startTime: '', endTime: '', purpose: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/resources/${id}`).then(res => setResource(res.data)).catch(err => console.error(err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const start = new Date(formData.startTime);
        const end = new Date(formData.endTime);

        if (end <= start) {
            setError('End time must be after start time.');
            return;
        }

        if (start < new Date()) {
            setError('Cannot book in the past.');
            return;
        }

        try {
            await api.post('/bookings', {
                userId: user.id,
                resourceId: id,
                startTime: formData.startTime,
                endTime: formData.endTime,
                purpose: formData.purpose
            });
            showNotification('Booking request submitted successfully! Awaiting Admin approval.', 'success');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit booking request. Time slot may be overlapping.');
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
                <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', padding: '60px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: '15px', opacity: 0.8 }}>System Registry &bull; Reservation</div>
                        <h2 style={{ margin: 0, fontSize: '42px', letterSpacing: '-1.5px', fontWeight: '900' }}>{resource.name}</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '30px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                                <MapPin size={16} /> {resource.location}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                                <Users size={16} /> {resource.capacity} Pax
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                                <Tag size={16} /> {resource.type.replace('_', ' ')}
                            </span>
                        </div>
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
                    {error && (
                        <div style={{ padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', borderRadius: '16px', marginBottom: '40px', border: '1px solid rgba(239, 68, 68, 0.1)', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div className="form-grid">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Clock size={16} color="var(--primary)" /> Commencing From
                                </label>
                                <input type="datetime-local" required value={formData.startTime}
                                    className="premium-input"
                                    style={{ padding: '16px' }}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Clock size={16} color="var(--primary)" /> Concluding At
                                </label>
                                <input type="datetime-local" required value={formData.endTime}
                                    className="premium-input"
                                    style={{ padding: '16px' }}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label className="form-label">Context / Intent of Usage</label>
                            <textarea required rows="5" value={formData.purpose}
                                className="premium-input"
                                style={{ padding: '20px', lineHeight: '1.6' }}
                                placeholder="Describe the activities or session objectives planned for this facility..."
                                onChange={e => setFormData({ ...formData, purpose: e.target.value })} />
                        </div>

                        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                            <button type="submit" style={{
                                flex: 2, padding: '20px', background: 'var(--primary)', color: 'white',
                                border: 'none', borderRadius: '16px', cursor: 'pointer', fontSize: '16px',
                                fontWeight: '900', boxShadow: '0 12px 24px rgba(59, 130, 246, 0.3)',
                                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                            }}
                                onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                                onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                            >
                                <CalendarPlus size={20} /> Initialize Reservation
                            </button>
                            <button type="button" onClick={() => navigate('/catalogue')} style={{
                                flex: 1, padding: '20px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)',
                                border: '1px solid var(--border)', borderRadius: '16px', cursor: 'pointer', fontSize: '16px',
                                fontWeight: '800'
                            }}>
                                Abort
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} /> Requests are processed according to university resource policy.
            </div>
        </div>
    );
};

export default BookResource;
