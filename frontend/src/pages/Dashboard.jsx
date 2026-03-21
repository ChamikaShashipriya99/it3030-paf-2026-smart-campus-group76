import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [myTickets, setMyTickets] = useState([]);

    useEffect(() => {
        if (user && user.role === 'ROLE_USER') {
            api.get(`/tickets/user/${user.id}`).then(res => setMyTickets(res.data)).catch(err => console.error(err));
        }
    }, [user]);

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>Welcome to Smart Campus, {user?.name}!</h2>
            <div style={{
                background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginTop: '20px'
            }}>
                <p><strong>Email Address:</strong> {user?.email}</p>
                <p><strong>Assigned Role:</strong> {user?.role}</p>
            </div>
            
            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <Link to="/catalogue" style={{
                    padding: '10px 20px', textDecoration: 'none',
                    backgroundColor: '#1da1f2', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold'
                }}>
                    Browse Resource Catalogue
                </Link>

                {user?.role === 'ROLE_ADMIN' && (
                    <Link to="/admin/bookings" style={{
                        padding: '10px 20px', textDecoration: 'none',
                        backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold'
                    }}>
                        Admin: Manage Bookings
                    </Link>
                )}

                {(user?.role === 'ROLE_TECHNICIAN' || user?.role === 'ROLE_ADMIN') && (
                    <Link to="/technician/desk" style={{
                        padding: '10px 20px', textDecoration: 'none',
                        backgroundColor: '#9b59b6', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold'
                    }}>
                        Service Desk (Tickets)
                    </Link>
                )}
                
                <button 
                    onClick={logout}
                    style={{
                        padding: '10px 20px', cursor: 'pointer',
                        backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px'
                    }}
                >
                    Logout securely
                </button>
            </div>

            {user?.role === 'ROLE_USER' && (
                <div style={{ marginTop: '40px' }}>
                    <h3>My Reported Incidents</h3>
                    {myTickets.length === 0 ? <p style={{color: '#777'}}>You haven't reported any issues.</p> : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {myTickets.map(t => (
                                <div key={t.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                                        <strong>{t.category} Issue</strong>
                                        <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '12px', background: '#ecf0f1', color: t.status === 'RESOLVED' ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>{t.status}</span>
                                    </div>
                                    <p style={{fontSize: '14px', color: '#555', margin: '0 0 15px 0'}}>{t.description.substring(0, 50)}...</p>
                                    <button onClick={() => navigate(`/ticket/${t.id}`)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>View Ticket Details</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
