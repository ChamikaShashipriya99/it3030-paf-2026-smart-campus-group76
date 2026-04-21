import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { QRCodeSVG } from 'qrcode.react';
import {
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    MapPin,
    AlertCircle,
    ChevronRight,
    ArrowLeftRight,
    QrCode as QrIcon,
    X,
    ShieldCheck,
    Users,
    Pencil,
    Save,
    Loader2
} from 'lucide-react';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showQR, setShowQR] = useState(null);
    const { showNotification } = useContext(NotificationContext);

    // Update modal state
    const [editBooking, setEditBooking] = useState(null);
    const [editForm, setEditForm] = useState({ purpose: '', startTime: '', endTime: '', expectedAttendees: 0 });
    const [updating, setUpdating] = useState(false);

    const fetchMyBookings = () => {
        if (!user) return;
        setLoading(true);
        api.get(`/bookings/user/${user.id}`).then(res => {
            setTimeout(() => {
                setBookings(res.data);
                setLoading(false);
            }, 1000);
        }).catch(err => {
            console.error(err);
            setLoading(false);
            showNotification('Failed to load your bookings', 'error');
        });
    };

    useEffect(() => {
        fetchMyBookings();
    }, [user]);

    // Open edit modal and populate form
    const openEditModal = (booking) => {
        const formatForInput = (dateStr) => {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };
        setEditBooking(booking);
        setEditForm({
            purpose: booking.purpose || '',
            startTime: formatForInput(booking.startTime),
            endTime: formatForInput(booking.endTime),
            expectedAttendees: booking.expectedAttendees || 0
        });
    };

    // Handle update submission
    const handleUpdate = async () => {
        if (!editForm.purpose.trim()) {
            showNotification('Purpose is required', 'error');
            return;
        }
        if (!editForm.startTime || !editForm.endTime) {
            showNotification('Start time and end time are required', 'error');
            return;
        }
        if (new Date(editForm.endTime) <= new Date(editForm.startTime)) {
            showNotification('End time must be after start time', 'error');
            return;
        }

        setUpdating(true);
        try {
            const payload = {
                purpose: editForm.purpose,
                startTime: editForm.startTime + ':00',
                endTime: editForm.endTime + ':00',
                expectedAttendees: parseInt(editForm.expectedAttendees) || 0
            };
            await api.put(`/bookings/${editBooking.id}`, payload);
            showNotification('Booking updated successfully!', 'success');
            setEditBooking(null);
            fetchMyBookings();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update booking';
            showNotification(msg, 'error');
        } finally {
            setUpdating(false);
        }
    };

    const statsCardStyle = {
        flex: 1, minWidth: '240px', background: 'var(--surface)', padding: '30px', borderRadius: '24px',
        boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden'
    };

    const inputStyle = {
        width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border)',
        background: 'var(--surface)', color: 'var(--text-main)', fontSize: '14px', fontWeight: '600',
        outline: 'none', transition: 'border 0.2s, box-shadow 0.2s', boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px'
    };

    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
    const approvedCount = bookings.filter(b => b.status === 'APPROVED' || b.status === 'CHECKED_IN').length;

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            {/* QR Modal Overlay */}
            {showQR && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }} onClick={() => setShowQR(null)}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', textAlign: 'center', position: 'relative', maxWidth: '400px', width: '90%' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowQR(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                        <div style={{ padding: '25px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '32px', display: 'inline-block', marginBottom: '25px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                            <QRCodeSVG 
                                value={`SMARTCAMPUS-TOKEN-${showQR.id}-${showQR.user.id}`} 
                                size={200}
                                level={"H"}
                                includeMargin={false}
                                imageSettings={{
                                    src: "/SmartCampus.png",
                                    x: undefined,
                                    y: undefined,
                                    height: 40,
                                    width: 40,
                                    excavate: true,
                                }}
                            />
                        </div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '900' }}>Access Pass</h3>
                        <p style={{ margin: 0, color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>Present this QR at <b>{showQR.resource.name}</b> for immediate entry verification.</p>
                        <div style={{ marginTop: '25px', padding: '12px', background: '#ECFDF5', color: '#10B981', borderRadius: '12px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Verified Asset: #{showQR.id.substring(0, 8)}</div>
                    </div>
                </div>
            )}

            {/* Update Booking Modal */}
            {editBooking && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }} onClick={() => !updating && setEditBooking(null)}>
                    <div style={{
                        background: 'var(--surface)', padding: '40px', borderRadius: '28px',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative', maxWidth: '520px', width: '90%',
                        border: '1px solid var(--border)', animation: 'fadeIn 0.3s ease'
                    }} onClick={e => e.stopPropagation()}>
                        {/* Close button */}
                        <button onClick={() => !updating && setEditBooking(null)} style={{
                            position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)', borderRadius: '50%', width: '40px', height: '40px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
                        }}><X size={18} /></button>

                        {/* Header */}
                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #60A5FA, #8B5CF6)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Pencil size={20} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: 'var(--text-main)' }}>Update Booking</h3>
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
                                        {editBooking.resource?.name || 'Resource'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Purpose */}
                            <div>
                                <label style={labelStyle}>Purpose / Nature</label>
                                <textarea
                                    value={editForm.purpose}
                                    onChange={e => setEditForm({ ...editForm, purpose: e.target.value })}
                                    rows={3}
                                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                                    placeholder="Enter booking purpose..."
                                />
                            </div>

                            {/* Date/Time row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Start Time</label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.startTime}
                                        onChange={e => setEditForm({ ...editForm, startTime: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>End Time</label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.endTime}
                                        onChange={e => setEditForm({ ...editForm, endTime: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* Expected Attendees */}
                            <div>
                                <label style={labelStyle}>Expected Attendees</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editForm.expectedAttendees}
                                    onChange={e => setEditForm({ ...editForm, expectedAttendees: e.target.value })}
                                    style={inputStyle}
                                    placeholder="Number of attendees"
                                />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '30px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => !updating && setEditBooking(null)}
                                disabled={updating}
                                style={{
                                    padding: '14px 24px', borderRadius: '14px', border: '1px solid var(--border)',
                                    background: 'transparent', color: 'var(--text-muted)', fontSize: '14px',
                                    fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                style={{
                                    padding: '14px 28px', borderRadius: '14px', border: 'none',
                                    background: updating ? '#9CA3AF' : 'linear-gradient(135deg, #60A5FA, #8B5CF6)',
                                    color: 'white', fontSize: '14px', fontWeight: '800', cursor: updating ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                                    boxShadow: updating ? 'none' : '0 4px 15px rgba(96, 165, 250, 0.4)'
                                }}
                            >
                                {updating ? (
                                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</>
                                ) : (
                                    <><Save size={16} /> Save Changes</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="page-title">My Bookings</h2>
                    <p className="page-subtitle">Historical and current status of your facility reservations.</p>
                </div>
                <div style={{ background: 'rgba(96, 165, 250, 0.1)', color: 'var(--primary)', padding: '10px 20px', borderRadius: '14px', fontSize: '14px', fontWeight: '800', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                    {bookings.length} Total Requests
                </div>
            </div>

            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', marginBottom: '50px' }}>
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f59e0b' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Awaiting Approval</span>
                        <Clock size={20} color="#f59e0b" />
                    </div>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', margin: '15px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{pendingCount}</h3>
                </div>
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#10b981' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Confirmed Bookings</span>
                        <CheckCircle2 size={20} color="#10b981" />
                    </div>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', margin: '15px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{approvedCount}</h3>
                </div>
            </div>

            <div className="premium-card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Asset Details</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Purpose / Nature</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Expected Attendees</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Scheduled Period</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Current State</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '180px', height: '20px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '220px', height: '18px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '60px', height: '18px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '160px', height: '16px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '100px', height: '28px', borderRadius: '14px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '80px', height: '28px', borderRadius: '14px' }}></div></td>
                                    </tr>
                                ))
                            ) : bookings.map(b => (
                                <tr key={b.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '25px 24px' }}>
                                        <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Calendar size={16} color="var(--primary)" />
                                            {b.resource?.name || 'Unknown Resource'}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <MapPin size={10} /> {b.resource?.location || 'No Location'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 24px', color: 'var(--text-muted)', fontSize: '14px', maxWidth: '300px', lineHeight: '1.5' }}>
                                        {b.purpose}
                                    </td>
                                    <td style={{ padding: '25px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: '700', fontSize: '15px' }}>
                                            <Users size={14} color="#8B5CF6" />
                                            {b.expectedAttendees || 0} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Pax</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 24px', fontSize: '13px' }}>
                                        <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                                            {new Date(b.startTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div style={{ marginTop: '6px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clock size={12} />
                                            {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            <ArrowLeftRight size={10} opacity={0.5} />
                                            {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{
                                                    fontWeight: '900', fontSize: '11px', padding: '6px 14px', borderRadius: '30px', textAlign: 'center', width: 'fit-content',
                                                    backgroundColor: b.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : b.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : b.status === 'CHECKED_IN' ? 'rgba(37, 99, 235, 0.1)' : b.status === 'CANCELLED' ? 'rgba(107, 114, 128, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: b.status === 'APPROVED' ? '#10b981' : b.status === 'REJECTED' ? '#ef4444' : b.status === 'CHECKED_IN' ? '#2563EB' : b.status === 'CANCELLED' ? '#6B7280' : '#f59e0b',
                                                    border: `1px solid ${b.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : b.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : b.status === 'CHECKED_IN' ? 'rgba(37, 99, 235, 0.2)' : b.status === 'CANCELLED' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                                                    textTransform: 'uppercase', letterSpacing: '0.5px'
                                                }}>
                                                    {b.status === 'APPROVED' ? <CheckCircle2 size={10} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> : b.status === 'CHECKED_IN' ? <ShieldCheck size={10} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> : b.status === 'REJECTED' ? <XCircle size={10} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> : <Clock size={10} style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
                                                    {b.status.replace('_', ' ')}
                                                </span>
                                                {b.status === 'APPROVED' && (
                                                    <button
                                                        onClick={() => setShowQR(b)}
                                                        style={{ padding: '6px 10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '900' }}>
                                                        <QrIcon size={12} /> Get Pass
                                                    </button>
                                                )}
                                            </div>
                                            {b.rejectionReason && (
                                                <div style={{ fontSize: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.05)', padding: '6px 10px', borderRadius: '8px' }}>
                                                    <AlertCircle size={12} /> {b.rejectionReason}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 24px' }}>
                                        {b.status === 'PENDING' && (
                                            <button
                                                onClick={() => openEditModal(b)}
                                                style={{
                                                    padding: '8px 16px', borderRadius: '10px', border: 'none',
                                                    background: 'linear-gradient(135deg, #60A5FA, #8B5CF6)', color: 'white',
                                                    fontSize: '12px', fontWeight: '800', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    transition: 'all 0.2s', boxShadow: '0 3px 10px rgba(96, 165, 250, 0.3)',
                                                    whiteSpace: 'nowrap'
                                                }}
                                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(96, 165, 250, 0.4)'; }}
                                                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(96, 165, 250, 0.3)'; }}
                                            >
                                                <Pencil size={12} /> Update
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && bookings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '60px', marginBottom: '25px', opacity: 0.2 }}>📁</div>
                        <h4 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 10px 0' }}>No Records Found</h4>
                        <p style={{ fontSize: '15px', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>You haven't initiated any resource booking requests yet. Visit the catalogue to start.</p>
                        <button onClick={() => window.location.href = '/catalogue'} style={{ marginTop: '30px', padding: '14px 28px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800' }}>
                            Browse Assets <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Inline keyframes for spinner animation */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default MyBookings;
