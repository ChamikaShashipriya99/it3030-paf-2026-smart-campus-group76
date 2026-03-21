import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

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
        } catch(e) {}
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{marginTop: 0}}>Inbox Notifications</h2>
            <p style={{color: '#666'}}>Stay updated on your tickets, bookings, and operations.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px'}}>
                {notifications.length === 0 ? <p style={{color: '#999', textAlign: 'center', padding: '40px'}}>You have no notifications yet.</p> : notifications.map(n => (
                    <div key={n.id} style={{ padding: '15px', background: n.read ? '#f8f9fa' : '#eaf2f8', borderLeft: `4px solid ${n.type === 'SUCCESS' ? '#2ecc71' : n.type === 'WARNING' ? '#f39c12' : '#3498db'}`, borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                            <strong style={{color: '#333'}}>{n.type}</strong>
                            <span style={{fontSize: '12px', color: '#666'}}>{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                        <p style={{margin: '0 0 10px 0', fontSize: '15px'}}>{n.message}</p>
                        {!n.read && <button onClick={() => markRead(n.id)} style={{background: 'none', border: '1px solid #1da1f2', color: '#1da1f2', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'}}>Mark as Read</button>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
