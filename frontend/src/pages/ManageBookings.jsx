import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    
    const fetchBookings = () => {
        api.get('/bookings').then(res => setBookings(res.data)).catch(err => console.error(err));
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id, newStatus, reason = null) => {
        try {
            await api.put(`/bookings/${id}/status`, { status: newStatus, rejectionReason: reason });
            fetchBookings(); // Refresh grid
            alert(`Booking successfully marked as ${newStatus}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update booking status due to conflicts.');
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>Admin Dashboard: Manage Pending Bookings</h2>
            <p style={{color: '#555'}}>Approve or reject resource booking requests. Approving a booking strictly enforces time-overlap conflict prevention.</p>
            
            <div style={{ overflowX: 'auto', marginTop: '30px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', color: '#333', textAlign: 'left' }}>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Req ID</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Resource</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Requested By</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Time Window</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Purpose</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>State</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Action Panel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px' }}>#{b.id}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{b.resource.name}</td>
                                <td style={{ padding: '15px' }}>{b.user.email}</td>
                                <td style={{ padding: '15px', fontSize: '13px' }}>
                                    {new Date(b.startTime).toLocaleString()} <br/>
                                    <span style={{color: '#aaa'}}>to</span> <br/>
                                    {new Date(b.endTime).toLocaleString()}
                                </td>
                                <td style={{ padding: '15px' }}>{b.purpose}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        fontWeight: 'bold', fontSize: '12px', padding: '4px 8px', borderRadius: '4px',
                                        backgroundColor: b.status === 'APPROVED' ? '#e8f5e9' : b.status === 'REJECTED' ? '#ffebee' : '#fff3e0',
                                        color: b.status === 'APPROVED' ? '#2e7d32' : b.status === 'REJECTED' ? '#c62828' : '#e65100'
                                    }}>
                                        {b.status}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {b.status === 'PENDING' && (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => updateStatus(b.id, 'APPROVED')} 
                                                style={{ background: '#2ecc71', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                Approve
                                            </button>
                                            <button onClick={() => {
                                                const reason = prompt('Provide rejection reason:');
                                                if(reason) updateStatus(b.id, 'REJECTED', reason);
                                            }} 
                                                style={{ background: '#e74c3c', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && <p style={{textAlign: 'center', marginTop: '20px', color: '#888'}}>No bookings found in the system.</p>}
            </div>
        </div>
    );
};

export default ManageBookings;
