import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const ReportIssue = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [resource, setResource] = useState(null);
    const [formData, setFormData] = useState({ category: 'IT_EQUIPMENT', priority: 'MEDIUM', description: '' });

    useEffect(() => {
        api.get(`/resources/${id}`).then(res => setResource(res.data)).catch(err => console.error(err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tickets', {
                creatorId: user.id,
                resourceId: Number(id),
                category: formData.category,
                priority: formData.priority,
                description: formData.description
            });
            showNotification('Incident Ticket submitted successfully! IT Support has been notified.', 'success');
            navigate('/dashboard');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Failed to submit ticket.', 'error');
        }
    };

    if (!resource) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
            <h2 style={{marginTop: 0, color: '#e74c3c'}}>Report an Issue: {resource.name}</h2>
            <p>Help us keep the campus running smoothly by reporting any damages or issues with this resource.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <div>
                    <label style={{fontWeight: 'bold'}}>Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} 
                            style={{ width: '100%', padding: '10px', marginTop: '8px', border: '1px solid #ccc', borderRadius: '6px' }}>
                        <option value="IT_EQUIPMENT">IT / Technology</option>
                        <option value="FURNITURE">Furniture / Hardware</option>
                        <option value="PLUMBING">Plumbing / Leaks</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <div>
                    <label style={{fontWeight: 'bold'}}>Priority Severity</label>
                    <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} 
                            style={{ width: '100%', padding: '10px', marginTop: '8px', border: '1px solid #ccc', borderRadius: '6px' }}>
                        <option value="LOW">Low (Not urgent)</option>
                        <option value="MEDIUM">Medium (Affects usage)</option>
                        <option value="HIGH">High (Critical emergency)</option>
                    </select>
                </div>
                <div>
                    <label style={{fontWeight: 'bold'}}>Detailed Description</label>
                    <textarea required rows="4" value={formData.description} placeholder="Describe exactly what is broken..."
                              onChange={e => setFormData({...formData, description: e.target.value})} 
                              style={{ width: '100%', padding: '10px', marginTop: '8px', border: '1px solid #ccc', borderRadius: '6px' }} />
                </div>
                <button type="submit" style={{ padding: '12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    Submit Incident Ticket
                </button>
                <button type="button" onClick={() => navigate('/catalogue')} style={{ padding: '12px', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default ReportIssue;
