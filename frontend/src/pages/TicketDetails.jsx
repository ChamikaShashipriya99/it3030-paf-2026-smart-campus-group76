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
    AlertCircle,
    Pencil,
    X,
    Save,
    ChevronRight,
    Building2,
    MoreHorizontal,
    Heart
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
    const [isFavorite, setIsFavorite] = useState(false);

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const tRes = await api.get(`/tickets/${id}`);
            setTicket(tRes.data);
            const cRes = await api.get(`/tickets/${id}/comments`);
            setComments(cRes.data);
            const aRes = await api.get(`/tickets/${id}/attachments`);
            setAttachments(aRes.data);
            
            const fRes = await api.get(`/tickets/favorites?userId=${user.id}`);
            setIsFavorite(fRes.data.some(f => f.id === id));
        } catch (err) {
            showNotification('Error loading ticket details', 'error');
        }
    }, [id, showNotification, user.id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const toggleFavorite = async () => {
        if (user.role !== 'ROLE_TECHNICIAN') {
            showNotification('Favorites is only available for Technicians', 'error');
            return;
        }
        try {
            await api.post(`/tickets/${id}/favorite?userId=${user.id}`);
            setIsFavorite(!isFavorite);
            showNotification(!isFavorite ? 'Saved to favorites ❤️' : 'Removed from favorites', 'success');
        } catch (err) {
            showNotification('Failed to toggle favorite', 'error');
        }
    };

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

    const handleUpdateComment = async (cid) => {
        if (!editContent.trim()) return;
        try {
            await api.put(`/tickets/comments/${cid}/user/${user.id}`, { content: editContent });
            setEditingId(null);
            fetchData();
            showNotification('Comment updated successfully', 'success');
        } catch (e) { showNotification('Failed to update comment', 'error'); }
    };

    if (!ticket) return (
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <div className="skeleton" style={{ width: '100%', maxWidth: '900px', height: '500px', borderRadius: '32px', margin: '0 auto' }} />
        </div>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return { bg: '#FEF2F2', text: '#EF4444', border: '#FEE2E2' };
            case 'IN_PROGRESS': return { bg: '#FFFBEB', text: '#F59E0B', border: '#FEF3C7' };
            case 'RESOLVED': return { bg: '#ECFDF5', text: '#10B981', border: '#D1FAE5' };
            default: return { bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB' };
        }
    };

    const statusStyle = getStatusColor(ticket.status);

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            {/* Header / Breadcrumb */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#6B7280',
                            width: '44px', height: '44px', borderRadius: '12px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-1px' }}>
                                Ticket #{ticket.id.substring(0, 8)}
                            </h2>
                            {user.role === 'ROLE_TECHNICIAN' && (
                                <button
                                    onClick={toggleFavorite}
                                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                    }}
                                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.8)')}
                                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    <Heart
                                        size={24}
                                        fill={isFavorite ? "#ff4d6d" : "transparent"}
                                        color={isFavorite ? "#ff4d6d" : "#94a3b8"}
                                        style={{ transition: 'all 0.3s ease' }}
                                    />
                                </button>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '13px', color: '#6B7280' }}>
                            <span style={{ fontWeight: '800', color: statusStyle.text }}>{ticket.status.replace('_', ' ')}</span>
                            <span style={{ opacity: 0.3 }}>&bull;</span>
                            <span>{ticket.category}</span>
                            <span style={{ opacity: 0.3 }}>&bull;</span>
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{
                        background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}`,
                        padding: '10px 20px', borderRadius: '14px', fontSize: '13px', fontWeight: '900',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <Clock size={16} /> Status Tracking
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start' }}>

                {/* LEFT COLUMN: Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Description Card */}
                    <div className="premium-card" style={{ padding: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#F0F7FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                                <AlertCircle size={20} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' }}>Incident Brief</h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.8', color: '#4B5563', fontWeight: '500', background: '#F9FAFB', padding: '25px', borderRadius: '16px', border: '1px solid #F3F4F6' }}>
                            {ticket.description}
                        </p>

                        {ticket.resolutionNotes && (
                            <div style={{ marginTop: '30px', padding: '25px', background: '#ECFDF5', border: '1px solid #D1FAE5', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <CheckCircle2 size={18} color="#10B981" />
                                    <span style={{ fontSize: '13px', fontWeight: '900', color: '#065F46', textTransform: 'uppercase', letterSpacing: '1px' }}>Final Resolution</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '15px', color: '#065F46', fontWeight: '600', lineHeight: '1.6' }}>{ticket.resolutionNotes}</p>
                            </div>
                        )}
                    </div>

                    {/* Timeline / Comments */}
                    <div className="premium-card" style={{ padding: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', background: '#F5F3FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                                    <MessageSquare size={20} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' }}>Communication Feed</h3>
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase' }}>{comments.length} Entries</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                            {comments.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', background: '#F9FAFB', borderRadius: '20px', border: '1px dashed #E5E7EB', color: '#9CA3AF' }}>
                                    No correspondence recorded yet.
                                </div>
                            ) : comments.map(c => (
                                <div key={c.id} style={{
                                    padding: '25px',
                                    background: c.user?.id === user.id ? 'rgba(37, 99, 235, 0.02)' : '#FFFFFF',
                                    borderRadius: '20px',
                                    border: `1px solid ${c.user?.id === user.id ? 'rgba(37, 99, 235, 0.1)' : '#F3F4F6'}`,
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', background: '#E5E7EB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', color: '#2563EB' }}>
                                                {c.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '800', color: '#111827' }}>{c.user?.name}</div>
                                                <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 'bold' }}>{c.user?.role.replace('ROLE_', '')}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={12} /> {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    {editingId === c.id ? (
                                        <div style={{ marginTop: '10px' }}>
                                            <textarea
                                                className="premium-input"
                                                value={editContent}
                                                onChange={e => setEditContent(e.target.value)}
                                                style={{ marginBottom: '15px', padding: '15px', fontSize: '14px' }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleUpdateComment(c.id)} style={{ padding: '8px 16px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Save size={14} /> Update
                                                </button>
                                                <button onClick={() => setEditingId(null)} style={{ padding: '8px 16px', background: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '12px' }}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#374151', lineHeight: '1.6', fontWeight: '500' }}>{c.content}</p>
                                            {c.user?.id === user.id && (
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <button onClick={() => { setEditingId(c.id); setEditContent(c.content); }} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
                                                        <Pencil size={12} /> Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteComment(c.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <textarea
                                    placeholder="Type your message here..."
                                    className="premium-input"
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    style={{ height: '100px', padding: '20px', fontSize: '14px' }}
                                />
                                <button type="submit" style={{ position: 'absolute', bottom: '15px', right: '15px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN: Sidebar Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'sticky', top: '100px' }}>

                    {/* Action Card (Staff Only) */}
                    {(user.role === 'ROLE_ADMIN' || user.role === 'ROLE_TECHNICIAN') && (
                        <div className="premium-card" style={{ padding: '30px', background: '#F0F7FF', border: '1px solid #DBEAFE' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <ShieldCheck size={18} color="#2563EB" />
                                <span style={{ fontSize: '13px', fontWeight: '900', color: '#1E40AF', textTransform: 'uppercase' }}>Control Panel</span>
                            </div>
                            <select
                                value={ticket.status}
                                className="premium-input"
                                style={{ background: 'white', marginBottom: '15px' }}
                                onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    let notes = ticket.resolutionNotes || '';
                                    if (newStatus === 'REJECTED' || newStatus === 'CLOSED' || newStatus === 'RESOLVED') {
                                        const res = prompt(`Notes for ${newStatus}:`, notes);
                                        if (res === null) return;
                                        notes = res;
                                    }
                                    try {
                                        await api.put(`/tickets/${ticket.id}/status`, { status: newStatus, resolutionNotes: notes });
                                        fetchData();
                                        showNotification(`Updated to ${newStatus}`, 'success');
                                    } catch (err) { showNotification('Update failed', 'error'); }
                                }}
                            >
                                <option value="OPEN">Mark Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                                <option value="REJECTED">Reject</option>
                            </select>
                            <p style={{ margin: 0, fontSize: '11px', color: '#60A5FA', textAlign: 'center' }}>Technician overrides are audit-logged.</p>
                        </div>
                    )}

                    {/* Context Card */}
                    <div className="premium-card" style={{ padding: '30px' }}>
                        <h4 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: '800', color: '#111827' }}>Asset Context</h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', background: '#F9FAFB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                                    <Building2 size={18} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '800', textTransform: 'uppercase' }}>Resource</div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{ticket.resource?.name}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', background: '#F9FAFB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                                    <MapPin size={18} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '800', textTransform: 'uppercase' }}>Location</div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{ticket.resource?.location}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', background: '#F9FAFB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                                    <User size={18} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '800', textTransform: 'uppercase' }}>Contact Info</div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{ticket.contactDetails}</div>
                                </div>
                            </div>
                        </div>

                        {attachments.length > 0 && (
                            <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #F3F4F6' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                                    <Paperclip size={16} color="#9CA3AF" />
                                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#111827' }}>Evidence ({attachments.length})</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                    {attachments.map(att => (
                                        <div key={att.id} style={{ height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB', cursor: 'pointer' }}>
                                            <img src={`data:${att.contentType};base64,${att.data}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '12px', padding: '0 20px' }}>
                        Need help? Contact the IT helpdesk for technical infrastructure queries.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
