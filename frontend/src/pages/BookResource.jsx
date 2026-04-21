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
    CalendarPlus,
    Building2,
    Info,
    Shield,
    ArrowRight
} from 'lucide-react';

const BookResource = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [resource, setResource] = useState(null);
    const [formData, setFormData] = useState({ startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
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
                purpose: formData.purpose,
                expectedAttendees: parseInt(formData.expectedAttendees) || 0
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
                onMouseOver={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#2563EB'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#6B7280'; }}
            >
                <ArrowLeft size={16} /> Catalogue
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start' }}>
                {/* Main Action Area */}
                <div className="premium-card" style={{ padding: '50px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary)' }} />

                    <div style={{ marginBottom: '45px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            <CalendarPlus size={16} /> Reservation Entry
                        </div>
                        <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '900', letterSpacing: '-1.5px' }}>Secure Your Space</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '10px' }}>Provide the schedule and intent to initiate the booking process.</p>
                    </div>

                    {error && (
                        <div style={{ padding: '20px', background: '#FEF2F2', color: '#EF4444', borderRadius: '20px', marginBottom: '40px', border: '1px solid #FEE2E2', fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                    <Clock size={16} color="var(--primary)" /> Commencing From
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.startTime}
                                    className="premium-input"
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                    <Clock size={16} color="var(--primary)" /> Concluding At
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.endTime}
                                    className="premium-input"
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                    <Users size={16} color="var(--primary)" /> Expected Attendees
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.expectedAttendees}
                                    className="premium-input"
                                    placeholder="e.g. 25"
                                    onChange={e => setFormData({ ...formData, expectedAttendees: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                    <Info size={16} color="var(--primary)" /> Context / Intent of Usage
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.purpose}
                                    className="premium-input"
                                    placeholder="State the objectives or activities planned..."
                                    onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', paddingTop: '10px' }}>
                            <button type="submit" style={{
                                flex: 1, padding: '20px', background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white',
                                border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '18px',
                                fontWeight: '900', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
                            }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Submit Request <ArrowRight size={20} />
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
                                    <div style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Identity Code</div>
                                    <div style={{ fontSize: '24px', fontWeight: '900' }}>{resource.name}</div>
                                </div>
                            </div>
                        )}

                        <div style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Location</div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{resource.location}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Capacity</div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{resource.capacity} Pax</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                                        <Tag size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Classification</div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{resource.type.replace('_', ' ')}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '30px', padding: '20px', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #F3F4F6' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <Shield size={16} color="var(--primary)" style={{ marginTop: '2px' }} />
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                        <strong>Resource Guard:</strong> Your booking is subject to administrative approval and university usage policies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <CheckCircle2 size={16} color="#10B981" /> System verified and ready for reservation cycle.
            </div>
        </div>
    );
};

export default BookResource;
