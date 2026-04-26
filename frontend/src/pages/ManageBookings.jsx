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
    Scan,
    Users,
    X,
    Cpu
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [eqRequests, setEqRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eqLoading, setEqLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings');
    const [searchQuery, setSearchQuery] = useState('');
    const [eqSearchQuery, setEqSearchQuery] = useState('');
    const [eqStatusFilter, setEqStatusFilter] = useState('ALL');
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const { showNotification } = useContext(NotificationContext);

    const fetchBookings = () => {
        setLoading(true);
        api.get('/bookings').then(res => {
            setTimeout(() => {
                setBookings(res.data);
                setLoading(false);
            }, 800);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    const fetchEquipmentRequests = () => {
        setEqLoading(true);
        api.get('/equipment-requests/all').then(res => {
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
        fetchBookings();
        fetchEquipmentRequests();
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

    const approveEquipmentRequest = async (id) => {
        try {
            await api.put(`/equipment-requests/${id}/approve`);
            fetchEquipmentRequests();
            fetchBookings();
            showNotification('Equipment request approved.', 'success');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Failed to approve request.', 'error');
        }
    };

    const rejectEquipmentRequest = async (id) => {
        const reason = prompt('Provide a rejection reason (optional):');
        try {
            await api.put(`/equipment-requests/${id}/reject`, reason ? { reason } : {});
            fetchEquipmentRequests();
            showNotification('Equipment request rejected.', 'success');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Failed to reject request.', 'error');
        }
    };

    useEffect(() => {
        let scanner;
        if (isScannerOpen) {
            scanner = new Html5QrcodeScanner("reader", { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            }, false);

            scanner.render(async (decodedText) => {
                scanner.clear();
                setIsScannerOpen(false);
                
                let bookingId = decodedText;
                if (decodedText.startsWith("SMARTCAMPUS-TOKEN-")) {
                    const parts = decodedText.split("-");
                    bookingId = parts[2];
                }

                try {
                    await api.post(`/bookings/${bookingId}/checkin`);
                    showNotification("Scanned: Successful QR Check-in", "success");
                    fetchBookings();
                } catch (e) {
                    showNotification(e.response?.data?.message || "Check-in Failed", "error");
                }
            }, (error) => {});
        }
        return () => { if (scanner) scanner.clear().catch(e => {}); };
    }, [isScannerOpen]);

    const handleCheckIn = () => setIsScannerOpen(true);

    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
    const approvedCount = bookings.filter(b => b.status === 'APPROVED').length;
    const checkedInCount = bookings.filter(b => b.status === 'CHECKED_IN').length;
    const eqPendingCount = eqRequests.filter(r => r.status === 'PENDING').length;

    const statsCardStyle = {
        flex: 1, minWidth: '220px', background: 'var(--surface)', padding: '30px', borderRadius: '24px',
        boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden'
    };

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
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 className="page-title">Booking & Request Management</h2>
                    <p className="page-subtitle">Administrative oversight for all university facilities and equipment.</p>
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

            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', marginBottom: '40px' }}>
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
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f59e0b' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Equipment</span>
                        <Cpu size={20} color="#f59e0b" />
                    </div>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', margin: '15px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{eqPendingCount}</h3>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: 'var(--surface)', padding: '8px', borderRadius: '18px', border: '1px solid var(--border)', width: 'fit-content' }}>
                <button style={tabBtnStyle('bookings')} onClick={() => setActiveTab('bookings')}>
                    <Calendar size={16} /> Facility Bookings
                </button>
                <button style={tabBtnStyle('equipment')} onClick={() => setActiveTab('equipment')}>
                    <Cpu size={16} /> Equipment Requests
                    {eqPendingCount > 0 && (
                        <span style={{ background: '#ef4444', color: 'white', fontSize: '10px', fontWeight: '900', padding: '2px 7px', borderRadius: '20px', marginLeft: '4px' }}>
                            {eqPendingCount}
                        </span>
                    )}
                </button>
            </div>

            {activeTab === 'bookings' ? (
                <div style={{ background: 'var(--surface)', borderRadius: '24px', boxShadow: 'var(--shadow-soft)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: '350px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="text" placeholder="Search by requester, facility or ID..." className="premium-input" style={{ padding: '10px 12px 10px 40px', fontSize: '14px' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Log Ref</th>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Asset & Purpose</th>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Requester</th>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Expected Attendees</th>
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
                                            <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '60px', height: '18px' }}></div></td>
                                            <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '140px', height: '30px' }}></div></td>
                                            <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '120px', height: '40px', borderRadius: '12px' }}></div></td>
                                        </tr>
                                    ))
                                ) : bookings.filter(b => {
                                    const query = searchQuery.toLowerCase();
                                    return (b.resource?.name?.toLowerCase().includes(query)) || (b.user?.name?.toLowerCase().includes(query)) || (b.id?.toLowerCase().includes(query));
                                }).map(b => (
                                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '25px 24px', color: 'var(--text-muted)', fontWeight: '800', fontSize: '13px' }}>#{b.id.substring(0, 8)}</td>
                                        <td style={{ padding: '25px 24px' }}>
                                            <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Calendar size={14} color="var(--primary)" /> {b.resource?.name || 'Unknown Asset'}
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px', opacity: 0.8 }}>{(b.purpose || '').substring(0, 40)}...</div>
                                        </td>
                                        <td style={{ padding: '25px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--border)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '12px' }}>{b.user?.name?.charAt(0) || '?'}</div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{b.user?.name || 'Unknown User'}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.user?.email || 'No Email'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '25px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: '700', fontSize: '15px' }}>
                                                <Users size={14} color="#8B5CF6" />
                                                {b.expectedAttendees || 0} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Pax</span>
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
                                                    <button onClick={() => updateStatus(b.id, 'APPROVED')} style={{ background: 'var(--primary)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)', transition: 'all 0.2s' }}>Approve</button>
                                                    <button onClick={() => { const reason = prompt('Provide rejection reason:'); if (reason) updateStatus(b.id, 'REJECTED', reason); }} style={{ background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontWeight: '800', fontSize: '13px' }}>Reject</button>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{
                                                        fontWeight: '800', fontSize: '11px', padding: '6px 14px', borderRadius: '30px', letterSpacing: '0.5px',
                                                        backgroundColor: b.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : b.status === 'CHECKED_IN' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        color: b.status === 'APPROVED' ? '#10b981' : b.status === 'CHECKED_IN' ? '#2563EB' : '#ef4444',
                                                        border: `1px solid ${b.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : b.status === 'CHECKED_IN' ? 'rgba(37,99,235,0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                                        textTransform: 'uppercase'
                                                    }}>{b.status.replace('_', ' ')}</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div style={{ background: 'var(--surface)', borderRadius: '24px', boxShadow: 'var(--shadow-soft)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: '350px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="text" placeholder="Search equipment requests..." className="premium-input" style={{ padding: '10px 12px 10px 40px', fontSize: '14px' }} value={eqSearchQuery} onChange={(e) => setEqSearchQuery(e.target.value)} />
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Ref</th>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Equipment & Purpose</th>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Requester</th>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Requested For</th>
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eqLoading ? Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i}><td colSpan="5" style={{ padding: '20px' }}><div className="skeleton" style={{ width: '100%', height: '20px' }}></div></td></tr>
                                )) : eqRequests.filter(r => {
                                    const query = eqSearchQuery.toLowerCase();
                                    return (r.resourceName?.toLowerCase().includes(query)) || (r.userName?.toLowerCase().includes(query));
                                }).map(r => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '25px 24px', color: 'var(--text-muted)', fontWeight: '800', fontSize: '13px' }}>#{r.id.substring(0, 8)}</td>
                                        <td style={{ padding: '25px 24px' }}>
                                            <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '15px' }}>{r.resourceName}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{r.purpose}</div>
                                        </td>
                                        <td style={{ padding: '25px 24px' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{r.userName}</div>
                                        </td>
                                        <td style={{ padding: '25px 24px', fontSize: '13px' }}>
                                            <div style={{ fontWeight: '600' }}>{r.requestDate}</div>
                                        </td>
                                        <td style={{ padding: '25px 24px' }}>
                                            {r.status === 'PENDING' ? (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => approveEquipmentRequest(r.id)} style={{ background: '#7c3aed', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '12px' }}>Approve</button>
                                                    <button onClick={() => rejectEquipmentRequest(r.id)} style={{ background: 'rgba(239,68,68,0.05)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.1)', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '12px' }}>Reject</button>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '11px', fontWeight: '900', color: r.status === 'APPROVED' ? '#10b981' : '#ef4444' }}>{r.status}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isScannerOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '32px', padding: '40px', position: 'relative' }}>
                        <button onClick={() => setIsScannerOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--border)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}><X size={18} /></button>
                        <div id="reader"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;
