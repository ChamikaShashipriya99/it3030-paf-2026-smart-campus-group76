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
    ArrowRight,
    Cpu,
    Send
} from 'lucide-react';

const BookResource = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [resource, setResource] = useState(null);
    const [formData, setFormData] = useState({ startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get(`/resources/${id}`)
            .then(res => setResource(res.data))
            .catch(err => console.error(err));
    }, [id]);

    // Determine whether this is an EQUIPMENT or FACILITY asset
    const isEquipment = resource?.assetCategory === 'EQUIPMENT';

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
            setError('Cannot submit a request or booking in the past.');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/bookings', {
                userId:     user.id,
                resourceId: id,
                startTime:  formData.startTime,
                endTime:    formData.endTime,
                purpose:    formData.purpose,
                expectedAttendees: parseInt(formData.expectedAttendees) || 0

            });
            showNotification(
                isEquipment ? 'Equipment booked successfully!' : 'Booking request submitted successfully! Awaiting Admin approval.',
                'success'
            );
            navigate(isEquipment ? '/my-bookings' : '/dashboard');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to submit booking request. Time slot may be overlapping.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!resource) return (
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <div className="skeleton" style={{ width: '100%', maxWidth: '800px', height: '400px', borderRadius: '32px', margin: '0 auto' }} />
        </div>
    );

    // ── Dynamic label / colour tokens ─────────────────────────────────────────
    const accentColor    = isEquipment ? '#7c3aed' : 'var(--primary)';
    const accentLight    = isEquipment ? 'rgba(124,58,237,0.08)' : 'rgba(37,99,235,0.08)';
    const accentShadow   = isEquipment ? 'rgba(124,58,237,0.2)' : 'rgba(37,99,235,0.2)';

    const pageLabel      = isEquipment ? 'Equipment Reservation' : 'Reservation Entry';
    const pageTitle      = isEquipment ? 'Book This Equipment' : 'Secure Your Space';
    const pageSubtitle   = isEquipment
        ? 'Since you have access permission, provide a schedule to lock in your timeline.'
        : 'Provide the schedule and intent to initiate the booking process.';
    const submitLabel    = isEquipment ? 'Confirm Booking' : 'Submit Reservation';
    const guardText      = isEquipment
        ? 'Your equipment booking will be instantly logged against your access permissions.'
        : 'Your booking is subject to administrative approval and university usage policies.';

    return (
        <div className="container" style={{ padding: '40px 0 100px 0' }}>
            {/* Back Button */}
            <button
                onClick={() => navigate('/catalogue')}
                style={{
                    background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#6B7280',
                    padding: '10px 20px', borderRadius: '14px', cursor: 'pointer',
                    fontWeight: '800', marginBottom: '30px',
                    display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = accentColor; }}
                onMouseOut={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#6B7280'; }}
            >
                <ArrowLeft size={16} /> Catalogue
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start' }}>
                {/* ── Main Form Card ────────────────────────────────────────── */}
                <div className="premium-card" style={{ padding: '50px', position: 'relative', overflow: 'hidden' }}>
                    {/* Coloured left accent stripe */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: accentColor }} />

                    <div style={{ marginBottom: '45px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: accentColor, fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            {isEquipment ? <Cpu size={16} /> : <CalendarPlus size={16} />}
                            {pageLabel}
                        </div>
                        <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '900', letterSpacing: '-1.5px' }}>
                            {pageTitle}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '10px' }}>
                            {pageSubtitle}
                        </p>
                    </div>

                    {error && (
                        <div style={{ padding: '20px', background: '#FEF2F2', color: '#EF4444', borderRadius: '20px', marginBottom: '40px', border: '1px solid #FEE2E2', fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                        {/* Date-time fields — identical to existing form */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                                    <Clock size={16} color={accentColor} /> Commencing From
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
                                    <Clock size={16} color={accentColor} /> Concluding At
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
                                    <Users size={16} color={accentColor} /> Expected Attendees
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
                                    <Info size={16} color={accentColor} /> {isEquipment ? 'Purpose / Reason' : 'Context / Intent'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.purpose}
                                    className="premium-input"
                                    placeholder={isEquipment
                                        ? 'Describe why you need this...'
                                        : 'State the objectives...'}
                                    onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Equipment-specific info banner */}
                        {isEquipment && (
                            <div style={{ padding: '16px 20px', background: accentLight, border: `1px solid rgba(124,58,237,0.2)`, borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#7c3aed', fontSize: '14px', fontWeight: '600', lineHeight: '1.5' }}>
                                <Info size={18} style={{ marginTop: '1px', flexShrink: 0 }} />
                                Your request will be saved with status <strong>PENDING</strong>. The admin will review it and you will receive a notification when a decision is made. Approved requests create a confirmed booking automatically.
                            </div>
                        )}

                        {/* Submit */}
                        <div style={{ display: 'flex', gap: '20px', paddingTop: '10px' }}>
                            <button 
                                type="submit" 
                                disabled={submitting} 
                                style={{ 
                                    background: accentColor, 
                                    color: 'white', 
                                    padding: '16px', 
                                    border: 'none', 
                                    borderRadius: '14px', 
                                    cursor: submitting ? 'not-allowed' : 'pointer', 
                                    fontWeight: '800', 
                                    fontSize: '15px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    gap: '8px', 
                                    boxShadow: `0 8px 20px ${accentShadow}`, 
                                    transition: 'all 0.2s', 
                                    opacity: submitting ? 0.7 : 1,
                                    width: '100%'
                                }} 
                                onMouseOver={e => { if (!submitting) e.currentTarget.style.transform = 'translateY(-2px)'; }} 
                                onMouseOut={e => { if (!submitting) e.currentTarget.style.transform = 'translateY(0)'; }}

                            >
                                {submitting ? 'Please wait...' : <><CalendarPlus size={18} /> {submitLabel}</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Sticky Side Info Card ──────────────────────────────────── */}
                <div style={{ position: 'sticky', top: '110px' }}>
                    <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
                        {/* Resource image if available */}
                        {resource.image && (
                            <div style={{ width: '100%', height: '240px', position: 'relative' }}>
                                <img
                                    src={`data:${resource.imageContentType};base64,${resource.image}`}
                                    alt={resource.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>
                                        {isEquipment ? 'Equipment' : 'Identity Code'}
                                    </div>
                                    <div style={{ fontSize: '24px', fontWeight: '900' }}>{resource.name}</div>
                                </div>
                            </div>
                        )}

                        <div style={{ padding: '30px' }}>
                            {/* Asset type badge */}
                            <div style={{ marginBottom: '20px' }}>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '6px 14px', borderRadius: '30px', fontSize: '12px', fontWeight: '800',
                                    background: isEquipment ? 'rgba(124,58,237,0.1)' : 'rgba(37,99,235,0.1)',
                                    color: isEquipment ? '#7c3aed' : 'var(--primary)',
                                    border: `1px solid ${isEquipment ? 'rgba(124,58,237,0.2)' : 'rgba(37,99,235,0.2)'}`,
                                    textTransform: 'uppercase', letterSpacing: '0.5px'
                                }}>
                                    {isEquipment ? <Cpu size={12} /> : <Building2 size={12} />}
                                    {isEquipment ? 'Equipment' : 'Facility'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(37,99,235,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Location</div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{resource.location}</div>
                                    </div>
                                </div>
                                {/* Show capacity only for facilities */}
                                {!isEquipment && resource.capacity > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Capacity</div>
                                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{resource.capacity} Pax</div>
                                        </div>
                                    </div>
                                )}
                                {/* Show brand / quantity for equipment */}
                                {isEquipment && resource.brand && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'rgba(124,58,237,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                                            <Tag size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Brand</div>
                                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{resource.brand}</div>
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(139,92,246,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                                        <Tag size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Type</div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{resource.type?.replace('_', ' ')}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Guard notice */}
                            <div style={{ marginTop: '30px', padding: '20px', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #F3F4F6' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <Shield size={16} color={accentColor} style={{ marginTop: '2px' }} />
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                        <strong>Resource Guard:</strong> {guardText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <CheckCircle2 size={16} color="#10B981" />
                {isEquipment
                    ? 'Your request will be reviewed and you will be notified of the outcome.'
                    : 'System verified and ready for reservation cycle.'}
            </div>
        </div>
    );
};

export default BookResource;
