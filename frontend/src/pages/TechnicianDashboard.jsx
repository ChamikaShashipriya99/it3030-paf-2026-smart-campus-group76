import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const TechnicianDashboard = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);

    const fetchTickets = () => {
        api.get('/tickets').then(res => setTickets(res.data)).catch(err => console.error(err));
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const assignToMe = async (ticketId) => {
        try {
            await api.put(`/tickets/${ticketId}/assign/${user.id}`);
            fetchTickets();
        } catch (err) { alert('Assignment Failed'); }
    };

    const resolveTicket = async (ticketId) => {
        const notes = prompt("Enter resolution notes (e.g., Fixed projector bulb):");
        if (notes) {
            try {
                await api.put(`/tickets/${ticketId}/status`, { status: 'RESOLVED', resolutionNotes: notes });
                fetchTickets();
            } catch (err) { alert('Resolution Update Failed'); }
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>IT & Maintenance Service Desk</h2>
            <p>View, claim, and resolve campus incident tickets.</p>
            
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>ID</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Resource</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Category</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Priority</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Description</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>State</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Technician</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Action Panel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px' }}>#{t.id}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{t.resource.name}</td>
                                <td style={{ padding: '15px' }}>{t.category}</td>
                                <td style={{ padding: '15px', color: t.priority === 'HIGH' ? 'red' : 'inherit', fontWeight: 'bold' }}>{t.priority}</td>
                                <td style={{ padding: '15px', maxWidth: '200px' }}>{t.description}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '12px', padding: '4px 8px', borderRadius: '4px',
                                        backgroundColor: t.status === 'RESOLVED' ? '#e8f5e9' : t.status === 'OPEN' ? '#ffebee' : '#e3f2fd',
                                        color: t.status === 'RESOLVED' ? '#2e7d32' : t.status === 'OPEN' ? '#c62828' : '#1565c0'
                                    }}>
                                        {t.status}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>{t.technician ? t.technician.email : <i style={{color: '#999'}}>Unassigned</i>}</td>
                                <td style={{ padding: '15px' }}>
                                    {t.status === 'OPEN' && (
                                        <button onClick={() => assignToMe(t.id)} style={{ background: '#1da1f2', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Claim</button>
                                    )}
                                    {t.status === 'IN_PROGRESS' && t.technician?.id === user.id && (
                                        <button onClick={() => resolveTicket(t.id)} style={{ background: '#2ecc71', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Mark Resolved</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tickets.length === 0 && <p style={{textAlign: 'center', marginTop: '20px', color: '#888'}}>No incidents reported. All good!</p>}
            </div>
        </div>
    );
};

export default TechnicianDashboard;
