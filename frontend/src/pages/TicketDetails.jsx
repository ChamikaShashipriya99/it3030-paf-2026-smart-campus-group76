import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import {
    ArrowLeft,
    MessageSquare,
    Paperclip,
    Clock,
    ShieldCheck,
    MapPin,
    User,
    Send,
    Trash2,
    CheckCircle2,
    Wrench,
    AlertCircle
} from 'lucide-react';

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);

    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const tRes = await api.get(`/tickets/${id}`);
            setTicket(tRes.data);
            const cRes = await api.get(`/tickets/${id}/comments`);
            setComments(cRes.data);
            const aRes = await api.get(`/tickets/${id}/attachments`);
            setAttachments(aRes.data);
        } catch (err) {
            showNotification('Error loading ticket details', 'error');
        }
    }, [id, showNotification]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await api.post(`/tickets/${id}/comments`, { userId: user.id, content: newComment });
            setNewComment('');
            fetchData();
            showNotification('Comment posted', 'success');
        } catch (e) { showNotification('Failed to post comment', 'error'); }
    };

    const handleDeleteComment = async (cid) => {
        if (!window.confirm("Delete this comment permanently?")) return;
        try {
            await api.delete(`/tickets/comments/${cid}/user/${user.id}`);
            fetchData();
            showNotification('Comment deleted', 'success');
        } catch (e) { showNotification('Failed to delete comment', 'error'); }
    };

    if (!ticket) return (
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <div className="skeleton" style={{ width: '100%', maxWidth: '900px', height: '500px', borderRadius: '32px', margin: '0 auto' }} />
        </div>
    );

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    background: 'transparent', border: 'none', color: 'var(--text-muted)',
                    cursor: 'pointer', fontWeight: '800', marginBottom: '30px',
                    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px'
                }}
            >
                <ArrowLeft size={16} /> Return to Queue
            </button>

            <div className="premium-card" style={{ padding: '0', overflow: 'hidden', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e4ed8 100%)', padding: '60px', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: '15px', opacity: 0.8 }}>Incident Registry &bull; Core Diagnostics</div>
                            <h2 style={{ margin: 0, fontSize: '42px', letterSpacing: '-1.5px', fontWeight: '900' }}>#{ticket.id.substring(0, 8)}: {ticket.category.replace('_', ' ')}</h2>
                            <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
                                <span style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', backdropFilter: 'blur(10px)', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                                <span style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', backdropFilter: 'blur(10px)', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {ticket.priority} Priority
                                </span>
                            </div>
                        </div>
                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wrench size={30} />
                        </div>
                    </div>
                </div>

                <div style={{ padding: '60px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border)', marginBottom: '50px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <AlertCircle size={18} color="var(--primary)" />
                            <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '14px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1px' }}>Issue Description</h4>
                        </div>
                        <p style={{ margin: '0 0 30px 0', lineHeight: 1.8, color: 'var(--text-main)', fontSize: '16px' }}>{ticket.description}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px', paddingTop: '30px', borderTop: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--border)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={16} /></div>
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Asset Location</div>
                                    <div style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: '700' }}>{ticket.resource?.name}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--border)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} /></div>
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Contact Reference</div>
                                    <div style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: '700' }}>{ticket.contactDetails}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {ticket.resolutionNotes && (
                        <div style={{ padding: '30px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '24px', marginBottom: '50px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <CheckCircle2 size={18} color="#10b981" />
                                <h4 style={{ margin: 0, color: '#10b981', fontSize: '13px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1px' }}>Diagnostic Resolution</h4>
                            </div>
                            <p style={{ margin: 0, color: '#10b981', fontWeight: '600', fontSize: '16px', lineHeight: '1.6' }}>{ticket.resolutionNotes}</p>
                        </div>
                    )}

                    {user.role !== 'ROLE_USER' && (
                        <div style={{
                            marginBottom: '50px', padding: '30px',
                            background: 'rgba(59, 130, 246, 0.03)',
                            borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            flexWrap: 'wrap', gap: '25px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={20} /></div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-main)' }}>Engineering Override</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Update ticket lifecycle state manually.</div>
                                </div>
                            </div>
                            <select value={ticket.status} className="premium-input" style={{ width: '220px', padding: '12px 20px', margin: 0, fontWeight: '800' }} onChange={async (e) => {
                                const newStatus = e.target.value;
                                let notes = ticket.resolutionNotes || '';
                                if (newStatus === 'REJECTED' || newStatus === 'CLOSED' || newStatus === 'RESOLVED') {
                                    const res = prompt(`Enter ${newStatus.toLowerCase()} notes/reason:`, notes);
                                    if (res === null) return;
                                    notes = res;
                                }
                                try {
                                    await api.put(`/tickets/${ticket.id}/status`, { status: newStatus, resolutionNotes: notes });
                                    fetchData();
                                    showNotification(`Ticket successfully marked as ${newStatus}`, 'success');
                                } catch (err) { showNotification('Status Update Failed', 'error'); }
                            }}>
                                <option value="OPEN">Queue: OPEN</option>
                                <option value="IN_PROGRESS">Active: IN PROGRESS</option>
                                <option value="RESOLVED">Actioned: RESOLVED</option>
                                <option value="CLOSED">Finalized: CLOSED</option>
                                <option value="REJECTED">Decision: REJECTED</option>
                            </select>
                        </div>
                    )}

                    {attachments.length > 0 && (
                        <div style={{ marginBottom: '60px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                                <Paperclip size={18} color="var(--primary)" />
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px' }}>Visual Evidence Repository</h3>
                            </div>
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px'
                            }}>
                                {attachments.map(att => (
                                    <div key={att.id} style={{
                                        position: 'relative', overflow: 'hidden', borderRadius: '20px', border: '1px solid var(--border)', transition: 'all 0.3s'
                                    }}
                                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                        <img
                                            src={`data:${att.contentType};base64,${att.data}`}
                                            alt="evidence"
                                            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '50px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                            <MessageSquare size={18} color="var(--primary)" />
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>Engineering Chain of Custody</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '50px' }}>
                            {comments.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
                                    <MessageSquare size={32} opacity={0.1} style={{ marginBottom: '15px' }} />
                                    <p style={{ margin: 0, fontWeight: '700' }}>Waiting for correspondence.</p>
                                </div>
                            ) : comments.map(c => (
                                <div key={c.id} style={{
                                    padding: '24px 30px',
                                    background: c.user?.id === user.id ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.02)',
                                    borderRadius: '24px',
                                    border: `1px solid ${c.user?.id === user.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--border)'}`,
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', background: 'var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900', color: 'var(--primary)' }}>
                                                {c.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '900', color: 'var(--text-main)', fontSize: '14px' }}>{c.user?.name}</div>
                                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{c.user?.role.replace('ROLE_', '')} &bull; Verification Level 1</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={12} /> {new Date(c.createdAt).toLocaleDateString()} — {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <p style={{ margin: '0 0 20px 0', whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-main)', fontWeight: '500' }}>{c.content}</p>
                                    {c.user?.id === user.id && (
                                        <button onClick={() => handleDeleteComment(c.id)} style={{ padding: '8px 12px', fontSize: '11px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Trash2 size={12} /> Erase Record
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleAddComment} style={{ position: 'relative' }}>
                            <textarea rows="4" required placeholder="Append engineering notes or user comments..." value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                className="premium-input"
                                style={{ padding: '25px', paddingRight: '150px', resize: 'vertical', minHeight: '120px' }} />
                            <button type="submit" style={{
                                position: 'absolute', bottom: '20px', right: '20px',
                                padding: '12px 24px', background: 'var(--primary)',
                                color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                                fontWeight: '900', fontSize: '14px', transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
                            }}
                                onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                                onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                            >
                                <Send size={16} /> Transmit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
