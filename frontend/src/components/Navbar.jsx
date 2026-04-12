import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    Settings,
    Bell,
    LogOut,
    UserCircle,
    Building2
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);
    const prevCountRef = useRef(0);

    const playPing = () => {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.volume = 0.5;
            audio.play();
        } catch (e) { console.error("Sound failed", e); }
    };

    useEffect(() => {
        if (!user) return;
        const fetchNotifs = () => {
            api.get(`/notifications/user/${user.id}`).then(res => {
                const unread = res.data.filter(n => !n.read).length;
                if (unread > prevCountRef.current && (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_TECHNICIAN')) {
                    playPing();
                }
                setUnreadCount(unread);
                prevCountRef.current = unread;
            }).catch(() => { });
        };
        fetchNotifs();
        const intv = setInterval(fetchNotifs, 10000);
        return () => clearInterval(intv);
    }, [user, location.pathname]);

    if (!user || location.pathname === '/' || location.pathname === '/login' || location.pathname.startsWith('/oauth2')) {
        return null;
    }

    const navStyle = {
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(20px)',
    };

    const linkStyle = (path) => {
        const isActive = location.pathname === path;
        return {
            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
            textDecoration: 'none',
            marginRight: '20px',
            fontSize: '14px',
            fontWeight: isActive ? '700' : '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            padding: '10px 16px',
            borderRadius: '12px',
            background: isActive ? 'rgba(96, 165, 250, 0.1)' : 'transparent'
        };
    };

    return (
        <nav style={navStyle}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        onClick={() => navigate('/dashboard')}
                        style={{
                            marginRight: '40px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <img src="/SmartCampus.png" alt="SmartCampus Logo" style={{ height: '40px', width: 'auto' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/dashboard" style={linkStyle('/dashboard')}>
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                        <Link to="/catalogue" style={linkStyle('/catalogue')}>
                            <BookOpen size={18} />
                            Assets
                        </Link>
                        {user.role === 'ROLE_USER' && (
                            <Link to="/my-bookings" style={linkStyle('/my-bookings')}>
                                <ClipboardList size={18} />
                                My Bookings
                            </Link>
                        )}
                        {user.role === 'ROLE_ADMIN' && (
                            <Link to="/admin/bookings" style={linkStyle('/admin/bookings')}>
                                <Settings size={18} />
                                Manage
                            </Link>
                        )}
                        {(user.role === 'ROLE_TECHNICIAN' || user.role === 'ROLE_ADMIN') && (
                            <Link to="/technician/desk" style={linkStyle('/technician/desk')}>
                                <ClipboardList size={18} />
                                Service Desk
                            </Link>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <Link to="/notifications" style={{
                        ...linkStyle('/notifications'),
                        position: 'relative',
                        marginRight: 0,
                        padding: '10px',
                        background: 'transparent'
                    }}>
                        <Bell size={22} style={{ color: unreadCount > 0 ? 'var(--primary)' : 'var(--text-muted)' }} />
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '4px', right: '4px',
                                background: '#ef4444', color: 'white', fontSize: '10px',
                                padding: '2px 6px', borderRadius: '10px', fontWeight: '900',
                                border: '2px solid var(--surface)'
                            }}>
                                {unreadCount}
                            </span>
                        )}
                    </Link>

                    <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>{user.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {user.role.replace('ROLE_', '')}
                            </div>
                        </div>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '14px', background: 'var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                            border: '1px solid var(--glass-border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <UserCircle size={28} />
                        </div>
                        <button
                            onClick={logout}
                            style={{
                                background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.15)',
                                padding: '12px 20px', borderRadius: '14px', cursor: 'pointer',
                                fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={e => { e.target.style.background = 'rgba(239, 68, 68, 0.15)'; e.target.style.transform = 'translateY(-1px)'; }}
                            onMouseOut={e => { e.target.style.background = 'rgba(239, 68, 68, 0.08)'; e.target.style.transform = 'translateY(0)'; }}
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
