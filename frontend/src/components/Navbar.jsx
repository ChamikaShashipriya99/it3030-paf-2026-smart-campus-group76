import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        const fetchNotifs = () => {
            api.get(`/notifications/user/${user.id}`).then(res => {
                const unread = res.data.filter(n => !n.read).length;
                setUnreadCount(unread);
            }).catch(() => {});
        };
        fetchNotifs();
        const intv = setInterval(fetchNotifs, 10000); // Poll every 10s
        return () => clearInterval(intv);
    }, [user, location.pathname]);

    // Do not show the navigation bar on public login pages
    if (!user || location.pathname === '/login' || location.pathname.startsWith('/oauth2')) {
        return null;
    }

    const navStyle = {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '12px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        position: 'sticky',
        top: '15px',
        margin: '0 20px 20px 20px',
        borderRadius: '20px',
        zIndex: 1000,
        maxWidth: 'calc(100% - 40px)'
    };

    const linkStyle = (path) => {
        const isActive = location.pathname === path;
        return {
            textDecoration: 'none',
            color: isActive ? '#3b82f6' : '#64748b',
            fontWeight: '600',
            marginRight: '25px',
            fontSize: '14px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 12px',
            borderRadius: '10px',
            background: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
            boxShadow: isActive ? '0 0 0 1px rgba(59, 130, 246, 0.1)' : 'none'
        };
    };

    return (
        <nav style={navStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                    onClick={() => navigate('/dashboard')}
                    style={{ margin: 0, marginRight: '30px', color: '#0f172a', cursor: 'pointer', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}
                >
                    <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                        <span style={{fontSize: '20px', color: 'white'}}>🏫</span>
                    </div>
                    SmartCampus
                </div>
                
                <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
                <Link to="/catalogue" style={linkStyle('/catalogue')}>Facilities & Assets</Link>
                
                {user.role === 'ROLE_ADMIN' && (
                    <Link to="/admin/bookings" style={linkStyle('/admin/bookings')}>Manage Bookings</Link>
                )}
                
                {(user.role === 'ROLE_TECHNICIAN' || user.role === 'ROLE_ADMIN') && (
                    <Link to="/technician/desk" style={linkStyle('/technician/desk')}>Service Desk</Link>
                )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/notifications" style={{...linkStyle('/notifications'), position: 'relative', fontSize: '18px', marginRight: '15px', padding: '10px'}}>
                    <span style={{filter: unreadCount > 0 ? 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.4))' : 'none'}}>🔔</span>
                    {unreadCount > 0 && (
                        <span style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: 'white', fontSize: '9px', fontWeight: '900', padding: '1px 5px', borderRadius: '10px', boxShadow: '0 0 0 3px white' }}>
                            {unreadCount}
                        </span>
                    )}
                </Link>

                <div style={{ marginRight: '20px', height: '32px', width: '1px', background: '#e2e8f0', marginLeft: '5px' }} />

                <div style={{ marginRight: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#0f172a', fontWeight: '700', fontSize: '13px' }}>{user.name}</div>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {user.role.replace('ROLE_', '')}
                        </div>
                    </div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#3b82f6', border: '1px solid #e2e8f0' }}>
                        {user.name.charAt(0)}
                    </div>
                </div>
                
                <button 
                    onClick={logout}
                    style={{
                        padding: '10px 18px', backgroundColor: '#ffffff', color: '#ef4444', 
                        border: '1px solid #fee2e2', borderRadius: '12px', cursor: 'pointer',
                        fontWeight: '700', fontSize: '13px', transition: 'all 0.2s',
                        boxShadow: '0 2px 5px rgba(239, 68, 68, 0.05)'
                    }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#fef2f2'; e.target.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.transform = 'translateY(0)'; }}
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
