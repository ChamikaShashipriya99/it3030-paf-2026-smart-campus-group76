import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [myTickets, setMyTickets] = useState([]);

    useEffect(() => {
        if (user && user.role === 'ROLE_USER') {
            api.get(`/tickets/user/${user.id}`).then(res => setMyTickets(res.data)).catch(err => console.error(err));
        }
    }, [user]);

    return (
        <div style={{ minHeight: 'calc(100vh - 70px)', padding: '60px 20px', fontFamily: '"Inter", -apple-system, sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                
                {/* Hero Profile Card */}
                <div style={{
                    background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
                    padding: '40px', borderRadius: '32px', boxShadow: 'var(--shadow-premium)',
                    border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{position: 'absolute', top: '-50%', left: '-20%', width: '50%', height: '150%', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)', transform: 'rotate(-45deg)', zIndex: 0}} />
                    
                    <div style={{position: 'relative', zIndex: 1}}>
                        <h1 style={{ fontSize: '36px', color: 'var(--text-main)', margin: '0 0 10px 0', letterSpacing: '-1px' }}>
                            Welcome back, <span style={{color: 'var(--primary)'}}>{user?.name}</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '18px', margin: '0 0 30px 0' }}>Here's what's happening with your campus operations today.</p>
                        
                        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 'bold'}}>@</div>
                                <div>
                                    <div style={{fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold'}}>Email</div>
                                    <div style={{color: '#1e293b', fontWeight: '500'}}>{user?.email}</div>
                                </div>
                            </div>
                            <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: 'bold'}}>#</div>
                                <div>
                                    <div style={{fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold'}}>Security Role</div>
                                    <div style={{color: '#1e293b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px'}}>
                                        {user?.role.replace('ROLE_', '')}
                                        {user?.role === 'ROLE_ADMIN' && <span style={{fontSize: '12px'}}>🛡️</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Navigation Quick Actions */}
                <h3 style={{ marginTop: '50px', color: 'var(--text-main)', fontSize: '20px' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    <div onClick={() => navigate('/catalogue')} className="premium-card" style={{ padding: '30px', cursor: 'pointer', textAlign: 'center' }}>
                        <div style={{fontSize: '32px', marginBottom: '15px'}}>🏢</div>
                        <h4 style={{margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: '18px'}}>Facilities Catalogue</h4>
                        <p style={{margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Browse and book university assets.</p>
                    </div>

                    {user?.role === 'ROLE_ADMIN' && (
                        <div onClick={() => navigate('/admin/bookings')} className="premium-card" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '30px', cursor: 'pointer', color: 'white' }}>
                            <div style={{fontSize: '32px', marginBottom: '15px'}}>📅</div>
                            <h4 style={{margin: '0 0 8px 0', color: 'white', fontSize: '18px'}}>Manage Bookings</h4>
                            <p style={{margin: 0, fontSize: '13px', color: '#bfdbfe'}}>Review pending requests globally.</p>
                        </div>
                    )}

                    {(user?.role === 'ROLE_TECHNICIAN' || user?.role === 'ROLE_ADMIN') && (
                        <div onClick={() => navigate('/technician/desk')} className="premium-card" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: '30px', cursor: 'pointer', color: 'white' }}>
                            <div style={{fontSize: '32px', marginBottom: '15px'}}>🛠️</div>
                            <h4 style={{margin: '0 0 8px 0', color: 'white', fontSize: '18px'}}>Service Desk</h4>
                            <p style={{margin: 0, fontSize: '13px', color: '#ddd6fe'}}>Resolve maintenance tickets.</p>
                        </div>
                    )}
                </div>

                {user?.role === 'ROLE_USER' && (
                    <div style={{ marginTop: '50px' }}>
                        <h3 style={{ color: '#334155', fontSize: '20px', marginBottom: '20px' }}>My Active Incidents</h3>
                        {myTickets.length === 0 ? (
                            <div style={{ background: 'var(--glass-bg)', padding: '40px', borderRadius: '24px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                                <p style={{color: 'var(--text-muted)', margin: 0}}>You have a clean slate! No issues reported.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {myTickets.map(t => (
                                    <div key={t.id} className="premium-card" style={{ padding: '24px' }}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                                            <strong style={{color: 'var(--text-main)', fontSize: '16px'}}>{t.category}</strong>
                                            <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: t.status === 'RESOLVED' ? '#dcfce7' : '#fee2e2', color: t.status === 'RESOLVED' ? '#16a34a' : '#ef4444', fontWeight: 'bold', textTransform: 'uppercase' }}>{t.status}</span>
                                        </div>
                                        <p style={{fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.5'}}>{t.description.substring(0, 60)}...</p>
                                        <button onClick={() => navigate(`/ticket/${t.id}`)} style={{ width: '100%', background: '#f8fafc', color: 'var(--primary)', border: '1px solid var(--border)', padding: '10px 15px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background = '#f1f5f9'} onMouseOut={e => e.target.style.background = '#f8fafc'}>
                                            Track Progress &rarr;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
