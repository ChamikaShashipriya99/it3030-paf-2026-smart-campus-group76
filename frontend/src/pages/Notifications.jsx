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
    Check
} from 'lucide-react';

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifs = () => {
        if (!user) return;
        api.get(`/notifications/user/${user.id}`).then(res => setNotifications(res.data)).catch(console.error);
    };

    useEffect(() => { fetchNotifs(); }, [user]);

    const markRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifs();
        } catch (e) { }
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
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '12px 24px', borderRadius: '16px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Inbox size={18} /> {notifications.filter(n => !n.read).length} Unread
                </div>
            </div>

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
                        background: n.read ? 'rgba(255,255,255,0.01)' : 'var(--surface)',
                        borderLeft: `6px solid ${n.type === 'SUCCESS' ? '#10b981' : n.type === 'WARNING' ? '#f59e0b' : '#3b82f6'}`,
                        transition: 'all 0.2s',
                        opacity: n.read ? 0.6 : 1,
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
                        <p style={{ margin: '0 0 25px 0', fontSize: '16px', color: 'var(--text-main)', lineHeight: '1.6', fontWeight: n.read ? '500' : '700' }}>
                            {n.message}
                        </p>
                        {!n.read && (
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
