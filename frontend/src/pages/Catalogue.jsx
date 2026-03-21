import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const Catalogue = () => {
    const [resources, setResources] = useState([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const endpoint = typeFilter ? `/resources?type=${typeFilter}` : '/resources';
            const response = await api.get(endpoint);
            setResources(response.data);
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [typeFilter]);

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>Facilities & Assets Catalogue</h2>
            <p style={{ color: '#555' }}>Browse and filter available university resources.</p>
            
            <div style={{ margin: '20px 0', padding: '15px', background: '#f0f4f8', borderRadius: '8px' }}>
                <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Type:</label>
                <select 
                    value={typeFilter} 
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="">All Categories</option>
                    <option value="LECTURE_HALL">Lecture Halls</option>
                    <option value="LAB">Laboratories</option>
                    <option value="MEETING_ROOM">Meeting Rooms</option>
                    <option value="EQUIPMENT">Equipment (Projectors, etc.)</option>
                </select>
            </div>

            {loading ? (
                <p>Loading catalogue...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                    {resources.map(res => (
                        <div key={res.id} style={{
                            border: '1px solid #e1e8ed', padding: '20px', borderRadius: '12px',
                            backgroundColor: res.status === 'ACTIVE' ? '#ffffff' : '#fff5f5',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'transform 0.2s'
                        }}>
                            <h3 style={{ marginTop: '0', color: '#1da1f2' }}>{res.name}</h3>
                            <p style={{ margin: '8px 0' }}><strong>Type:</strong> {res.type}</p>
                            <p style={{ margin: '8px 0' }}><strong>Capacity:</strong> {res.capacity} pax</p>
                            <p style={{ margin: '8px 0' }}><strong>Location:</strong> {res.location}</p>
                            <p style={{ margin: '8px 0' }}><strong>Availability:</strong> {res.availabilityWindows}</p>
                            
                            <div style={{ marginTop: '15px' }}>
                                <span style={{
                                    backgroundColor: res.status === 'ACTIVE' ? '#2ecc71' : '#e74c3c',
                                    color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'
                                }}>
                                    {res.status === 'ACTIVE' ? 'AVAILABLE' : 'OUT OF SERVICE'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {resources.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888' }}>No resources match your filters.</p>}
                </div>
            )}
        </div>
    );
};

export default Catalogue;
