import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import {
    Mail,
    ShieldCheck,
    ChevronRight,
    Building2,
    CalendarCheck,
    Wrench,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Clock,
    Activity,
    Target,
    Users,
    Heart
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const navigate = useNavigate();
    const [myTickets, setMyTickets] = useState([]);
    const [allTickets, setAllTickets] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [analytics, setAnalytics] = useState({ mttr: "0h", efficiency: "0%", activeIncidents: 0 });

    const fetchFavorites = async () => {
        if (!user) return;
        try {
            const res = await api.get(`/tickets/favorites?userId=${user.id}`);
            setFavoriteIds(res.data.map(t => t.id));
        } catch (err) {
            console.error('Failed to fetch favorites', err);
        }
    };

    const toggleFavorite = async (ticketId, e) => {
        if (e) e.stopPropagation();
        try {
            await api.post(`/tickets/${ticketId}/favorite?userId=${user.id}`);
            fetchFavorites();
            const isFav = !favoriteIds.includes(ticketId);
            showNotification(isFav ? 'Saved to favorites ❤️' : 'Removed from favorites', 'success');
        } catch (err) {
            showNotification('Failed to toggle favorite', 'error');
        }
    };

    useEffect(() => {
        if (user && user.role === 'ROLE_USER') {
            api.get(`/tickets/user/${user.id}`).then(res => setMyTickets(res.data)).catch(err => console.error(err));
        }
        if (user && (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_TECHNICIAN')) {
            api.get('/tickets/analytics').then(res => setAnalytics(res.data)).catch(err => console.error(err));
        }
        fetchFavorites();
    }, [user]);


    const cardStyle = {
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        padding: '40px',
        borderRadius: '32px',
        boxShadow: 'var(--shadow-premium)',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '40px'
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            {/* Hero Profile Card */}
            <div style={cardStyle}>
                <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '50%', height: '150%', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, transparent 100%)', transform: 'rotate(-45deg)', zIndex: 0 }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: '42px', color: 'var(--text-main)', margin: '0 0 10px 0', letterSpacing: '-2px', fontWeight: '800' }}>
                                Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name}</span>
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '18px', margin: '0 0 35px 0', fontWeight: '500' }}>
                                Oversee and interact with your campus services efficiently.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(96, 165, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                <Mail size={22} />
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px' }}>Verified Email</div>
                                <div style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '15px' }}>{user?.email}</div>
                            </div>
                        </div>

                        <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                <ShieldCheck size={22} />
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px' }}>Access Level</div>
                                <div style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {user?.role.replace('ROLE_', '')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Innovation: SLA Analytics for Staff */}
            {(user.role === 'ROLE_ADMIN' || user.role === 'ROLE_TECHNICIAN') && (
                <div style={{ marginBottom: '60px' }}>
                    <div className="page-header">
                        <h3 className="page-title">Operational Analytics</h3>
                        <p className="page-subtitle">Real-time Service Level Agreement (SLA) performance monitoring.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                        <div className="premium-card" style={{ padding: '30px', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>Avg Resolution (MTTR)</span>
                                <Clock size={20} color="#3b82f6" />
                            </div>
                            <div style={{ fontSize: '38px', fontWeight: '900', letterSpacing: '-1.5px', color: '#0f172a' }}>{analytics.mttr}</div>
                            <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>Historical ticket lifecycle average.</div>
                        </div>
                        <div className="premium-card" style={{ padding: '30px', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>Closing efficiency</span>
                                <Target size={20} color="#10b981" />
                            </div>
                            <div style={{ fontSize: '38px', fontWeight: '900', letterSpacing: '-1.5px', color: '#0f172a' }}>{analytics.efficiency}</div>
                            <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>Processed vs. Active Requests.</div>
                        </div>
                        <div className="premium-card" style={{ padding: '30px', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>Active Incidents</span>
                                <Activity size={20} color="#ef4444" />
                            </div>
                            <div style={{ fontSize: '38px', fontWeight: '900', letterSpacing: '-1.5px', color: '#0f172a' }}>{analytics.activeIncidents}</div>
                            <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>Live issues requiring triage.</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Quick Actions */}
            <div className="page-header" style={{ marginTop: '60px' }}>
                <h3 className="page-title">Campus Hub Navigation</h3>
                <p className="page-subtitle">Access your most frequent destination in one click.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                <div onClick={() => navigate('/catalogue')} className="premium-card" style={{ padding: '35px', cursor: 'pointer', position: 'relative' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(96, 165, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', color: 'var(--primary)' }}>
                        <Building2 size={30} />
                    </div>
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)', fontSize: '20px', fontWeight: '800' }}>Facilities Catalogue</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>Explore, filter, and book smart university assets such as labs and lecture halls.</p>
                    <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '13px', gap: '5px' }}>
                        Browse Assets <ChevronRight size={16} />
                    </div>
                </div>

                {user?.role === 'ROLE_USER' && (
                    <div onClick={() => navigate('/my-bookings')} className="premium-card" style={{ padding: '35px', cursor: 'pointer' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', color: '#a78bfa' }}>
                            <CalendarCheck size={30} />
                        </div>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)', fontSize: '20px', fontWeight: '800' }}>My Reservations</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>Track the status of your current and upcoming facility booking requests. (QR Enabled)</p>
                        <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', color: '#8B5CF6', fontWeight: 'bold', fontSize: '13px', gap: '5px' }}>
                            View Pass <ChevronRight size={16} />
                        </div>
                    </div>
                )}

                {user?.role === 'ROLE_ADMIN' && (
                    <div onClick={() => navigate('/admin/users')} className="premium-card" style={{ padding: '35px', cursor: 'pointer' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', color: '#2563EB' }}>
                            <Users size={30} />
                        </div>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)', fontSize: '20px', fontWeight: '800' }}>Role Management</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>Authorize staff members and assign Technician or Admin privileges.</p>
                        <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', color: '#2563EB', fontWeight: 'bold', fontSize: '13px', gap: '5px' }}>
                            User Directory <ChevronRight size={16} />
                        </div>
                    </div>
                )}

                {(user?.role === 'ROLE_TECHNICIAN' || user?.role === 'ROLE_ADMIN') && (
                    <div onClick={() => navigate('/technician/desk')} className="premium-card" style={{ padding: '35px', cursor: 'pointer' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', color: '#10b981' }}>
                            <Wrench size={30} />
                        </div>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)', fontSize: '20px', fontWeight: '800' }}>Service Desk</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>Manage incident tickets and resolve infrastructure issues on campus.</p>
                        <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', color: '#10b981', fontWeight: 'bold', fontSize: '13px', gap: '5px' }}>
                            Open Desk <ChevronRight size={16} />
                        </div>
                    </div>
                )}
            </div>
            
            {/* My Tickets Section */}
            {user?.role === 'ROLE_USER' && (
                <div style={{ marginTop: '80px' }}>
                    <div className="page-header">
                        <h3 className="page-title">Active Service Requests</h3>
                        <p className="page-subtitle">Real-time status of your reported maintenance tickets.</p>
                    </div>

                    {myTickets.length === 0 ? (
                        <div style={{ background: 'var(--surface)', padding: '60px 40px', borderRadius: '32px', border: '1px solid var(--border)', textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✨</div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '500' }}>You have no active maintenance requests at the moment.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                            {myTickets.map(t => (
                                <div key={t.id} className="premium-card" style={{ padding: '28px', cursor: 'pointer' }} onClick={() => navigate(`/ticket/${t.id}`)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <AlertCircle size={14} color="#60a5fa" />
                                            <strong style={{ color: 'var(--text-main)', fontSize: '16px', fontWeight: '700' }}>{t.category}</strong>
                                        </div>
                                        <span style={{
                                            fontSize: '10px', padding: '4px 12px', borderRadius: '20px',
                                            background: t.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.1)' : t.status === 'IN_PROGRESS' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: t.status === 'RESOLVED' ? '#10b981' : t.status === 'IN_PROGRESS' ? '#f59e0b' : '#ef4444',
                                            fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px',
                                            border: `1px solid ${t.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.2)' : t.status === 'IN_PROGRESS' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                        }}>
                                            {t.status === 'RESOLVED' && <CheckCircle2 size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                                            {t.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 25px 0', lineHeight: '1.6' }}>{t.description.substring(0, 80)}...</p>
                                    <button style={{ width: '100%', background: 'rgba(0,0,0,0.02)', color: 'var(--primary)', border: '1px solid var(--border)', padding: '12px', borderRadius: '14px', cursor: 'pointer', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                        Details & Timeline <ChevronRight size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
