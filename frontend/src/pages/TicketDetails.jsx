import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

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
        } catch(err) {
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
        } catch(e) { showNotification('Failed to post comment', 'error'); }
    };

    const handleDeleteComment = async (cid) => {
        if (!window.confirm("Delete this comment permanently?")) return;
        try {
            await api.delete(`/tickets/comments/${cid}/user/${user.id}`);
            fetchData();
            showNotification('Comment deleted', 'success');
        } catch(e) { showNotification('Failed to delete comment', 'error'); }
    };

    if (!ticket) return <div style={{padding: '50px'}}>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <button onClick={() => navigate(-1)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#1da1f2', fontWeight: 'bold', fontSize: '15px'}}>← Back</button>
            <h2 style={{marginTop: '20px'}}>Ticket #{ticket.id}: {ticket.category} Issue</h2>
            <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
                <span style={{padding: '6px 12px', background: '#ecf0f1', borderRadius: '4px'}}>Status: <strong>{ticket.status}</strong></span>
                <span style={{padding: '6px 12px', background: '#ecf0f1', borderRadius: '4px'}}>Priority: <strong>{ticket.priority}</strong></span>
                <span style={{padding: '6px 12px', background: '#ecf0f1', borderRadius: '4px'}}>Resource: <strong>{ticket.resource?.name}</strong></span>
            </div>
            
            <p><strong>Description:</strong><br/>{ticket.description}</p>
            
            {attachments.length > 0 && (
                <div style={{marginTop: '30px'}}>
                    <h4>Attachments (Evidence)</h4>
                    <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
                        {attachments.map(att => (
                            <div key={att.id} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <img src={`data:${att.contentType};base64,${att.data}`} alt="evidence" style={{maxWidth: '200px', borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <hr style={{margin: '40px 0', borderTop: '1px solid #eee'}} />
            
            <h3>Comments / Updates</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px'}}>
                {comments.length === 0 ? <p style={{color: '#999'}}>No comments yet.</p> : comments.map(c => (
                    <div key={c.id} style={{padding: '15px', background: c.user?.id === user.id ? '#eaf2f8' : '#f8f9fa', borderRadius: '8px', border: '1px solid #e1e8ed'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                            <strong>{c.user?.name || 'User'} <span style={{fontSize: '11px', color: '#777', fontWeight: 'normal'}}>({c.user?.role.replace('ROLE_', '')})</span></strong>
                            <span style={{fontSize: '12px', color: '#666'}}>{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        <p style={{margin: '0 0 10px 0', whiteSpace: 'pre-wrap'}}>{c.content}</p>
                        {c.user?.id === user.id && (
                            <button onClick={() => handleDeleteComment(c.id)} style={{fontSize: '12px', color: '#e74c3c', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 'bold'}}>
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddComment} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <textarea rows="3" required placeholder="Add a comment or update..." value={newComment} onChange={e => setNewComment(e.target.value)}
                    style={{padding: '12px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical'}}/>
                <button type="submit" style={{alignSelf: 'flex-start', padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>
                    Post Comment
                </button>
            </form>
        </div>
    );
};

export default TicketDetails;
