import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const TechnicianDashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = () => {
        setLoading(true);
        api.get('/tickets').then(res => {
            // Artificial delay to show premium skeleton loaders for 3 seconds
            setTimeout(() => {
                setTickets(res.data);
                setLoading(false);
            }, 3000);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const assignToMe = async (ticketId) => {
        try {
            await api.put(`/tickets/${ticketId}/assign/${user.id}`);
            fetchTickets();
            showNotification('Ticket successfully claimed for review.', 'success');
        } catch (err) { showNotification('Assignment Failed', 'error'); }
    };

    const resolveTicket = async (ticketId) => {
        const notes = prompt("Enter resolution notes (e.g., Fixed projector bulb):");
        if (notes) {
            try {
                await api.put(`/tickets/${ticketId}/status`, { status: 'RESOLVED', resolutionNotes: notes });
                fetchTickets();
                showNotification('Ticket marked as resolved!', 'success');
            } catch (err) { showNotification('Resolution Update Failed', 'error'); }
        }
    };

    const openCount = tickets.filter(t => t.status === 'OPEN').length;
    const progressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;

    const cardStyle = {
        flex: 1, minWidth: '200px', background: 'white', padding: '25px', borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden'
    };
    
    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Inter", -apple-system, sans-serif', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 70px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>IT & Maintenance Desk</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Triage, assign, and resolve campus service incidents.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <div style={cardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#ef4444' }} />
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Open Incidents</span>
                    <h3 style={{ fontSize: '36px', fontWeight: '800', margin: '10px 0 0 0', color: '#1a202c' }}>{openCount}</h3>
                </div>
                <div style={cardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f59e0b' }} />
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>In Progress</span>
                    <h3 style={{ fontSize: '36px', fontWeight: '800', margin: '10px 0 0 0', color: '#1a202c' }}>{progressCount}</h3>
                </div>
                <div style={cardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#10b981' }} />
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Resolved</span>
                    <h3 style={{ fontSize: '36px', fontWeight: '800', margin: '10px 0 0 0', color: '#1a202c' }}>{resolvedCount}</h3>
                </div>
            </div>
            
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Incident Details</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>State</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Technician</th>
                                <th style={{ padding: '18px 24px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '20px 24px' }}><div className="skeleton" style={{ width: '40px', height: '16px' }}></div></td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div className="skeleton" style={{ width: '180px', height: '18px', marginBottom: '8px' }}></div>
                                            <div className="skeleton" style={{ width: '120px', height: '14px' }}></div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}><div className="skeleton" style={{ width: '80px', height: '16px', borderRadius: '12px' }}></div></td>
                                        <td style={{ padding: '20px 24px' }}><div className="skeleton" style={{ width: '90px', height: '26px', borderRadius: '12px' }}></div></td>
                                        <td style={{ padding: '20px 24px' }}><div className="skeleton" style={{ width: '130px', height: '16px' }}></div></td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <div className="skeleton" style={{ width: '70px', height: '32px', borderRadius: '6px' }}></div>
                                                <div className="skeleton" style={{ width: '70px', height: '32px', borderRadius: '6px' }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : tickets.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s', ':hover': { backgroundColor: '#f8fafc' } }}>
                                    <td style={{ padding: '20px 24px', color: '#94a3b8', fontWeight: '500', fontSize: '14px' }}>#{t.id}</td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>{t.resource.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{t.category} — {t.description.substring(0, 30)}...</div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{ color: t.priority === 'HIGH' ? '#dc2626' : t.priority === 'MEDIUM' ? '#d97706' : '#2563eb', fontWeight: '700', fontSize: '12px', background: t.priority === 'HIGH' ? '#fee2e2' : t.priority === 'MEDIUM' ? '#fef3c7' : '#dbeafe', padding: '4px 10px', borderRadius: '20px' }}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{ fontWeight: '700', fontSize: '12px', padding: '6px 12px', borderRadius: '30px', letterSpacing: '0.5px',
                                            backgroundColor: t.status === 'RESOLVED' ? '#dcfce7' : t.status === 'OPEN' ? '#fee2e2' : '#fef3c7',
                                            color: t.status === 'RESOLVED' ? '#166534' : t.status === 'OPEN' ? '#991b1b' : '#92400e',
                                            border: `1px solid ${t.status === 'RESOLVED' ? '#bbf7d0' : t.status === 'OPEN' ? '#fecaca' : '#fde68a'}`
                                        }}>
                                            {t.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px', color: '#334155', fontSize: '14px' }}>
                                        {t.technician ? t.technician.email.split('@')[0] : <span style={{color: '#94a3b8', fontStyle: 'italic'}}>Unassigned</span>}
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => navigate(`/ticket/${t.id}`)} style={{ background: 'white', color: '#3b82f6', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'background 0.2s' }} onMouseOver={e=>e.target.style.background='#f1f5f9'} onMouseOut={e=>e.target.style.background='white'}>Details</button>
                                            
                                            {t.status === 'OPEN' && (
                                                <button onClick={() => assignToMe(t.id)} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' }}>Claim</button>
                                            )}
                                            {t.status === 'IN_PROGRESS' && t.technician?.id === user.id && (
                                                <button onClick={() => resolveTicket(t.id)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)' }}>Resolve</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && tickets.length === 0 && (
                    <div style={{textAlign: 'center', padding: '60px 20px', color: '#94a3b8'}}>
                        <div style={{fontSize: '48px', marginBottom: '15px'}}>✨</div>
                        <p style={{fontSize: '16px', fontWeight: '500'}}>No incidents reported. All good!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicianDashboard;
