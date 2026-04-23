import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import {
    Heart,
    ChevronRight,
    ArrowLeft,
    Ticket as TicketIcon
} from 'lucide-react';

const MyFavorites = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await api.get(`/tickets/favorites?userId=${user.id}`);
            setTickets(res.data);
        } catch (err) {
            console.error(err);
            showNotification('Failed to load favorite tickets', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [user]);

    const toggleFavorite = async (ticketId) => {
        try {
            await api.post(`/tickets/${ticketId}/favorite?userId=${user.id}`);
            // Remove from list since we are on the favorites page
            setTickets(tickets.filter(t => t.id !== ticketId));
            showNotification('Removed from favorites', 'success');
        } catch (err) {
            showNotification('Action failed', 'error');
        }
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="page-header" style={{ marginBottom: '40px' }}>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', padding: 0, fontWeight: '600' }}
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Heart size={32} fill="#ff4d6d" color="#ff4d6d" /> Favorite Tickets
                </h2>
                <p className="page-subtitle">Your personally bookmarked maintenance incidents for quick access.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="skeleton" style={{ width: '100%', height: '200px', borderRadius: '24px' }}></div>
                </div>
            ) : tickets.length === 0 ? (
                <div style={{ textAlign: 'center', background: 'var(--surface)', padding: '80px 40px', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255, 77, 109, 0.1)', color: '#ff4d6d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Heart size={40} />
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>No favorites yet</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '400px', margin: '0 auto' }}>
                        Tickets you heart will appear here for easy tracking and quick reference.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                    {tickets.map(t => (
                        <div 
                            key={t.id} 
                            style={{ 
                                background: 'var(--surface)', 
                                borderRadius: '24px', 
                                border: '1px solid var(--border)', 
                                padding: '25px',
                                boxShadow: 'var(--shadow-soft)',
                                position: 'relative',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/ticket/${t.id}`)}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>#{t.id.substring(0, 8)}</span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(t.id); }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '50%', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 77, 109, 0.1)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'none'}
                                    title="Remove from favorites"
                                >
                                    <Heart size={20} fill="#ff4d6d" color="#ff4d6d" style={{ transition: 'transform 0.2s' }} />
                                </button>
                            </div>

                            <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>{t.resource.name}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5', height: '42px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {t.description}
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                                <span style={{
                                    color: t.priority === 'HIGH' ? '#ef4444' : t.priority === 'MEDIUM' ? '#f59e0b' : '#60a5fa',
                                    fontWeight: '900', fontSize: '10px',
                                    background: t.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : t.priority === 'MEDIUM' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(96, 165, 250, 0.1)',
                                    padding: '4px 10px', borderRadius: '10px', textTransform: 'uppercase'
                                }}>
                                    {t.priority}
                                priority</span>
                                <span style={{
                                    fontWeight: '800', fontSize: '10px', padding: '4px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', textTransform: 'uppercase'
                                }}>
                                    {t.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--border)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900' }}>
                                        {t.technician ? t.technician.name.charAt(0) : '?'}
                                    </div>
                                    <span style={{ fontSize: '13px', fontWeight: '700' }}>{t.technician ? t.technician.name : 'Unassigned'}</span>
                                </div>
                                <ChevronRight size={16} color="var(--text-muted)" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyFavorites;
