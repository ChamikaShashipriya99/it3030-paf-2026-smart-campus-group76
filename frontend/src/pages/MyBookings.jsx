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
    ArrowLeftRight,
    QrCode,
    X,
    Cpu,
    Send
} from 'lucide-react';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [eqRequests, setEqRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eqLoading, setEqLoading] = useState(true);
    const [showQR, setShowQR] = useState(null);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'equipment'
    const { showNotification } = useContext(NotificationContext);

    const fetchMyBookings = () => {
        if (!user) return;
        setLoading(true);
        api.get(`/bookings/user/${user.id}`).then(res => {
            setTimeout(() => {
                setBookings(res.data);
                setLoading(false);
            }, 800);
        }).catch(err => {
            console.error(err);
            setLoading(false);
            showNotification('Failed to load your bookings', 'error');
        });
    };

    const fetchMyEquipmentRequests = () => {
        if (!user) return;
        setEqLoading(true);
        api.get(`/equipment-requests/my?userId=${user.id}`).then(res => {
            setTimeout(() => {
                setEqRequests(res.data);
                setEqLoading(false);
            }, 800);
        }).catch(err => {
            console.error(err);
            setEqLoading(false);
        });
    };

    useEffect(() => {
        fetchMyBookings();
        fetchMyEquipmentRequests();
    }, [user]);

    const statsCardStyle = {
        flex: 1, minWidth: '200px', background: 'var(--surface)', padding: '28px', borderRadius: '24px',
        boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden'
    };

    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
    const approvedCount = bookings.filter(b => b.status === 'APPROVED' || b.status === 'CHECKED_IN').length;
    const eqPendingCount = eqRequests.filter(r => r.status === 'PENDING').length;
    const eqApprovedCount = eqRequests.filter(r => r.status === 'APPROVED').length;

    const statusBadgeStyle = (status) => ({
        fontWeight: '900', fontSize: '11px', padding: '5px 12px', borderRadius: '30px',
        textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '5px',
        backgroundColor:
            status === 'APPROVED' ? 'rgba(16,185,129,0.1)' :
            status === 'REJECTED' ? 'rgba(239,68,68,0.1)' :
            status === 'CHECKED_IN' ? 'rgba(37,99,235,0.1)' :
            'rgba(245,158,11,0.1)',
        color:
            status === 'APPROVED' ? '#10b981' :
            status === 'REJECTED' ? '#ef4444' :
            status === 'CHECKED_IN' ? '#2563EB' :
            '#f59e0b',
        border: `1px solid ${
            status === 'APPROVED' ? 'rgba(16,185,129,0.2)' :
            status === 'REJECTED' ? 'rgba(239,68,68,0.2)' :
            status === 'CHECKED_IN' ? 'rgba(37,99,235,0.2)' :
            'rgba(245,158,11,0.2)'
        }`
    });

    const tabBtnStyle = (tab) => ({
        padding: '12px 28px', border: 'none', borderRadius: '14px', cursor: 'pointer',
        fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px',
        transition: 'all 0.2s',
        background: activeTab === tab ? 'var(--primary)' : 'transparent',
        color: activeTab === tab ? 'white' : 'var(--text-muted)',
        boxShadow: activeTab === tab ? '0 8px 20px rgba(59,130,246,0.25)' : 'none'
    });

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            {/* QR Modal Overlay */}
            {showQR && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }} onClick={() => setShowQR(null)}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', textAlign: 'center', position: 'relative', maxWidth: '400px', width: '90%' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowQR(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                        <div style={{ padding: '20px', background: '#F9FAFB', borderRadius: '24px', display: 'inline-block', marginBottom: '25px' }}>
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${showQR.id}`} alt="QR Code" style={{ width: '200px', height: '200px', display: 'block' }} />
                        </div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '900' }}>Access Pass</h3>
                        <p style={{ margin: 0, color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>Present this QR at <b>{showQR.resource?.name || 'Deleted Asset'}</b> for immediate entry verification.</p>
                        <div style={{ marginTop: '25px', padding: '12px', background: '#ECFDF5', color: '#10B981', borderRadius: '12px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Verified Asset: #{showQR.id.substring(0, 8)}</div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="page-title">My Bookings & Requests</h2>
                    <p className="page-subtitle">Track your facility reservations and equipment request statuses.</p>
                </div>
                <div style={{ background: 'rgba(96, 165, 250, 0.1)', color: 'var(--primary)', padding: '10px 20px', borderRadius: '14px', fontSize: '14px', fontWeight: '800', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                    {bookings.length + eqRequests.length} Total Records
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f59e0b' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Facility Pending</span>
                        <Clock size={18} color="#f59e0b" />
                    </div>
                    <h3 style={{ fontSize: '34px', fontWeight: '900', margin: '12px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{pendingCount}</h3>
                </div>
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#10b981' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Confirmed Bookings</span>
                        <CheckCircle2 size={18} color="#10b981" />
                    </div>
                    <h3 style={{ fontSize: '34px', fontWeight: '900', margin: '12px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{approvedCount}</h3>
                </div>
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f59e0b' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Eq. Requests Pending</span>
                        <Cpu size={18} color="#f59e0b" />
                    </div>
                    <h3 style={{ fontSize: '34px', fontWeight: '900', margin: '12px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{eqPendingCount}</h3>
                </div>
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#8b5cf6' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Eq. Approved</span>
                        <Send size={18} color="#8b5cf6" />
                    </div>
                    <h3 style={{ fontSize: '34px', fontWeight: '900', margin: '12px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{eqApprovedCount}</h3>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: 'var(--surface)', padding: '8px', borderRadius: '18px', border: '1px solid var(--border)', width: 'fit-content' }}>
                <button style={tabBtnStyle('bookings')} onClick={() => setActiveTab('bookings')}>
                    <Calendar size={16} /> Facility Bookings
                </button>
                <button style={tabBtnStyle('equipment')} onClick={() => setActiveTab('equipment')}>
                    <Cpu size={16} /> Equipment Requests
                    {eqPendingCount > 0 && (
                        <span style={{ background: '#f59e0b', color: 'white', fontSize: '10px', fontWeight: '900', padding: '2px 7px', borderRadius: '20px', marginLeft: '4px' }}>
                            {eqPendingCount}
                        </span>
                    )}
                </button>
            </div>

            {/* ===== FACILITY BOOKINGS TAB ===== */}
            {activeTab === 'bookings' && (
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
                                                {b.resource?.name || 'Deleted Asset'}
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <MapPin size={10} /> {b.resource?.location || 'Unknown Location'}
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
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={statusBadgeStyle(b.status)}>
                                                        {b.status === 'APPROVED' ? <CheckCircle2 size={10} /> : b.status === 'REJECTED' ? <XCircle size={10} /> : <Clock size={10} />}
                                                        {b.status.replace('_', ' ')}
                                                    </span>
                                                    {b.status === 'APPROVED' && (
                                                        <button
                                                            onClick={() => setShowQR(b)}
                                                            style={{ padding: '6px 10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '900' }}>
                                                            <QrCode size={12} /> Get Pass
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!loading && bookings.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '60px', marginBottom: '25px', opacity: 0.2 }}>📁</div>
                            <h4 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 10px 0' }}>No Facility Bookings</h4>
                            <p style={{ fontSize: '15px', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>You haven't made any facility reservations yet. Visit the catalogue to start.</p>
                            <button onClick={() => window.location.href = '/catalogue'} style={{ marginTop: '30px', padding: '14px 28px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800' }}>
                                Browse Assets <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ===== EQUIPMENT REQUESTS TAB ===== */}
            {activeTab === 'equipment' && (
                <div className="premium-card" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Equipment</th>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Purpose</th>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Request Date & Time</th>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eqLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '180px', height: '20px' }}></div></td>
                                            <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '220px', height: '18px' }}></div></td>
                                            <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '160px', height: '16px' }}></div></td>
                                            <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '100px', height: '28px', borderRadius: '14px' }}></div></td>
                                        </tr>
                                    ))
                                ) : eqRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(r => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '25px 24px' }}>
                                            <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <Cpu size={16} color="#7c3aed" />
                                                {r.resourceName}
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px' }}>
                                                Request #{r.id.substring(0, 8)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '25px 24px', color: 'var(--text-muted)', fontSize: '14px', maxWidth: '260px', lineHeight: '1.5' }}>
                                            {r.purpose}
                                        </td>
                                        <td style={{ padding: '25px 24px', fontSize: '13px' }}>
                                            <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                                                {r.requestDate}
                                            </div>
                                            <div style={{ marginTop: '6px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Clock size={12} />
                                                {r.startTime ? new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                                                <ArrowLeftRight size={10} opacity={0.5} />
                                                {r.endTime ? new Date(r.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '25px 24px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <span style={statusBadgeStyle(r.status)}>
                                                    {r.status === 'APPROVED' ? <CheckCircle2 size={10} /> : r.status === 'REJECTED' ? <XCircle size={10} /> : <Clock size={10} />}
                                                    {r.status}
                                                </span>

                                                {r.rejectionReason && (
                                                    <div style={{ fontSize: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.05)', padding: '6px 10px', borderRadius: '8px' }}>
                                                        <AlertCircle size={12} /> {r.rejectionReason}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!eqLoading && eqRequests.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '60px', marginBottom: '25px', opacity: 0.2 }}>🔌</div>
                            <h4 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 10px 0' }}>No Equipment Requests</h4>
                            <p style={{ fontSize: '15px', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>You haven't requested any equipment yet. Visit the catalogue and click <b>Request</b> on any equipment card.</p>
                            <button onClick={() => window.location.href = '/catalogue'} style={{ marginTop: '30px', padding: '14px 28px', background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800' }}>
                                Browse Equipment <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
