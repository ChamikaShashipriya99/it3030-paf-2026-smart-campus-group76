import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Catalogue = () => {
    const { user } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newRes, setNewRes] = useState({ name: '', type: 'LECTURE_HALL', capacity: 0, location: '', status: 'ACTIVE', startTime: '08:00', endTime: '18:00' });
    const [resImage, setResImage] = useState(null);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const endpoint = typeFilter ? `/resources?type=${typeFilter}` : '/resources';
            const response = await api.get(endpoint);
            // Artificial delay to show premium skeleton loaders for 3 seconds
            setTimeout(() => {
                setResources(response.data);
                setLoading(false);
            }, 3000);
        } catch (error) {
            console.error("Failed to fetch resources", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [typeFilter]);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newRes.name);
            formData.append('type', newRes.type);
            formData.append('capacity', newRes.capacity);
            formData.append('location', newRes.location);
            formData.append('status', newRes.status);
            formData.append('startTime', newRes.startTime);
            formData.append('endTime', newRes.endTime);
            if (resImage) {
                formData.append('image', resImage);
            }

            if (isEditing) {
                await api.put(`/resources/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                alert('Facility updated successfully!');
            } else {
                await api.post('/resources', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                alert('Facility added successfully!');
            }

            setShowAddForm(false);
            setIsEditing(false);
            setEditId(null);
            setNewRes({ name: '', type: 'LECTURE_HALL', capacity: 0, location: '', status: 'ACTIVE', startTime: '08:00', endTime: '18:00' });
            setResImage(null);
            fetchResources();
        } catch(err) { alert('Failed to save resource.'); }
    };

    const handleEditClick = (res) => {
        setIsEditing(true);
        setEditId(res.id);
        setNewRes({ name: res.name, type: res.type, capacity: res.capacity, location: res.location, status: res.status, startTime: res.startTime || '08:00', endTime: res.endTime || '18:00' });
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        if(window.confirm("Are you sure you want to delete this resource?")) {
            try {
                await api.delete(`/resources/${id}`);
                fetchResources();
            } catch(e) { alert("Failed to delete resource"); }
        }
    };

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
                {user?.role === 'ROLE_ADMIN' && (
                    <button onClick={() => {
                        setShowAddForm(!showAddForm);
                        if(showAddForm) { setIsEditing(false); setEditId(null); setNewRes({ name: '', type: 'LECTURE_HALL', capacity: 0, location: '', status: 'ACTIVE', startTime: '08:00', endTime: '18:00' }); }
                    }} style={{ float: 'right', padding: '8px 15px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {showAddForm ? 'Cancel' : '+ Add New Facility'}
                    </button>
                )}
            </div>

            {showAddForm && (
                <form onSubmit={handleAdd} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
                    <h3 style={{marginTop: 0}}>{isEditing ? 'Edit Resource' : 'Create New Resource'}</h3>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <input required placeholder="Name (e.g. Hall A)" value={newRes.name} onChange={e => setNewRes({...newRes, name: e.target.value})} style={{padding: '8px'}} />
                        <select value={newRes.type} onChange={e => setNewRes({...newRes, type: e.target.value})} style={{padding: '8px'}}>
                            <option value="LECTURE_HALL">Lecture Hall</option>
                            <option value="LAB">Laboratory</option>
                            <option value="MEETING_ROOM">Meeting Room</option>
                            <option value="EQUIPMENT">Equipment</option>
                        </select>
                        <input required type="number" placeholder="Capacity" value={newRes.capacity} onChange={e => setNewRes({...newRes, capacity: parseInt(e.target.value) || 0})} style={{padding: '8px', width: '100px'}} />
                        <input required placeholder="Location" value={newRes.location} onChange={e => setNewRes({...newRes, location: e.target.value})} style={{padding: '8px'}} />
                        <select value={newRes.status} onChange={e => setNewRes({...newRes, status: e.target.value})} style={{padding: '8px'}}>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="MAINTENANCE">MAINTENANCE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                        <input required type="time" placeholder="Start Time" value={newRes.startTime} onChange={e => setNewRes({...newRes, startTime: e.target.value})} style={{padding: '8px'}} />
                        <input required type="time" placeholder="End Time" value={newRes.endTime} onChange={e => setNewRes({...newRes, endTime: e.target.value})} style={{padding: '8px'}} />
                        <input type="file" accept="image/*" onChange={e => setResImage(e.target.files[0])} style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
                        <button type="submit" style={{ padding: '8px 20px', background: '#1da1f2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save / Upload</button>
                    </div>
                </form>
            )}

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="premium-card" style={{ display: 'flex', flexDirection: 'row', gap: '24px', padding: '16px', minHeight: '200px' }}>
                            <div className="skeleton" style={{ flex: '0 0 180px', height: '168px', borderRadius: '12px' }}></div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div className="skeleton" style={{ width: '40%', height: '24px', borderRadius: '4px' }}></div>
                                        <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '20px' }}></div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
                                        <div className="skeleton" style={{ width: '80%', height: '14px', borderRadius: '4px' }}></div>
                                        <div className="skeleton" style={{ width: '70%', height: '14px', borderRadius: '4px' }}></div>
                                        <div className="skeleton" style={{ width: '90%', height: '14px', borderRadius: '4px' }}></div>
                                        <div className="skeleton" style={{ width: '60%', height: '14px', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', paddingTop: '15px' }}>
                                    <div className="skeleton" style={{ flex: 1, height: '36px', borderRadius: '10px' }}></div>
                                    <div className="skeleton" style={{ flex: 1, height: '36px', borderRadius: '10px' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {resources.map(res => (
                        <div key={res.id} className="premium-card" style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '24px',
                            padding: '16px',
                            minHeight: '200px',
                            alignItems: 'stretch',
                            overflow: 'hidden'
                        }}>
                            {res.image && (
                                <div style={{ flex: '0 0 180px', height: 'auto', minHeight: '160px', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                    <img src={`data:${res.imageContentType};base64,${res.image}`} alt={res.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="zoom-hover" />
                                </div>
                            )}
                            
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <h3 style={{ margin: '0', color: 'var(--text-main)', fontSize: '20px', letterSpacing: '-0.5px' }}>{res.name}</h3>
                                        <span style={{
                                            backgroundColor: res.status === 'ACTIVE' ? '#dcfce7' : res.status === 'INACTIVE' ? '#f1f5f9' : '#fee2e2',
                                            color: res.status === 'ACTIVE' ? '#166534' : res.status === 'INACTIVE' ? '#475569' : '#991b1b',
                                            border: `1px solid ${res.status === 'ACTIVE' ? '#bbf7d0' : res.status === 'INACTIVE' ? '#e2e8f0' : '#fecaca'}`,
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase'
                                        }}>
                                            {res.status === 'ACTIVE' ? 'AVAILABLE' : res.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: '15px' }}>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            <strong style={{color:'#1e293b'}}>Type:</strong> {res.type.replace('_', ' ')}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            <strong style={{color:'#1e293b'}}>Capacity:</strong> {res.capacity} pax
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            <strong style={{color:'#1e293b'}}>Location:</strong> {res.location}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            <strong style={{color:'#1e293b'}}>Hours:</strong> {res.startTime || '08:00'} - {res.endTime || '18:00'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                    {user?.role === 'ROLE_USER' && res.status === 'ACTIVE' && (
                                        <>
                                            <button onClick={() => window.location.href=`/book/${res.id}`} style={{ flex: 1, padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}>Book Booking</button>
                                            <button onClick={() => window.location.href=`/report/${res.id}`} style={{ flex: 1, padding: '10px', background: 'white', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Report Issue</button>
                                        </>
                                    )}

                                    {user?.role === 'ROLE_ADMIN' && (
                                        <>
                                            <button onClick={() => handleEditClick(res)} style={{ flex: 1, padding: '10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)' }}>Modify</button>
                                            <button onClick={() => handleDeleteClick(res.id)} style={{ flex: 1, padding: '10px', background: 'white', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Remove</button>
                                        </>
                                    )}
                                </div>
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
