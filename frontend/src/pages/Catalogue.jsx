import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import {
    Search,
    Filter,
    LayoutGrid,
    List,
    Plus,
    Pencil,
    Trash2,
    Clock,
    MapPin,
    Users,
    AlertTriangle,
    CheckCircle2,
    Building2,
    Settings,
    CalendarPlus,
    AlertCircle
} from 'lucide-react';

const Catalogue = () => {
    const { user } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newRes, setNewRes] = useState({ name: '', type: 'LECTURE_HALL', capacity: 0, location: '', status: 'ACTIVE', startTime: '08:00', endTime: '18:00' });
    const [resImage, setResImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchResources = async () => {
        try {
            setLoading(true);
            const endpoint = typeFilter ? `/resources?type=${typeFilter}` : '/resources';
            const response = await api.get(endpoint);
            setTimeout(() => {
                setResources(response.data);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Failed to fetch resources", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [typeFilter]);

    const validateField = (field, value, allValues = newRes) => {
        switch (field) {
            case 'name': return (!value || value.trim().length < 3) ? 'Asset Name must be at least 3 characters.' : '';
            case 'location': return (!value || value.trim().length === 0) ? 'Location / Zone is required.' : '';
            case 'capacity': return (!value || value <= 0) ? 'Capacity must be greater than 0.' : '';
            case 'startTime': return (!value) ? 'Opening Hours are required.' : '';
            case 'endTime':
                if (!value) return 'Closing Hours are required.';
                if (allValues.startTime && value && allValues.startTime >= value) return 'Closing must be after opening.';
                return '';
            default: return '';
        }
    };

    const handleChange = (field, value) => {
        const updatedRes = { ...newRes, [field]: value };
        setNewRes(updatedRes);
        if (touched[field]) {
            setErrors(prev => ({ ...prev, [field]: validateField(field, value, updatedRes) }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        setErrors(prev => ({ ...prev, [field]: validateField(field, newRes[field]) }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        
        const newErrors = {
            name: validateField('name', newRes.name),
            location: validateField('location', newRes.location),
            capacity: validateField('capacity', newRes.capacity),
            startTime: validateField('startTime', newRes.startTime),
            endTime: validateField('endTime', newRes.endTime)
        };
        setErrors(newErrors);
        setTouched({ name: true, location: true, capacity: true, startTime: true, endTime: true });

        if (Object.values(newErrors).some(err => err !== '')) {
            showToast('Please correct the highlighted errors.', 'error');
            setTimeout(() => setTouched(prev => ({...prev})), 50);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', newRes.name);
            formData.append('type', newRes.type);
            formData.append('capacity', newRes.capacity);
            formData.append('location', newRes.location);
            formData.append('status', newRes.status);
            formData.append('startTime', newRes.startTime);
            formData.append('endTime', newRes.endTime);
            if (resImage) formData.append('image', resImage);

            if (isEditing) {
                await api.put(`/resources/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/resources', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }

            setShowAddForm(false);
            setIsEditing(false);
            setEditId(null);
            setNewRes({ name: '', type: 'LECTURE_HALL', capacity: 0, location: '', status: 'ACTIVE', startTime: '08:00', endTime: '18:00' });
            setResImage(null);
            setErrors({});
            setTouched({});
            showToast(isEditing ? 'Asset successfully updated!' : 'Asset successfully registered!');
            fetchResources();
        } catch (err) { showToast('Failed to save resource.', 'error'); }
    };

    const handleEditClick = (res) => {
        setIsEditing(true);
        setEditId(res.id);
        setNewRes({ name: res.name, type: res.type, capacity: res.capacity, location: res.location, status: res.status, startTime: res.startTime || '08:00', endTime: res.endTime || '18:00' });
        setShowAddForm(true);
        setErrors({});
        setTouched({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            try {
                await api.delete(`/resources/${id}`);
                fetchResources();
            } catch (e) { alert("Failed to delete resource"); }
        }
    };

    return (
        <div className="container" style={{ padding: '60px 0', position: 'relative' }}>
            {toast && (
                <div className="toast-notification" style={{
                    position: 'fixed', bottom: '40px', right: '40px', zIndex: 9999,
                    background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
                    backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '16px 24px', borderRadius: '16px',
                    display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                    fontWeight: '600', fontSize: '15px'
                }}>
                    {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    {toast.message}
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h2 className="page-title">Facilities & Assets</h2>
                    <p className="page-subtitle">Premium university resources available for booking and research.</p>
                </div>
                {user?.role === 'ROLE_ADMIN' && (
                    <button onClick={() => {
                        setShowAddForm(!showAddForm);
                        if (showAddForm) { setIsEditing(false); setEditId(null); setNewRes({ name: '', type: 'LECTURE_HALL', capacity: 0, location: '', status: 'ACTIVE', startTime: '08:00', endTime: '18:00' }); setErrors({}); setTouched({}); }
                    }} style={{
                        padding: '12px 24px', background: 'var(--primary)', color: 'white',
                        border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800',
                        fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)', transition: 'all 0.2s'
                    }}
                        onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                    >
                        {showAddForm ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                        {showAddForm ? 'Close Editor' : 'Register New Asset'}
                    </button>
                )}
            </div>

            <div style={{
                marginBottom: '40px',
                padding: '24px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Find lecture halls, labs, equipment..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="premium-input"
                            style={{ padding: '12px 16px 12px 48px', width: '100%', fontSize: '15px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--border)', padding: '10px', borderRadius: '12px', color: 'var(--text-muted)' }}>
                            <Filter size={18} />
                        </div>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="premium-input"
                            style={{ padding: '10px 16px', width: '200px', cursor: 'pointer' }}
                        >
                            <option value="">All Categories</option>
                            <option value="LECTURE_HALL">Lecture Halls</option>
                            <option value="LAB">Laboratories</option>
                            <option value="MEETING_ROOM">Meeting Rooms</option>
                            <option value="EQUIPMENT">Special Equipment</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setViewMode('list')}
                        style={{
                            padding: '10px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                            background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                            color: viewMode === 'list' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '13px'
                        }}>
                        <List size={16} /> Horizontal
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        style={{
                            padding: '10px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                            background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                            color: viewMode === 'grid' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '13px'
                        }}>
                        <LayoutGrid size={16} /> Gallery
                    </button>
                </div>
            </div>

            {showAddForm && (
                <div className="premium-card" style={{ padding: '50px', marginBottom: '50px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '28px', color: '#ffffff', letterSpacing: '-1px' }}>
                                {isEditing ? 'Modify Asset Details' : 'Register New University Asset'}
                            </h3>
                            <p style={{ color: '#94a3b8', margin: '8px 0 0 0', fontSize: '15px' }}>Fill out the specification details for campus-wide availability.</p>
                        </div>
                        <button type="button" onClick={() => {setShowAddForm(false); setErrors({});}} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'rotate(90deg)';}} onMouseOut={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.transform = 'rotate(0deg)';}}>
                            <Plus size={24} style={{ transform: 'rotate(45deg)', transition: 'transform 0.2s' }} />
                        </button>
                    </div>

                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
                            <div>
                                <label className="form-label" style={{ color: '#94a3b8' }}>Official Asset Name</label>
                                <input placeholder="e.g. Quantum Computing Lab - Sector 7" value={newRes.name}
                                    className={`premium-input ${errors.name && touched.name ? 'input-error' : ''}`}
                                    onChange={e => handleChange('name', e.target.value)}
                                    onBlur={() => handleBlur('name')}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: errors.name && touched.name ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }} />
                                {errors.name && touched.name && <span style={{ color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontWeight: '600' }}><AlertCircle size={14} /> {errors.name}</span>}
                            </div>
                            <div>
                                <label className="form-label" style={{ color: '#94a3b8' }}>Classification</label>
                                <div style={{ position: 'relative' }}>
                                    <select value={newRes.type} className="premium-input" onChange={e => handleChange('type', e.target.value)}
                                        style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', appearance: 'none' }}>
                                        <option value="LECTURE_HALL" style={{ color: '#000' }}>Lecture Hall</option>
                                        <option value="LAB" style={{ color: '#000' }}>Laboratory</option>
                                        <option value="MEETING_ROOM" style={{ color: '#000' }}>Meeting Room</option>
                                        <option value="EQUIPMENT" style={{ color: '#000' }}>Specialized Equipment</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div>
                                <label className="form-label" style={{ color: '#94a3b8' }}><MapPin size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Location / Zone</label>
                                <input placeholder="e.g. Engineering Block B, Level 4" value={newRes.location}
                                    className={`premium-input ${errors.location && touched.location ? 'input-error' : ''}`}
                                    onChange={e => handleChange('location', e.target.value)}
                                    onBlur={() => handleBlur('location')}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: errors.location && touched.location ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }} />
                                {errors.location && touched.location && <span style={{ color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontWeight: '600' }}><AlertCircle size={14} /> {errors.location}</span>}
                            </div>
                            <div>
                                <label className="form-label" style={{ color: '#94a3b8' }}><Users size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Occupancy Capacity</label>
                                <input type="number" min="1" value={newRes.capacity === 0 ? '' : newRes.capacity}
                                    className={`premium-input ${errors.capacity && touched.capacity ? 'input-error' : ''}`}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (val === '' || /^\d+$/.test(val)) {
                                            handleChange('capacity', val === '' ? 0 : parseInt(val, 10));
                                        }
                                    }}
                                    onKeyDown={e => {
                                        if (!/^[0-9]$/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onPaste={e => {
                                        const paste = e.clipboardData.getData('text');
                                        if (!/^\d+$/.test(paste)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onBlur={() => handleBlur('capacity')}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: errors.capacity && touched.capacity ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }} />
                                {errors.capacity && touched.capacity && <span style={{ color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontWeight: '600' }}><AlertCircle size={14} /> {errors.capacity}</span>}
                            </div>
                            <div>
                                <label className="form-label" style={{ color: '#94a3b8' }}><Settings size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> System Status</label>
                                <select value={newRes.status} className="premium-input" onChange={e => handleChange('status', e.target.value)}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', appearance: 'none' }}>
                                    <option value="ACTIVE" style={{ color: '#000' }}>OPERATIONAL</option>
                                    <option value="MAINTENANCE" style={{ color: '#000' }}>UNDER MAINTENANCE</option>
                                    <option value="INACTIVE" style={{ color: '#000' }}>DECOMMISSIONED</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-grid" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div>
                                <label className="form-label" style={{ color: '#94a3b8' }}><Clock size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Opening Hours</label>
                                <input type="time" value={newRes.startTime}
                                    className={`premium-input ${errors.startTime && touched.startTime ? 'input-error' : ''}`}
                                    onChange={e => handleChange('startTime', e.target.value)}
                                    onBlur={() => handleBlur('startTime')}
                                    style={{ background: 'rgba(0,0,0,0.2)', color: 'white', border: errors.startTime && touched.startTime ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' }} />
                                {errors.startTime && touched.startTime && <span style={{ color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontWeight: '600' }}><AlertCircle size={14} /> {errors.startTime}</span>}
                            </div>
                            <div>
                                <label className="form-label" style={{ color: '#94a3b8' }}><Clock size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Closing Hours</label>
                                <input type="time" value={newRes.endTime}
                                    className={`premium-input ${errors.endTime && touched.endTime ? 'input-error' : ''}`}
                                    onChange={e => handleChange('endTime', e.target.value)}
                                    onBlur={() => handleBlur('endTime')}
                                    style={{ background: 'rgba(0,0,0,0.2)', color: 'white', border: errors.endTime && touched.endTime ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' }} />
                                {errors.endTime && touched.endTime && <span style={{ color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontWeight: '600' }}><AlertCircle size={14} /> {errors.endTime}</span>}
                            </div>
                            <div>
                                <label className="form-label" style={{ color: '#94a3b8' }}>Digital Cover Image</label>
                                <input type="file" accept="image/*" onChange={e => setResImage(e.target.files[0])}
                                    className="premium-input" style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                            <button type="submit" style={{ flex: 2, padding: '18px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer', fontSize: '16px', fontWeight: '800', boxShadow: '0 12px 24px rgba(37, 99, 235, 0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(37, 99, 235, 0.5)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 99, 235, 0.4)'; }}>
                                {isEditing ? 'Commit Structural Changes' : 'Initialize Asset Deployment'}
                            </button>
                            <button type="button" onClick={() => {setShowAddForm(false); setErrors({}); setTouched({});}} style={{ flex: 1, padding: '18px', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', cursor: 'pointer', fontSize: '16px', fontWeight: '800', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                Discard
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr', gap: '30px' }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="premium-card" style={{ display: 'flex', flexDirection: viewMode === 'grid' ? 'column' : 'row', gap: '25px', padding: '20px', minHeight: '300px' }}>
                            <div className="skeleton" style={{ flex: viewMode === 'grid' ? '0 0 180px' : '0 0 220px', height: viewMode === 'grid' ? '180px' : 'auto', borderRadius: '16px' }}></div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div className="skeleton" style={{ width: '60%', height: '24px' }}></div>
                                <div className="skeleton" style={{ width: '90%', height: '40px', borderRadius: '10px' }}></div>
                                <div className="skeleton" style={{ width: '100%', height: '44px', marginTop: 'auto', borderRadius: '12px' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr', gap: '30px' }}>
                    {resources.filter(res => {
                        const matchesType = typeFilter === '' || res.type === typeFilter;
                        const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            res.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            res.type.toLowerCase().includes(searchQuery.toLowerCase());
                        return matchesType && matchesSearch;
                    }).map(res => (
                        <div key={res.id} className="premium-card" style={{
                            display: 'flex', flexDirection: viewMode === 'grid' ? 'column' : 'row',
                            gap: '20px', padding: '18px', alignItems: 'stretch', overflow: 'hidden', position: 'relative'
                        }}>
                            {res.image ? (
                                <div style={{ flex: viewMode === 'grid' ? '0 0 200px' : '0 0 240px', height: viewMode === 'grid' ? '200px' : 'auto', overflow: 'hidden', borderRadius: '16px', position: 'relative' }}>
                                    <img src={`data:${res.imageContentType};base64,${res.image}`} alt={res.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="zoom-hover" />
                                </div>
                            ) : (
                                <div style={{ flex: viewMode === 'grid' ? '0 0 200px' : '0 0 240px', height: viewMode === 'grid' ? '200px' : '200px', background: 'var(--border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                    <Building2 size={40} opacity={0.3} />
                                </div>
                            )}

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <h3 style={{ margin: '0', color: 'var(--text-main)', fontSize: '20px', letterSpacing: '-0.5px' }}>{res.name}</h3>
                                        <span style={{
                                            backgroundColor: res.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : res.status === 'INACTIVE' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: res.status === 'ACTIVE' ? '#10b981' : res.status === 'INACTIVE' ? '#94a3b8' : '#ef4444',
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'
                                        }}>
                                            {res.status === 'ACTIVE' ? 'AVAILABLE' : res.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: '20px' }}>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin size={14} opacity={0.6} /> {res.location}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Users size={14} opacity={0.6} /> {res.capacity} pax
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={14} opacity={0.6} /> {res.startTime || '08:00'} - {res.endTime || '18:00'}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Settings size={14} opacity={0.6} /> {res.type.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', paddingTop: '15px' }}>
                                    {user?.role === 'ROLE_USER' && res.status === 'ACTIVE' && (
                                        <>
                                            <button onClick={() => window.location.href = `/book/${res.id}`} style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <CalendarPlus size={16} /> Book Now
                                            </button>
                                            <button onClick={() => window.location.href = `/report/${res.id}`} style={{ padding: '12px 18px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px' }}>
                                                <AlertTriangle size={16} />
                                            </button>
                                        </>
                                    )}

                                    {user?.role === 'ROLE_ADMIN' && (
                                        <>
                                            <button onClick={() => handleEditClick(res)} style={{ flex: 1, padding: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <Pencil size={16} /> Edit
                                            </button>
                                            <button onClick={() => handleDeleteClick(res.id)} style={{ padding: '12px 18px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Catalogue;
