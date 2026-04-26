import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import {
    Inbox,
    Bell,
    CheckCircle,
    AlertTriangle,
    Info,
    Clock,
    Check,
    Settings
} from 'lucide-react';

const Notifications = () => {
    const { user, refreshUser } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    const [prefs, setPrefs] = useState({
        notificationsEnabled: true,
        successEnabled: true,
        warningEnabled: true,
        infoEnabled: true
    });

    const fetchNotifs = () => {
        if (!user) return;
        api.get(`/notifications/user/${user.id}`).then(res => setNotifications(res.data)).catch(console.error);
    };

    useEffect(() => { 
        fetchNotifs(); 
        if (user) {
            setPrefs({
                notificationsEnabled: user.notificationsEnabled ?? true,
                successEnabled: user.successEnabled ?? true,
                warningEnabled: user.warningEnabled ?? true,
                infoEnabled: user.infoEnabled ?? true
            });
        }
    }, [user]);

    const savePrefs = async (newPrefs) => {
        try {
            await api.put(`/users/${user.id}/preferences`, newPrefs);
            refreshUser();
        } catch (err) {
            console.error("Failed to save preferences", err);
        }
    };

    const togglePref = (key) => {
        const updated = { ...prefs, [key]: !prefs[key] };
        setPrefs(updated);
        savePrefs(updated);
    };

    const markRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifs();
        } catch (e) { }
    };

    const markAllRead = async () => {
        if (!user || notifications.filter(n => !n.read && !n.isRead).length === 0) return;
        
        // Optimistic UI Update
        const updatedNotifs = notifications.map(n => ({ ...n, read: true, isRead: true }));
        setNotifications(updatedNotifs);

        try {
            await api.put(`/notifications/user/${user.id}/read-all`);
            fetchNotifs();
        } catch (e) {
            fetchNotifs(); // Rollback/Refetch on error
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle size={18} color="#10b981" />;
            case 'WARNING': return <AlertTriangle size={18} color="#f59e0b" />;
            default: return <Info size={18} color="#3b82f6" />;
        }
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 className="page-title">Personal Inbox</h2>
                    <p className="page-subtitle">Historical alerts and service-level notifications processed for you.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '12px 24px', borderRadius: '16px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Inbox size={18} /> {notifications.filter(n => !n.read && !n.isRead).length} Unread
                    </div>
                    {notifications.filter(n => !n.read && !n.isRead).length > 0 && (
                        <button 
                            onClick={markAllRead}
                            style={{ 
                                background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '12px 24px', borderRadius: '16px', cursor: 'pointer', fontSize: '13px', fontWeight: '900', transition: 'all 0.2s' 
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseOut={e => e.currentTarget.style.background = 'var(--surface)'}
                        >
                            Mark All as Read
                        </button>
                    )}
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        style={{ 
                            background: showSettings ? 'var(--primary)' : 'var(--surface)', 
                            color: showSettings ? 'white' : 'var(--text-main)', 
                            border: '1px solid var(--border)', 
                            padding: '12px', 
                            borderRadius: '16px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Innovation: Preference Settings Panel */}
            {showSettings && (
                <div className="premium-card" style={{ 
                    marginBottom: '40px', 
                    padding: '30px', 
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    animation: 'slideDown 0.3s ease-out'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Notification Preferences</h4>
                            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Customize which categories of alerts you wish to receive.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: prefs.notificationsEnabled ? 'var(--primary)' : 'var(--text-muted)' }}>
                                {prefs.notificationsEnabled ? 'SYSTEM ALERTS ACTIVE' : 'SYSTEM ALERTS MUTED'}
                            </span>
                            <div 
                                onClick={() => togglePref('notificationsEnabled')}
                                style={{ width: '40px', height: '22px', background: prefs.notificationsEnabled ? 'var(--primary)' : '#475569', borderRadius: '11px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
                            >
                                <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: prefs.notificationsEnabled ? '21px' : '3px', transition: 'all 0.3s' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', opacity: prefs.notificationsEnabled ? 1 : 0.5, pointerEvents: prefs.notificationsEnabled ? 'all' : 'none' }}>
                        {[
                            { key: 'infoEnabled', label: 'Info Alerts', icon: <Info size={16} color="#3b82f6" />, bg: 'rgba(59,130,246,0.1)' },
                            { key: 'successEnabled', label: 'Success Alerts', icon: <CheckCircle size={16} color="#10b981" />, bg: 'rgba(16,185,129,0.1)' },
                            { key: 'warningEnabled', label: 'Warning Alerts', icon: <AlertTriangle size={16} color="#f59e0b" />, bg: 'rgba(245,158,11,0.1)' }
                        ].map(item => (
                            <div key={item.key} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {item.icon}
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: '700' }}>{item.label}</span>
                                </div>
                                <div 
                                    onClick={() => togglePref(item.key)}
                                    style={{ width: '34px', height: '18px', background: prefs[item.key] ? 'var(--primary)' : '#475569', borderRadius: '9px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
                                >
                                    <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: prefs[item.key] ? '19px' : '3px', transition: 'all 0.3s' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                {notifications.length === 0 ? (
                    <div className="premium-card" style={{ textAlign: 'center', padding: '120px 40px', background: 'var(--surface)' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px auto' }}>
                            <Bell size={40} opacity={0.2} />
                        </div>
                        <h4 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 10px 0' }}>All Caught Up</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '500', maxWidth: '300px', margin: '0 auto' }}>New alerts regarding your bookings and tickets will appear here.</p>
                    </div>
                ) : notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(n => (
                    <div key={n.id} className="premium-card" style={{
                        padding: '28px 32px',
                        background: (n.read || n.isRead) ? 'rgba(255,255,255,0.01)' : 'var(--surface)',
                        borderLeft: `6px solid ${n.type === 'SUCCESS' ? '#10b981' : n.type === 'WARNING' ? '#f59e0b' : '#3b82f6'}`,
                        transition: 'all 0.2s',
                        opacity: (n.read || n.isRead) ? 0.6 : 1,
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '12px',
                                    background: n.type === 'SUCCESS' ? 'rgba(16,185,129,0.1)' : n.type === 'WARNING' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {getIcon(n.type)}
                                </div>
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    color: n.type === 'SUCCESS' ? '#10b981' : n.type === 'WARNING' ? '#f59e0b' : '#3b82f6'
                                }}>
                                    {n.type} Alert
                                </div>
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={12} />
                                {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} — {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        <p style={{ margin: '0 0 25px 0', fontSize: '16px', color: 'var(--text-main)', lineHeight: '1.6', fontWeight: (n.read || n.isRead) ? '500' : '700' }}>
                            {n.message}
                        </p>
                        {(!n.read && !n.isRead) && (
                            <button
                                onClick={() => markRead(n.id)}
                                style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: '800',
                                    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                                onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                            >
                                <Check size={16} /> Mark as Processed
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
