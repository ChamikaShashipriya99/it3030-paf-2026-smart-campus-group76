import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

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
