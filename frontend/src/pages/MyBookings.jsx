import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import {
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    MapPin,
    AlertCircle,
    ChevronRight,
    ArrowLeftRight
} from 'lucide-react';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useContext(NotificationContext);

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

    const statsCardStyle = {
        flex: 1, minWidth: '240px', background: 'var(--surface)', padding: '30px', borderRadius: '24px',
        boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden'
    };

    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
    const approvedCount = bookings.filter(b => b.status === 'APPROVED').length;

    return (
        <div className="container" style={{ padding: '60px 0' }}>
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
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Scheduled Period</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Current State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '180px', height: '20px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '220px', height: '18px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '160px', height: '16px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '100px', height: '28px', borderRadius: '14px' }}></div></td>
                                    </tr>
                                ))
                            ) : bookings.map(b => (
                                <tr key={b.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '25px 24px' }}>
                                        <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Calendar size={16} color="var(--primary)" />
                                            {b.resource.name}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <MapPin size={10} /> {b.resource.location}
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 24px', color: 'var(--text-muted)', fontSize: '14px', maxWidth: '300px', lineHeight: '1.5' }}>
                                        {b.purpose}
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
                                            <span style={{
                                                fontWeight: '900', fontSize: '11px', padding: '6px 14px', borderRadius: '30px', textAlign: 'center', width: 'fit-content',
                                                backgroundColor: b.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : b.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: b.status === 'APPROVED' ? '#10b981' : b.status === 'REJECTED' ? '#ef4444' : '#f59e0b',
                                                border: `1px solid ${b.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : b.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                                                textTransform: 'uppercase', letterSpacing: '0.5px'
                                            }}>
                                                {b.status === 'APPROVED' ? <CheckCircle2 size={10} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> : b.status === 'REJECTED' ? <XCircle size={10} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> : <Clock size={10} style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
                                                {b.status}
                                            </span>
                                            {b.rejectionReason && (
                                                <div style={{ fontSize: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.05)', padding: '6px 10px', borderRadius: '8px' }}>
                                                    <AlertCircle size={12} /> {b.rejectionReason}
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
        </div>
    );
};

export default MyBookings;
