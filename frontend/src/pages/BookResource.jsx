import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const BookResource = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [resource, setResource] = useState(null);
    const [formData, setFormData] = useState({ startTime: '', endTime: '', purpose: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/resources/${id}`).then(res => setResource(res.data)).catch(err => console.error(err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/bookings', {
                userId: user.id,
                resourceId: Number(id),
                startTime: formData.startTime,
                endTime: formData.endTime,
                purpose: formData.purpose
            });
            alert('Booking request submitted successfully! Awaiting Admin approval.');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit booking request. Time slot may be overlapping.');
        }
    };

    if (!resource) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading resource details...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
            <h2 style={{marginTop: 0, color: '#1da1f2'}}>Book: {resource.name}</h2>
            <div style={{background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                <p style={{margin: '5px 0'}}><strong>Type:</strong> {resource.type}</p>
                <p style={{margin: '5px 0'}}><strong>Capacity:</strong> {resource.capacity} people</p>
                <p style={{margin: '5px 0'}}><strong>Location:</strong> {resource.location}</p>
                <p style={{margin: '5px 0'}}><strong>Available Times:</strong> {resource.availabilityWindows}</p>
            </div>

            {error && <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '5px', marginBottom: '20px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{fontWeight: 'bold'}}>Start Time</label>
                    <input type="datetime-local" required value={formData.startTime} 
                           onChange={e => setFormData({...formData, startTime: e.target.value})} 
                           style={{ width: '100%', padding: '10px', marginTop: '8px', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label style={{fontWeight: 'bold'}}>End Time</label>
                    <input type="datetime-local" required value={formData.endTime} 
                           onChange={e => setFormData({...formData, endTime: e.target.value})} 
                           style={{ width: '100%', padding: '10px', marginTop: '8px', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label style={{fontWeight: 'bold'}}>Purpose of Booking</label>
                    <textarea required rows="4" value={formData.purpose} placeholder="Describe the event, seminar, or class..."
                              onChange={e => setFormData({...formData, purpose: e.target.value})} 
                              style={{ width: '100%', padding: '10px', marginTop: '8px', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" style={{ padding: '12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    Submit Booking Request
                </button>
                <button type="button" onClick={() => navigate('/catalogue')} style={{ padding: '12px', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    Cancel Request
                </button>
            </form>
        </div>
    );
};

export default BookResource;
