import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useContext(NotificationContext);

    const fetchMyBookings = () => {
        if (!user) return;
        setLoading(true);
        api.get(`/bookings/user/${user.id}`).then(res => {
            // Artificial delay to show premium skeleton loaders
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

    const cardStyle = {
        flex: 1, minWidth: '200px', background: 'var(--surface)', padding: '25px', borderRadius: '24px',
        boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden'
    };

    const metricStyle = { fontSize: '36px', fontWeight: '800', margin: '10px 0 0 0', color: 'var(--text-main)' };

    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
    const approvedCount = bookings.filter(b => b.status === 'APPROVED').length;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Inter", -apple-system, sans-serif', minHeight: 'calc(100vh - 70px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', color: 'var(--text-main)', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>My Bookings</h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>View and track the status of your facility reservations.</p>
                </div>
                <div style={{ background: 'var(--surface)', color: 'var(--text-muted)', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: '30px', fontSize: '14px', fontWeight: '600' }}>
                    Total: {bookings.length}
                </div>
            </div>

            {/* Simple Metrics Cards */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <div style={cardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#3b82f6' }} />
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Pending</span>
                    <h3 style={metricStyle}>{pendingCount}</h3>
                </div>
                <div style={cardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#10b981' }} />
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Approved</span>
                    <h3 style={metricStyle}>{approvedCount}</h3>
                </div>
            </div>

            <div style={{ background: 'var(--surface)', borderRadius: '24px', boxShadow: 'var(--shadow-soft)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resource</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Purpose</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Schedule</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '20px 24px' }}><div className="skeleton" style={{ width: '150px', height: '18px' }}></div></td>
                                        <td style={{ padding: '20px 24px' }}><div className="skeleton" style={{ width: '200px', height: '16px' }}></div></td>
                                        <td style={{ padding: '20px 24px' }}><div className="skeleton" style={{ width: '140px', height: '14px' }}></div></td>
                                        <td style={{ padding: '20px 24px' }}><div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '12px' }}></div></td>
                                    </tr>
                                ))
                            ) : bookings.map(b => (
                                <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '15px' }}>{b.resource.name}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>ID: #{b.id.substring(0, 8)}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '14px' }}>{b.purpose}</td>
                                    <td style={{ padding: '20px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                        <div>{new Date(b.startTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                                        <div style={{ marginTop: '4px', color: '#94a3b8' }}>to {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <span style={{
                                                fontWeight: '700', fontSize: '11px', padding: '4px 10px', borderRadius: '30px', textAlign: 'center', width: 'fit-content',
                                                backgroundColor: b.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : b.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: b.status === 'APPROVED' ? '#10b981' : b.status === 'REJECTED' ? '#ef4444' : '#f59e0b',
                                                border: `1px solid ${b.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : b.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                            }}>
                                                {b.status}
                                            </span>
                                            {b.rejectionReason && (
                                                <div style={{ fontSize: '11px', color: '#ef4444', fontStyle: 'italic' }}>
                                                    Reason: {b.rejectionReason}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && bookings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>📅</div>
                        <p style={{ fontSize: '16px', fontWeight: '500' }}>You haven't made any bookings yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
