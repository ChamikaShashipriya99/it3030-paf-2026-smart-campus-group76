import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { NotificationContext } from '../context/NotificationContext';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useContext(NotificationContext);
    
    const fetchBookings = () => {
        setLoading(true);
        api.get('/bookings').then(res => {
            // Artificial delay to show premium skeleton loaders for 3 seconds
            setTimeout(() => {
                setBookings(res.data);
                setLoading(false);
            }, 3000);
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
            fetchBookings(); // Refresh grid
            showNotification(`Booking successfully marked as ${newStatus}`, 'success');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Failed to update booking status due to conflicts.', 'error');
        }
    };

    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
    const approvedCount = bookings.filter(b => b.status === 'APPROVED').length;
    const rejectedCount = bookings.filter(b => b.status === 'REJECTED').length;

    const cardStyle = {
        flex: 1, minWidth: '200px', background: 'white', padding: '25px', borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative', overflow: 'hidden'
    };
    
    const metricStyle = { fontSize: '36px', fontWeight: '800', margin: '10px 0 0 0', color: '#1a202c' };

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Inter", -apple-system, sans-serif', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 70px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Manage Bookings</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Oversee and approve facility reservations securely.</p>
                </div>
                <div style={{ background: '#e2e8f0', color: '#475569', padding: '8px 16px', borderRadius: '30px', fontSize: '14px', fontWeight: '600' }}>
                    Total Logs: {bookings.length}
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <div style={cardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#3b82f6' }} />
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Pending Requests</span>
                    <h3 style={metricStyle}>{pendingCount}</h3>
                </div>
                <div style={cardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#10b981' }} />
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Approved</span>
                    <h3 style={metricStyle}>{approvedCount}</h3>
                </div>
                <div style={cardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#ef4444' }} />
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Rejected</span>
                    <h3 style={metricStyle}>{rejectedCount}</h3>
                </div>
            </div>
            
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resource</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Requester</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Schedule</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '20px 24px' }}><div className="skeleton" style={{ width: '40px', height: '16px' }}></div></td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div className="skeleton" style={{ width: '120px', height: '18px', marginBottom: '8px' }}></div>
                                            <div className="skeleton" style={{ width: '150px', height: '14px' }}></div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}><div className="skeleton" style={{ width: '160px', height: '16px' }}></div></td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div className="skeleton" style={{ width: '140px', height: '14px', marginBottom: '8px' }}></div>
                                            <div className="skeleton" style={{ width: '140px', height: '14px' }}></div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}><div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '12px' }}></div></td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: '6px' }}></div>
                                                <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: '6px' }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : bookings.map(b => (
                                <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s', ':hover': { backgroundColor: '#f8fafc' } }}>
                                    <td style={{ padding: '20px 24px', color: '#94a3b8', fontWeight: '500', fontSize: '14px' }}>#{b.id}</td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>{b.resource.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{b.purpose.substring(0, 30)}...</div>
                                    </td>
                                    <td style={{ padding: '20px 24px', color: '#334155', fontSize: '14px' }}>{b.user.email}</td>
                                    <td style={{ padding: '20px 24px', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                                        <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                                            <span style={{display:'inline-block', width:'8px', height:'8px', borderRadius:'50%', background:'#10b981'}}></span>
                                            {new Date(b.startTime).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                        <div style={{display:'flex', alignItems:'center', gap:'6px', marginTop:'4px'}}>
                                            <span style={{display:'inline-block', width:'8px', height:'8px', borderRadius:'50%', background:'#ef4444'}}></span>
                                            {new Date(b.endTime).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{
                                            fontWeight: '700', fontSize: '12px', padding: '6px 12px', borderRadius: '30px', letterSpacing: '0.5px',
                                            backgroundColor: b.status === 'APPROVED' ? '#dcfce7' : b.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                                            color: b.status === 'APPROVED' ? '#166534' : b.status === 'REJECTED' ? '#991b1b' : '#92400e',
                                            border: `1px solid ${b.status === 'APPROVED' ? '#bbf7d0' : b.status === 'REJECTED' ? '#fecaca' : '#fde68a'}`
                                        }}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        {b.status === 'PENDING' ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => updateStatus(b.id, 'APPROVED')} 
                                                    style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)', transition: 'transform 0.1s' }}
                                                    onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>
                                                    Approve
                                                </button>
                                                <button onClick={() => {
                                                    const reason = prompt('Provide rejection reason:');
                                                    if(reason) updateStatus(b.id, 'REJECTED', reason);
                                                }} 
                                                    style={{ background: 'white', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'background 0.2s' }}
                                                    onMouseOver={e => { e.target.style.background = '#fef2f2'; }} onMouseOut={e => { e.target.style.background = 'white'; }}>
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>Resolved</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && bookings.length === 0 && (
                    <div style={{textAlign: 'center', padding: '60px 20px', color: '#94a3b8'}}>
                        <div style={{fontSize: '48px', marginBottom: '15px'}}>📋</div>
                        <p style={{fontSize: '16px', fontWeight: '500'}}>No bookings found in the system yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBookings;
