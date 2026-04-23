import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import {
    Activity,
    CheckCircle2,
    Clock,
    AlertCircle,
    UserPlus,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    Wrench
} from 'lucide-react';

const TechnicianDashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [tickets, setTickets] = useState([]);
    const [technicianList, setTechnicianList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = () => {
        setLoading(true);
        // If Admin, see all tickets. If Tech, see only assigned.
        const endpoint = user.role === 'ROLE_ADMIN' ? '/tickets' : `/tickets/technician/${user.id}`;
        api.get(endpoint).then(res => {
            setTickets(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    const fetchTechnicians = () => {
        if (user.role === 'ROLE_ADMIN') {
            api.get('/users/technicians')
                .then(res => {
                    console.log('Technicians loaded:', res.data);
                    setTechnicianList(res.data);
                })
                .catch(err => {
                    console.error('Failed to load technicians:', err);
                    showNotification('Error loading technician list', 'error');
                });
        }
    };

    useEffect(() => {
        fetchTickets();
        fetchTechnicians();
    }, []);

    const handleAssign = async (ticketId, techId) => {
        if (!techId) return;
        try {
            await api.put(`/tickets/${ticketId}/assign/${techId}`);
            fetchTickets();
            showNotification('Technician assigned successfully', 'success');
        } catch (err) {
            showNotification('Assignment Failed', 'error');
        }
    };

    const handleDelete = async (ticketId) => {
        if (window.confirm("Delete this ticket permanently?")) {
            try {
                await api.delete(`/tickets/${ticketId}`);
                setTickets(tickets.filter(t => t.id !== ticketId));
                showNotification('Ticket deleted', 'success');
            } catch (err) {
                showNotification('Failed to delete ticket', 'error');
            }
        }
    };

    const startTicket = async (ticketId) => {
        try {
            await api.put(`/tickets/${ticketId}/status`, { status: 'IN_PROGRESS' });
            fetchTickets();
            showNotification('Ticket started successfully.', 'success');
        } catch (err) { showNotification('Failed to start ticket', 'error'); }
    };

    const resolveTicket = async (ticketId) => {
        const notes = prompt("Enter resolution notes (e.g., Fixed projector bulb):");
        if (notes) {
            try {
                await api.put(`/tickets/${ticketId}/status`, { status: 'RESOLVED', resolutionNotes: notes });
                fetchTickets();
                showNotification('Ticket completed and resolved!', 'success');
            } catch (err) { showNotification('Completion Update Failed', 'error'); }
        }
    };

    const openCount = tickets.filter(t => t.status === 'OPEN').length;
    const progressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;

    const statsCardStyle = {
        flex: 1, minWidth: '240px', background: 'var(--surface)', padding: '30px', borderRadius: '24px',
        boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden'
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 className="page-title">Service Desk</h2>
                    <p className="page-subtitle">Personal workbench for assigned maintenance incidents.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px 20px', borderRadius: '14px', fontSize: '13px', fontWeight: '800', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={16} /> My Workload
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', marginBottom: '50px' }}>
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#ef4444' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Assigned</span>
                        <AlertCircle size={20} color="#ef4444" />
                    </div>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', margin: '15px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{openCount}</h3>
                </div>
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f59e0b' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Work</span>
                        <Clock size={20} color="#f59e0b" />
                    </div>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', margin: '15px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{progressCount}</h3>
                </div>
                <div style={statsCardStyle}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#10b981' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Completed</span>
                        <CheckCircle2 size={20} color="#10b981" />
                    </div>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', margin: '15px 0 0 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>{resolvedCount}</h3>
                </div>
            </div>

            <div style={{ background: 'var(--surface)', borderRadius: '24px', boxShadow: 'var(--shadow-soft)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Search incidents..." className="premium-input" style={{ padding: '8px 12px 8px 36px', fontSize: '14px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Filter size={14} /> Filter Queue
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Ref ID</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Incident Objective</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Priority</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>State</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Assignee</th>
                                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Control</th>
                                {user.role === 'ROLE_ADMIN' && (
                                    <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Delete</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '60px', height: '16px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '200px', height: '18px', marginBottom: '8px' }}></div><div className="skeleton" style={{ width: '140px', height: '12px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '70px', height: '20px', borderRadius: '10px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '90px', height: '24px', borderRadius: '12px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '100px', height: '16px' }}></div></td>
                                        <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '10px' }}></div></td>
                                        {user.role === 'ROLE_ADMIN' && <td style={{ padding: '25px 24px' }}><div className="skeleton" style={{ width: '40px', height: '36px', borderRadius: '10px' }}></div></td>}
                                    </tr>
                                ))
                            ) : tickets.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '25px 24px', color: 'var(--text-muted)', fontWeight: '800', fontSize: '13px' }}>#{t.id.substring(0, 8)}</td>
                                    <td style={{ padding: '25px 24px' }}>
                                        <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '15px' }}>{t.resource.name}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px', opacity: 0.8 }}>{t.category} — {t.description.substring(0, 40)}...</div>
                                    </td>
                                    <td style={{ padding: '25px 24px' }}>
                                        <span style={{
                                            color: t.priority === 'HIGH' ? '#ef4444' : t.priority === 'MEDIUM' ? '#f59e0b' : '#60a5fa',
                                            fontWeight: '900', fontSize: '10px',
                                            background: t.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : t.priority === 'MEDIUM' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(96, 165, 250, 0.1)',
                                            padding: '4px 10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)',
                                            textTransform: 'uppercase'
                                        }}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td style={{ padding: '25px 24px' }}>
                                        <span style={{
                                            fontWeight: '800', fontSize: '11px', padding: '6px 14px', borderRadius: '30px', letterSpacing: '0.5px',
                                            backgroundColor: t.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.1)' : t.status === 'OPEN' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: t.status === 'RESOLVED' ? '#10b981' : t.status === 'OPEN' ? '#ef4444' : '#f59e0b',
                                            border: `1px solid ${t.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.2)' : t.status === 'OPEN' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                                            textTransform: 'uppercase'
                                        }}>
                                            {t.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '25px 24px', color: 'var(--text-main)', fontSize: '14px', fontWeight: '600' }}>
                                        {t.technician ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--border)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900' }}>{t.technician.name.charAt(0)}</div>
                                                {t.technician.name}
                                            </div>
                                        ) : user.role === 'ROLE_ADMIN' ? (
                                            <select 
                                                className="premium-input"
                                                style={{ padding: '4px 8px', fontSize: '12px', width: '160px' }}
                                                onChange={(e) => handleAssign(t.id, e.target.value)}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Assign Technician</option>
                                                {technicianList.map(tech => (
                                                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', opacity: 0.5 }}>Unassigned</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '25px 24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                            <button onClick={() => navigate(`/ticket/${t.id}`)} style={{ background: 'var(--border)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.target.style.background = 'var(--border)'}>
                                                History <ChevronRight size={14} />
                                            </button>

                                            {t.status === 'OPEN' && user.role === 'ROLE_TECHNICIAN' && (
                                                <button onClick={() => startTicket(t.id)} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Clock size={14} /> Start
                                                </button>
                                            )}

                                            {t.status === 'IN_PROGRESS' && user.role === 'ROLE_TECHNICIAN' && (
                                                <button onClick={() => resolveTicket(t.id)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <CheckCircle2 size={14} /> Complete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    {user.role === 'ROLE_ADMIN' && (
                                        <td style={{ padding: '25px 24px' }}>
                                            <button 
                                                onClick={() => handleDelete(t.id)} 
                                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                                    <path d="M10 11v6M14 11v6"/>
                                                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                                                </svg>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && tickets.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto' }}>
                            <Wrench size={40} />
                        </div>
                        <h4 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 10px 0' }}>Queue Clear</h4>
                        <p style={{ fontSize: '15px', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>No active maintenance incidents reported. Everything is running smoothly on campus.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicianDashboard;
