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
        background: '#ffffff',
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    };

    const linkStyle = (path) => ({
        textDecoration: 'none',
        color: location.pathname === path ? '#1da1f2' : '#666',
        fontWeight: location.pathname === path ? '600' : '500',
        marginRight: '25px',
        fontSize: '15px',
        transition: 'color 0.2s',
        display: 'inline-flex',
        alignItems: 'center'
    });

    return (
        <nav style={navStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                    onClick={() => navigate('/dashboard')}
                    style={{ margin: 0, marginRight: '40px', color: '#2c3e50', cursor: 'pointer', fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <span style={{fontSize: '24px'}}>🏫</span> Smart Campus
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
                <Link to="/notifications" style={{...linkStyle('/notifications'), position: 'relative', fontSize: '20px', marginRight: '30px'}}>
                    🔔
                    {unreadCount > 0 && (
                        <span style={{ position: 'absolute', top: '-6px', right: '-12px', background: '#e74c3c', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px' }}>
                            {unreadCount}
                        </span>
                    )}
                </Link>

                <div style={{ marginRight: '20px', fontSize: '14px', color: '#7f8c8d' }}>
                    Welcome, <strong style={{color: '#2c3e50'}}>{user.name}</strong> 
                    <span style={{marginLeft: '6px', background: '#ecf0f1', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#7f8c8d'}}>
                        {user.role.replace('ROLE_', '')}
                    </span>
                </div>
                <button 
                    onClick={logout}
                    style={{
                        padding: '8px 20px', backgroundColor: '#e74c3c', color: '#fff', 
                        border: 'none', borderRadius: '4px', cursor: 'pointer',
                        fontWeight: 'bold', fontSize: '13px', transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#c0392b'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = '#e74c3c'; }}
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
