import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { NotificationContext } from '../context/NotificationContext';
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Clock,
    Calendar,
    User,
    ArrowRight,
    Search,
    Filter,
    FileText,
    QrCode,
    Scan
} from 'lucide-react';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useContext(NotificationContext);

    const fetchBookings = () => {
        setLoading(true);
        api.get('/bookings').then(res => {
            setTimeout(() => {
                setBookings(res.data);
                setLoading(false);
            }, 1000);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id, newStatus, reason = null) => {
        try {
            await api.put(`/bookings/${id}/status`, { status: newStatus, rejectionReason: reason });
            fetchBookings();
            showNotification(`Booking successfully marked as ${newStatus}`, 'success');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Failed to update booking status.', 'error');
        }
    };

    const handleCheckIn = async () => {
        const bid = prompt("Enter Booking ID to Check-in (Simulation):");
        if (!bid) return;
        try {
            await api.post(`/bookings/${bid}/checkin`);
            showNotification("Successful QR Check-in", "success");
            fetchBookings();
        } catch (e) {
            showNotification(e.response?.data?.message || "Check-in Failed", "error");
        }
    };

    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
    const approvedCount = bookings.filter(b => b.status === 'APPROVED').length;
    const checkedInCount = bookings.filter(b => b.status === 'CHECKED_IN').length;

    const statsCardStyle = {
        flex: 1, minWidth: '220px', background: 'var(--surface)', padding: '30px', borderRadius: '24px',
        boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden'
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 className="page-title">Booking Management</h2>
                    <p className="page-subtitle">Administrative oversight for all university facility reservations.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={handleCheckIn} style={{ background: '#000', color: 'white', padding: '12px 24px', borderRadius: '14px', fontSize: '14px', fontWeight: '900', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <Scan size={18} /> Simulate QR Scan
                    </button>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '12px 24px', borderRadius: '14px', fontSize: '13px', fontWeight: '800', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={16} /> Admin Authority
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', marginBottom: '50px' }}>
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Awaiting</span>
                        <Clock size={20} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', margin: '15px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{pendingCount}</h3>
                </div>
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#10b981' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Approved</span>
                        <CheckCircle2 size={20} color="#10b981" />
                    </div>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', margin: '15px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{approvedCount}</h3>
                </div>
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#2563EB' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Checked-In</span>
                        <QrCode size={20} color="#2563EB" />
                    </div>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', margin: '15px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{checkedInCount}</h3>
                </div>
            </div>

            <div style={{ background: 'var(--surface)', borderRadius: '24px', boxShadow: 'var(--shadow-soft)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '350px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Search by requester, facility or ID..." className="premium-input" style={{ padding: '10px 12px 10px 40px', fontSize: '14px' }} />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Log Ref</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Asset & Purpose</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Requester</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Scheduled Timeline</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Decision</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '60px', height: '16px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '200px', height: '18px', marginBottom: '8px' }}></div><div className="skeleton" style={{ width: '140px', height: '12px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '160px', height: '16px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '140px', height: '30px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '120px', height: '40px', borderRadius: '12px' }}></div></td>
                                    </tr>
                                ))
                            ) : bookings.map(b => (
                                <tr key={b.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '25px 24px', color: 'var(--text-muted)', fontWeight: '800', fontSize: '13px' }}>#{b.id.substring(0, 8)}</td>
                                    <td style={{ padding: '25px 24px' }}>
                                        <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Calendar size={14} color="var(--primary)" /> {b.resource.name}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px', opacity: 0.8 }}>{b.purpose.substring(0, 40)}...</div>
                                    </td>
                                    <td style={{ padding: '25px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--border)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '12px' }}>{b.user.name.charAt(0)}</div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{b.user.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 24px', fontSize: '13px' }}>
                                        <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>{new Date(b.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                                        <div style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <ArrowRight size={10} /> {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 24px' }}>
                                        {b.status === 'PENDING' ? (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => updateStatus(b.id, 'APPROVED')} style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.transform = 'translateY(-1px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>Approve</button>
                                                <button onClick={() => {
                                                    const reason = prompt('Provide rejection reason:');
                                                    if (reason) updateStatus(b.id, 'REJECTED', reason);
                                                }} style={{ background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px' }}>Reject</button>
                                            </div>
                                        ) : (
                                            <span style={{
                                                fontWeight: '800', fontSize: '11px', padding: '6px 14px', borderRadius: '30px', letterSpacing: '0.5px',
                                                backgroundColor: b.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : b.status === 'CHECKED_IN' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: b.status === 'APPROVED' ? '#10b981' : b.status === 'CHECKED_IN' ? '#2563EB' : '#ef4444',
                                                border: `1px solid ${b.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : b.status === 'CHECKED_IN' ? 'rgba(37,99,235,0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                                textTransform: 'uppercase'
                                            }}>
                                                {b.status.replace('_', ' ')}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && bookings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
                        <FileText size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
                        <p style={{ fontSize: '16px', fontWeight: '500' }}>The booking registry is currently empty.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBookings;
