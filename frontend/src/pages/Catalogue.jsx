import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, LayoutGrid, List, Plus, Pencil, Trash2, Clock,
    MapPin, Users, AlertTriangle, CheckCircle2, Building2, Settings,
    CalendarPlus, AlertCircle, Landmark, Tag, ShieldCheck, Image,
    Rocket, Download, Camera, Laptop, Hash, Package, Layers,
    CalendarDays, ToggleLeft, ToggleRight, BookOpen, FlaskConical,
    DoorOpen, LibraryBig, Monitor, Mic, Speaker, Wind, Projector,
    Cpu, Send, XCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ---------- helpers ---------- */
const InputField = ({ label, required, icon: Icon, error, touched, children }) => (
    <div>
        <label className="form-label-navy">
            {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <div style={{ position: 'relative' }}>
            {Icon && (
                <Icon size={18} style={{
                    position: 'absolute', left: '16px', top: '50%',
                    transform: 'translateY(-50%)', color: '#3b82f6',
                    pointerEvents: 'none', zIndex: 1
                }} />
            )}
            {children}
        </div>
        {error && touched && (
            <span style={{ color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontWeight: '600' }}>
                <AlertCircle size={14} /> {error}
            </span>
        )}
    </div>
);

const ASSET_MODE = { FACILITY: 'FACILITY', EQUIPMENT: 'EQUIPMENT' };

/* ========== Component ========== */
const Catalogue = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // list state
    const [resources, setResources] = useState([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [minCapacity, setMinCapacity] = useState(''); // New: Capacity filter state
    const [toast, setToast] = useState(null);

    // form toggle
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // WHICH type of form to show
    const [assetMode, setAssetMode] = useState(null); // null = not selected yet

    // facility form state
    const [facRes, setFacRes] = useState({
        name: '', type: 'LECTURE_HALL', capacity: 0,
        location: '', status: 'ACTIVE', startTime: '08:00', endTime: '18:00'
    });
    const [facImage, setFacImage] = useState(null);
    const [facErrors, setFacErrors] = useState({});
    const [facTouched, setFacTouched] = useState({});

    // equipment form state
    const [eqRes, setEqRes] = useState({
        name: '', category: 'PROJECTOR', brand: '', serialNumber: '',
        quantity: 1, location: '', status: 'ACTIVE',
        portable: true, purchaseDate: ''
    });
    const [eqImage, setEqImage] = useState(null);
    const [eqErrors, setEqErrors] = useState({});
    const [eqTouched, setEqTouched] = useState({});

    // ── Equipment Request status badges ──────────────────────────────────────
    const [myEquipmentRequests, setMyEquipmentRequests] = useState([]);

    // ── Equipment Request Modal State ─────────────────────────────────────────
    const [requestModalResource, setRequestModalResource] = useState(null);
    const [reqForm, setReqForm] = useState({ startDate: '', startTime: '', endDate: '', endTime: '', purpose: '' });
    const [reqSubmitting, setReqSubmitting] = useState(false);
    const [reqError, setReqError] = useState('');

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    /* ---- fetch resources ---- */
    const fetchResources = async () => {
        try {
            setLoading(true);
            // "EQUIPMENT" is an assetCategory discriminator, not a specific 'type' value.
            // Fetch all resources when Equipment is selected to allow client-side category filtering.
            const endpoint = (typeFilter && typeFilter !== 'EQUIPMENT') ? `/resources?type=${typeFilter}` : '/resources';
            const response = await api.get(endpoint);
            setTimeout(() => { setResources(response.data); setLoading(false); }, 800);
        } catch (error) {
            console.error('Failed to fetch resources', error);
            setLoading(false);
        }
    };
    useEffect(() => { fetchResources(); }, [typeFilter]);

    /* ---- fetch user's existing equipment requests (for status badges) ---- */
    const fetchMyEquipmentRequests = async () => {
        if (!user || user.role !== 'ROLE_USER') return;
        try {
            const res = await api.get(`/equipment-requests/my?userId=${user.id}`);
            setMyEquipmentRequests(res.data);
        } catch {
            // non-critical — silently ignore
        }
    };
    useEffect(() => { fetchMyEquipmentRequests(); }, [user]);

    /**
     * Returns the most relevant request a user has for a given resourceId.
     * Prefers non-rejected requests; returns the newest one first.
     */
    const getMyRequestForResource = (resourceId) => {
        if (!myEquipmentRequests || myEquipmentRequests.length === 0) return null;
        const matching = myEquipmentRequests
            .filter(r => r.resourceId === resourceId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return matching.length > 0 ? matching[0] : null;
    };

    const handleOpenRequestModal = (res) => {
        setRequestModalResource(res);
        setReqForm({ startDate: '', startTime: '', endDate: '', endTime: '', purpose: '' });
        setReqError('');
    };

    const handleCloseRequestModal = () => {
        setRequestModalResource(null);
    };

    const submitEquipmentRequest = async (e) => {
        e.preventDefault();
        setReqError('');
        if (!user) return;

        const startStr = `${reqForm.startDate}T${reqForm.startTime}`;
        const endStr = `${reqForm.endDate}T${reqForm.endTime}`;
        const start = new Date(startStr);
        const end = new Date(endStr);

        if (end <= start) return setReqError('End time must be after start time.');
        // Allow a 6-hour grace period for "past" requests to avoid frustration.
        // This ensures users can request equipment for "this morning" even if it's already mid-day.
        const now = new Date();
        now.setHours(now.getHours() - 6);
        if (start < now) return setReqError('Cannot request in the past.');
        if (!reqForm.purpose.trim()) return setReqError('Purpose is required.');

        setReqSubmitting(true);
        try {
            await api.post('/equipment-requests', {
                userId: user.id,
                resourceId: requestModalResource.id,
                requestDate: reqForm.startDate,
                startTime: startStr,
                endTime: endStr,
                purpose: reqForm.purpose
            });
            showToast('Equipment request submitted successfully!', 'success');
            fetchMyEquipmentRequests(); 
            handleCloseRequestModal();
        } catch (error) {
            setReqError(error.response?.data?.message || 'Failed to submit request.');
        } finally {
            setReqSubmitting(false);
        }
    };

    /* ---- Facility validation ---- */
    const validateFac = (field, value, all = facRes) => {
        switch (field) {
            case 'name': return (!value || value.trim().length < 3) ? 'Asset Name must be at least 3 characters.' : '';
            case 'location': return (!value || value.trim().length === 0) ? 'Location / Zone is required.' : '';
            case 'capacity': return (!value || value <= 0) ? 'Capacity must be greater than 0.' : '';
            case 'startTime': return (!value) ? 'Opening Hours are required.' : '';
            case 'endTime':
                if (!value) return 'Closing Hours are required.';
                if (all.startTime && value && all.startTime >= value) return 'Closing must be after opening.';
                return '';
            default: return '';
        }
    };

    const handleFacChange = (field, value) => {
        const updated = { ...facRes, [field]: value };
        setFacRes(updated);
        if (facTouched[field]) setFacErrors(p => ({ ...p, [field]: validateFac(field, value, updated) }));
    };
    const handleFacBlur = (field) => {
        setFacTouched(p => ({ ...p, [field]: true }));
        setFacErrors(p => ({ ...p, [field]: validateFac(field, facRes[field]) }));
    };

    /* ---- Equipment validation ---- */
    const validateEq = (field, value) => {
        switch (field) {
            case 'name': 
                if (!value || value.trim().length === 0) return 'Equipment name is required';
                if (value.trim().length < 3) return 'Enter at least 3 characters';
                return '';
            case 'category':
                return (!value || value === '') ? 'Equipment category is required' : '';
            case 'brand':
                if (!value || value.trim().length === 0) return 'Brand / Model is required';
                if (value.trim().length < 2) return 'Enter at least 2 characters';
                return '';
            case 'serialNumber':
                if (!value || value.trim().length === 0) return 'Serial number is required';
                if (!/^[a-zA-Z0-9-_\s]+$/.test(value)) return 'Invalid characters in serial number';
                return '';
            case 'quantity': {
                if (value === undefined || value === null || value === '') return 'Quantity is required';
                const q = Number(value);
                if (isNaN(q) || q < 1) return 'Quantity must be at least 1';
                if (!Number.isInteger(q)) return 'Quantity must be a whole number';
                return '';
            }
            case 'location':
                return (!value || value.trim().length === 0) ? 'Assigned location is required' : '';
            case 'status':
                return (!value || value === '') ? 'Condition / Status is required' : '';
            case 'portable':
                return (value === null || value === undefined) ? 'Please select mobility type' : '';
            case 'purchaseDate':
                if (value) {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate > today) return 'Purchase date cannot be in the future';
                }
                return '';
            case 'image':
                if (value) {
                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                    if (!allowedTypes.includes(value.type)) return 'Please upload a JPG, PNG, or WEBP image';
                    if (value.size > 5 * 1024 * 1024) return 'Image size must be less than 5 MB';
                }
                return '';
            default: return '';
        }
    };
    const handleEqChange = (field, value) => {
        const updated = { ...eqRes, [field]: value };
        setEqRes(updated);
        // Clear error as user types/changes
        if (eqTouched[field]) {
            setEqErrors(p => ({ ...p, [field]: validateEq(field, value) }));
        }
    };

    const handleEqBlur = (field) => {
        setEqTouched(p => ({ ...p, [field]: true }));
        setEqErrors(p => ({ ...p, [field]: validateEq(field, eqRes[field]) }));
    };

    const handleEqImageChange = (file) => {
        setEqImage(file);
        setEqTouched(p => ({ ...p, image: true }));
        setEqErrors(p => ({ ...p, image: validateEq('image', file) }));
    };

    /* ---- Submit facility ---- */
    const handleFacSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {
            name:      validateFac('name',      facRes.name),
            location:  validateFac('location',  facRes.location),
            capacity:  validateFac('capacity',  facRes.capacity),
            startTime: validateFac('startTime', facRes.startTime),
            endTime:   validateFac('endTime',   facRes.endTime)
        };
        setFacErrors(newErrors);
        setFacTouched({ name: true, location: true, capacity: true, startTime: true, endTime: true });
        if (Object.values(newErrors).some(err => err !== '')) {
            showToast('Please correct the highlighted errors.', 'error');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('assetCategory', 'FACILITY');       // discriminator
            formData.append('name',          facRes.name);
            formData.append('type',          facRes.type);      // sub-classification
            formData.append('capacity',      facRes.capacity);
            formData.append('location',      facRes.location);
            formData.append('status',        facRes.status);
            formData.append('startTime',     facRes.startTime);
            formData.append('endTime',       facRes.endTime);
            if (facImage) formData.append('image', facImage);

            if (isEditing) {
                await api.put(`/resources/${editId}`, formData);
            } else {
                await api.post('/resources', formData);
            }
            closeForm();
            showToast(isEditing ? 'Facility updated successfully!' : 'Facility registered successfully!');
            fetchResources();
        } catch (err) {
            console.error('Facility save error:', err.response?.data);
            const msg = err?.response?.data?.message || err?.response?.data || 'Failed to save facility.';
            showToast(String(msg), 'error');
        }
    };

    /* ---- Submit equipment ---- */
    const handleEqSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {
            name:         validateEq('name',         eqRes.name),
            category:     validateEq('category',     eqRes.category),
            brand:        validateEq('brand',        eqRes.brand),
            serialNumber: validateEq('serialNumber', eqRes.serialNumber),
            quantity:     validateEq('quantity',     eqRes.quantity),
            location:     validateEq('location',     eqRes.location),
            status:       validateEq('status',       eqRes.status),
            portable:     validateEq('portable',     eqRes.portable),
            purchaseDate: validateEq('purchaseDate', eqRes.purchaseDate),
            image:        validateEq('image',        eqImage)
        };
        setEqErrors(newErrors);
        setEqTouched({ 
            name: true, category: true, brand: true, serialNumber: true, 
            quantity: true, location: true, status: true, 
            portable: true, purchaseDate: true, image: true 
        });

        if (Object.values(newErrors).some(err => err !== '')) {
            showToast('Please correct the highlighted errors.', 'error');
            // Scroll to first invalid field
            const firstErrorField = Object.keys(newErrors).find(key => newErrors[key] !== '');
            if (firstErrorField) {
                const element = document.getElementsByName(firstErrorField)[0] || document.getElementById(firstErrorField);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.focus();
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
            return;
        }
        try {
            const formData = new FormData();
            formData.append('assetCategory', 'EQUIPMENT');      // discriminator
            formData.append('name',          eqRes.name);
            formData.append('type',          eqRes.category);  // sub-classification stored in `type`
            formData.append('brand',         eqRes.brand);
            formData.append('serialNumber',  eqRes.serialNumber);
            formData.append('quantity',      eqRes.quantity);
            formData.append('location',      eqRes.location);
            formData.append('status',        eqRes.status);
            formData.append('portable',      eqRes.portable);
            if (eqRes.purchaseDate) formData.append('purchaseDate', eqRes.purchaseDate);
            if (eqImage) formData.append('image', eqImage);

            if (isEditing) {
                await api.put(`/resources/${editId}`, formData);
            } else {
                await api.post('/resources', formData);
            }
            closeForm();
            showToast(isEditing ? 'Equipment updated successfully!' : 'Equipment registered successfully!');
            fetchResources();
        } catch (err) {
            console.error('Equipment save error:', err.response?.data);
            const msg = err?.response?.data?.message || err?.response?.data || 'Failed to save equipment.';
            showToast(String(msg), 'error');
        }
    };

    const closeForm = () => {
        setShowAddForm(false);
        setIsEditing(false);
        setEditId(null);
        setAssetMode(null);
        setFacRes({ name: '', type: 'LECTURE_HALL', capacity: 0, location: '', status: 'ACTIVE', startTime: '08:00', endTime: '18:00' });
        setFacImage(null); setFacErrors({}); setFacTouched({});
        setEqRes({ name: '', category: 'PROJECTOR', brand: '', serialNumber: '', quantity: 1, location: '', status: 'ACTIVE', portable: true, purchaseDate: '' });
        setEqImage(null); setEqErrors({}); setEqTouched({});
    };

    const handleEditClick = (res) => {
        setIsEditing(true);
        setEditId(res.id);
        setShowAddForm(true);

        if (res.assetCategory === 'EQUIPMENT') {
            // Load equipment form
            setAssetMode(ASSET_MODE.EQUIPMENT);
            setEqRes({
                name:         res.name,
                category:     res.type   || 'PROJECTOR',
                brand:        res.brand   || '',
                serialNumber: res.serialNumber || '',
                quantity:     res.quantity || 1,
                location:     res.location,
                status:       res.status,
                portable:     res.portable !== false,  // default true if null
                purchaseDate: res.purchaseDate || ''
            });
            setEqErrors({}); setEqTouched({});
        } else {
            // Load facility form (handles both old docs without assetCategory and new FACILITY docs)
            setAssetMode(ASSET_MODE.FACILITY);
            setFacRes({
                name:      res.name,
                type:      res.type,
                capacity:  res.capacity || 0,
                location:  res.location,
                status:    res.status,
                startTime: res.startTime || '08:00',
                endTime:   res.endTime   || '18:00'
            });
            setFacErrors({}); setFacTouched({});
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try { await api.delete(`/resources/${id}`); fetchResources(); }
            catch { alert('Failed to delete resource'); }
        }
    };

    /* ---- PDF ---- */
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22); doc.setTextColor(15, 23, 42);
        doc.text('University Facilities & Assets Report', 14, 22);
        doc.setFontSize(11); doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);

        const tableColumn = ['Asset Name', 'Category', 'Type / Classification', 'Location', 'Details', 'Status'];
        const tableRows = resources.map(res => {
            const isFacility = res.assetCategory !== 'EQUIPMENT';
            return [
                res.name,
                isFacility ? 'Facility' : 'Equipment',
                (res.type || '').replace(/_/g, ' '),
                res.location,
                isFacility
                    ? `Cap: ${res.capacity ?? '-'} | ${res.startTime ?? '?'} – ${res.endTime ?? '?'}`
                    : `Brand: ${res.brand || '-'} | Qty: ${res.quantity ?? '-'}`,
                res.status
            ];
        });
        autoTable(doc, {
            head: [tableColumn], body: tableRows, startY: 42, theme: 'grid',
            headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
            bodyStyles: { textColor: [50, 50, 50] },
            alternateRowStyles: { fillColor: [240, 249, 255] },
            styles: { font: 'helvetica', fontSize: 10, cellPadding: 6 },
        });
        doc.save('Facilities_Assets_Report.pdf');
        showToast('PDF report generated successfully!');
    };

    /* ========== render ========== */
    return (
        <div className="container" style={{ padding: '60px 0', position: 'relative' }}>

            {/* Toast */}
            {toast && (
                <div className="toast-notification" style={{
                    position: 'fixed', bottom: '40px', right: '40px', zIndex: 9999,
                    background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
                    backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', padding: '16px 24px', borderRadius: '16px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', fontWeight: '600', fontSize: '15px'
                }}>
                    {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h2 className="page-title">Facilities & Assets</h2>
                    <p className="page-subtitle">Premium university resources available for booking and research.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={handleDownloadPDF} style={{
                        padding: '12px 24px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)',
                        border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: '14px', cursor: 'pointer',
                        fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                    }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                        <Download size={18} /> Download PDF
                    </button>
                    {user?.role === 'ROLE_ADMIN' && (
                        <button onClick={() => {
                            if (showAddForm) { closeForm(); }
                            else { setShowAddForm(true); setAssetMode(null); }
                        }} style={{
                            padding: '12px 24px', background: 'var(--primary)', color: 'white',
                            border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800',
                            fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 8px 20px rgba(59,130,246,0.3)', transition: 'all 0.2s'
                        }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            {showAddForm ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                            {showAddForm ? 'Close Editor' : 'Register New Asset'}
                        </button>
                    )}
                </div>
            </div>

            {/* ===== REGISTRATION FORM ===== */}
            {showAddForm && (
                <div className="premium-glass-panel form-enter-active" style={{ marginBottom: '50px', padding: '50px' }}>
                    <div className="form-content-relative">

                        {/* Form Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: '#f0f9ff', padding: '14px', borderRadius: '16px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Landmark size={28} color="#2563eb" />
                                </div>
                                <div>
                                    <h3 className="navy-text" style={{ margin: 0, fontSize: '26px', letterSpacing: '-1px' }}>
                                        {isEditing ? 'Modify Asset Details' : 'Register New University Asset'}
                                    </h3>
                                    <p className="navy-text-muted" style={{ margin: '6px 0 0', fontSize: '15px' }}>
                                        Fill out the specification details for campus-wide availability.
                                    </p>
                                </div>
                            </div>
                            <button type="button" onClick={closeForm} style={{
                                background: 'rgba(255,255,255,0.5)', border: '1px solid #e2e8f0',
                                width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer',
                                color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                            }}
                                onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
                                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.transform = 'rotate(0deg)'; }}>
                                <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>

                        {/* ===== ASSET TYPE SELECTOR ===== */}
                        {!isEditing && (
                            <div className="animate-pop-in" style={{ marginBottom: '40px' }}>
                                <p className="form-label-navy" style={{ marginBottom: '16px', fontSize: '14px' }}>
                                    Select Asset Category <span style={{ color: '#ef4444' }}>*</span>
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    {/* Facility Card */}
                                    <button type="button" onClick={() => setAssetMode(ASSET_MODE.FACILITY)} style={{
                                        padding: '28px 24px', borderRadius: '20px', cursor: 'pointer',
                                        border: assetMode === ASSET_MODE.FACILITY ? '2px solid #3b82f6' : '1.5px solid #e2e8f0',
                                        background: assetMode === ASSET_MODE.FACILITY ? 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)' : '#fafafa',
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                                        boxShadow: assetMode === ASSET_MODE.FACILITY ? '0 8px 25px -5px rgba(59,130,246,0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
                                        transform: assetMode === ASSET_MODE.FACILITY ? 'translateY(-2px)' : 'none',
                                        textAlign: 'left'
                                    }}>
                                        <div style={{
                                            background: assetMode === ASSET_MODE.FACILITY ? 'linear-gradient(135deg,#2563eb,#3b82f6)' : '#e0f2fe',
                                            padding: '16px', borderRadius: '16px', flexShrink: 0,
                                            boxShadow: assetMode === ASSET_MODE.FACILITY ? '0 8px 20px rgba(37,99,235,0.35)' : 'none',
                                            transition: 'all 0.3s'
                                        }}>
                                            <Building2 size={32} color={assetMode === ASSET_MODE.FACILITY ? '#fff' : '#3b82f6'} />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: assetMode === ASSET_MODE.FACILITY ? '#1e3a8a' : '#1e293b' }}>
                                                Facility Asset
                                            </p>
                                            <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                                                Lecture halls, labs, meeting rooms, study areas
                                            </p>
                                        </div>
                                        {assetMode === ASSET_MODE.FACILITY && (
                                            <CheckCircle2 size={22} color="#2563eb" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                                        )}
                                    </button>

                                    {/* Equipment Card */}
                                    <button type="button" onClick={() => setAssetMode(ASSET_MODE.EQUIPMENT)} style={{
                                        padding: '28px 24px', borderRadius: '20px', cursor: 'pointer',
                                        border: assetMode === ASSET_MODE.EQUIPMENT ? '2px solid #8b5cf6' : '1.5px solid #e2e8f0',
                                        background: assetMode === ASSET_MODE.EQUIPMENT ? 'linear-gradient(135deg,#f5f3ff 0%, #faf5ff 100%)' : '#fafafa',
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                                        boxShadow: assetMode === ASSET_MODE.EQUIPMENT ? '0 8px 25px -5px rgba(139,92,246,0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
                                        transform: assetMode === ASSET_MODE.EQUIPMENT ? 'translateY(-2px)' : 'none',
                                        textAlign: 'left'
                                    }}>
                                        <div style={{
                                            background: assetMode === ASSET_MODE.EQUIPMENT ? 'linear-gradient(135deg,#7c3aed,#8b5cf6)' : '#ede9fe',
                                            padding: '16px', borderRadius: '16px', flexShrink: 0,
                                            boxShadow: assetMode === ASSET_MODE.EQUIPMENT ? '0 8px 20px rgba(124,58,237,0.35)' : 'none',
                                            transition: 'all 0.3s'
                                        }}>
                                            <Cpu size={32} color={assetMode === ASSET_MODE.EQUIPMENT ? '#fff' : '#7c3aed'} />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: assetMode === ASSET_MODE.EQUIPMENT ? '#4c1d95' : '#1e293b' }}>
                                                Special Equipment
                                            </p>
                                            <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                                                Camera, projector, AC, microphone, laptop, speaker
                                            </p>
                                        </div>
                                        {assetMode === ASSET_MODE.EQUIPMENT && (
                                            <CheckCircle2 size={22} color="#7c3aed" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        {assetMode && (
                            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)', margin: '0 0 36px' }} />
                        )}

                        {/* ===== FACILITY FORM ===== */}
                        {assetMode === ASSET_MODE.FACILITY && (
                            <form onSubmit={handleFacSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                                {/* Section label */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '10px' }}>
                                        <Building2 size={18} color="#2563eb" />
                                    </div>
                                    <p style={{ margin: 0, fontWeight: '800', color: '#1e40af', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Facility Information
                                    </p>
                                </div>

                                {/* Row 1: Name + Classification */}
                                <div className="animate-pop-in delay-100" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                                    <InputField label="Official Asset Name" required icon={Tag} error={facErrors.name} touched={facTouched.name}>
                                        <input placeholder="e.g. Quantum Computing Lab – Sector 7" value={facRes.name}
                                            className={`baby-blue-input with-icon ${facErrors.name && facTouched.name ? 'input-error' : ''}`}
                                            onChange={e => handleFacChange('name', e.target.value)}
                                            onBlur={() => handleFacBlur('name')} />
                                    </InputField>
                                    <InputField label="Classification" required icon={BookOpen}>
                                        <select value={facRes.type} className="baby-blue-input with-icon"
                                            onChange={e => handleFacChange('type', e.target.value)} style={{ appearance: 'none' }}>
                                            <option value="LECTURE_HALL">Lecture Hall</option>
                                            <option value="LAB">Laboratory</option>
                                            <option value="MEETING_ROOM">Meeting Room</option>
                                            <option value="EQUIPMENT">Study Area</option>
                                        </select>
                                    </InputField>
                                </div>

                                {/* Row 2: Location, Capacity, Status */}
                                <div className="form-grid animate-pop-in delay-200">
                                    <InputField label="Location / Zone" required icon={MapPin} error={facErrors.location} touched={facTouched.location}>
                                        <input placeholder="e.g. Engineering Block B, Level 4" value={facRes.location}
                                            className={`baby-blue-input with-icon ${facErrors.location && facTouched.location ? 'input-error' : ''}`}
                                            onChange={e => handleFacChange('location', e.target.value)}
                                            onBlur={() => handleFacBlur('location')} />
                                    </InputField>
                                    <InputField label="Occupancy Capacity" required icon={Users} error={facErrors.capacity} touched={facTouched.capacity}>
                                        <input type="number" min="1" placeholder="Enter capacity"
                                            value={facRes.capacity === 0 ? '' : facRes.capacity}
                                            className={`baby-blue-input with-icon ${facErrors.capacity && facTouched.capacity ? 'input-error' : ''}`}
                                            onChange={e => handleFacChange('capacity', e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                                            onBlur={() => handleFacBlur('capacity')} />
                                    </InputField>
                                    <InputField label="System Status" required icon={ShieldCheck}>
                                        <select value={facRes.status} className="baby-blue-input with-icon"
                                            onChange={e => handleFacChange('status', e.target.value)} style={{ appearance: 'none' }}>
                                            <option value="ACTIVE">OPERATIONAL</option>
                                            <option value="MAINTENANCE">UNDER MAINTENANCE</option>
                                            <option value="INACTIVE">DECOMMISSIONED</option>
                                        </select>
                                    </InputField>
                                </div>

                                {/* Row 3: Hours + Image */}
                                <div className="form-grid form-section-bg animate-pop-in delay-300">
                                    <InputField label="Opening Hours" required icon={Clock} error={facErrors.startTime} touched={facTouched.startTime}>
                                        <input type="time" value={facRes.startTime}
                                            className={`baby-blue-input with-icon ${facErrors.startTime && facTouched.startTime ? 'input-error' : ''}`}
                                            onChange={e => handleFacChange('startTime', e.target.value)}
                                            onBlur={() => handleFacBlur('startTime')} />
                                    </InputField>
                                    <InputField label="Closing Hours" required icon={Clock} error={facErrors.endTime} touched={facTouched.endTime}>
                                        <input type="time" value={facRes.endTime}
                                            className={`baby-blue-input with-icon ${facErrors.endTime && facTouched.endTime ? 'input-error' : ''}`}
                                            onChange={e => handleFacChange('endTime', e.target.value)}
                                            onBlur={() => handleFacBlur('endTime')} />
                                    </InputField>
                                    <div>
                                        <label className="form-label-navy">Digital Cover Image</label>
                                        <div style={{ position: 'relative' }}>
                                            <Image size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#3b82f6', pointerEvents: 'none', zIndex: 1 }} />
                                            <input type="file" accept="image/*" onChange={e => setFacImage(e.target.files[0])}
                                                className="baby-blue-input with-icon" style={{ padding: '13px 13px 13px 48px', background: 'white' }} />
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>JPG, PNG or WEBP (Max 5MB)</p>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="animate-pop-in delay-400" style={{ display: 'flex', gap: '16px' }}>
                                    <button type="submit" className="btn-primary-glow" style={{ flex: 2, padding: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                        <Rocket size={20} /> {isEditing ? 'Commit Structural Changes' : 'Register Facility Asset'}
                                    </button>
                                    <button type="button" className="btn-secondary-soft" onClick={closeForm}
                                        style={{ flex: 1, padding: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                        <Trash2 size={20} /> Discard
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ===== EQUIPMENT FORM ===== */}
                        {assetMode === ASSET_MODE.EQUIPMENT && (
                            <form onSubmit={handleEqSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                                {/* Section label */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ background: '#f5f3ff', padding: '8px', borderRadius: '10px' }}>
                                        <Cpu size={18} color="#7c3aed" />
                                    </div>
                                    <p style={{ margin: 0, fontWeight: '800', color: '#6d28d9', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Equipment Information
                                    </p>
                                </div>

                                {/* Row 1: Name + Category */}
                                <div className="animate-pop-in delay-100" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                                    <InputField label="Equipment Name" required icon={Tag} error={eqErrors.name} touched={eqTouched.name}>
                                        <input name="name" id="name" placeholder="e.g. Canon EOS R5 Camera" value={eqRes.name}
                                            className={`baby-blue-input with-icon ${eqErrors.name && eqTouched.name ? 'input-error' : ''}`}
                                            onChange={e => handleEqChange('name', e.target.value)}
                                            onBlur={() => handleEqBlur('name')} />
                                    </InputField>
                                    <InputField label="Equipment Category" required icon={Layers} error={eqErrors.category} touched={eqTouched.category}>
                                        <select name="category" id="category" value={eqRes.category} className={`baby-blue-input with-icon ${eqErrors.category && eqTouched.category ? 'input-error' : ''}`}
                                            onChange={e => handleEqChange('category', e.target.value)} 
                                            onBlur={() => handleEqBlur('category')}
                                            style={{ appearance: 'none' }}>
                                            <option value="PROJECTOR">Projector</option>
                                            <option value="CAMERA">Camera</option>
                                            <option value="AC">Air Conditioner</option>
                                            <option value="MICROPHONE">Microphone</option>
                                            <option value="SPEAKER">Speaker</option>
                                            <option value="LAPTOP">Laptop</option>
                                            <option value="SMART_BOARD">Smart Board</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </InputField>
                                </div>

                                {/* Row 2: Brand, Serial, Quantity */}
                                <div className="form-grid animate-pop-in delay-200">
                                    <InputField label="Brand / Model" required icon={Monitor} error={eqErrors.brand} touched={eqTouched.brand}>
                                        <input name="brand" id="brand" placeholder="e.g. Epson EB-X51" value={eqRes.brand}
                                            className={`baby-blue-input with-icon ${eqErrors.brand && eqTouched.brand ? 'input-error' : ''}`}
                                            onChange={e => handleEqChange('brand', e.target.value)}
                                            onBlur={() => handleEqBlur('brand')} />
                                    </InputField>
                                    <InputField label="Serial Number" required icon={Hash} error={eqErrors.serialNumber} touched={eqTouched.serialNumber}>
                                        <input name="serialNumber" id="serialNumber" placeholder="e.g. SN-2024-0091-AB" value={eqRes.serialNumber}
                                            className={`baby-blue-input with-icon ${eqErrors.serialNumber && eqTouched.serialNumber ? 'input-error' : ''}`}
                                            onChange={e => handleEqChange('serialNumber', e.target.value)}
                                            onBlur={() => handleEqBlur('serialNumber')} />
                                    </InputField>
                                    <InputField label="Quantity" required icon={Package} error={eqErrors.quantity} touched={eqTouched.quantity}>
                                        <input name="quantity" id="quantity" type="number" min="1" placeholder="e.g. 3" value={eqRes.quantity}
                                            className={`baby-blue-input with-icon ${eqErrors.quantity && eqTouched.quantity ? 'input-error' : ''}`}
                                            onChange={e => handleEqChange('quantity', e.target.value)}
                                            onBlur={() => handleEqBlur('quantity')} />
                                    </InputField>
                                </div>

                                {/* Row 3: Location, Status, Portable toggle, Purchase Date */}
                                <div className="form-grid form-section-bg animate-pop-in delay-300">
                                    <InputField label="Assigned Location" required icon={MapPin} error={eqErrors.location} touched={eqTouched.location}>
                                        <input name="location" id="location" placeholder="e.g. AV Room, Block A" value={eqRes.location}
                                            className={`baby-blue-input with-icon ${eqErrors.location && eqTouched.location ? 'input-error' : ''}`}
                                            onChange={e => handleEqChange('location', e.target.value)}
                                            onBlur={() => handleEqBlur('location')} />
                                    </InputField>
                                    <InputField label="Condition / Status" required icon={ShieldCheck} error={eqErrors.status} touched={eqTouched.status}>
                                        <select name="status" id="status" value={eqRes.status} className={`baby-blue-input with-icon ${eqErrors.status && eqTouched.status ? 'input-error' : ''}`}
                                            onChange={e => handleEqChange('status', e.target.value)} 
                                            onBlur={() => handleEqBlur('status')}
                                            style={{ appearance: 'none' }}>
                                            <option value="ACTIVE">OPERATIONAL</option>
                                            <option value="MAINTENANCE">UNDER REPAIR</option>
                                            <option value="INACTIVE">DECOMMISSIONED</option>
                                        </select>
                                    </InputField>
                                    <InputField label="Purchase Date" icon={CalendarDays} error={eqErrors.purchaseDate} touched={eqTouched.purchaseDate}>
                                        <input name="purchaseDate" id="purchaseDate" type="date" value={eqRes.purchaseDate}
                                            className={`baby-blue-input with-icon ${eqErrors.purchaseDate && eqTouched.purchaseDate ? 'input-error' : ''}`}
                                            onChange={e => handleEqChange('purchaseDate', e.target.value)}
                                            onBlur={() => handleEqBlur('purchaseDate')} />
                                    </InputField>
                                </div>

                                {/* Row 4: Portable toggle + Image */}
                                <div className="animate-pop-in delay-300" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
                                    {/* Portable Toggle */}
                                    <div id="portable" style={{ background: '#f8fafc', border: eqErrors.portable && eqTouched.portable ? '1px solid #ef4444' : '1px solid #e2e8f0', borderRadius: '20px', padding: '24px' }}>
                                        <label className="form-label-navy" style={{ marginBottom: '16px' }}>Mobility Type <span style={{ color: '#ef4444' }}>*</span></label>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button type="button"
                                                onClick={() => handleEqChange('portable', true)}
                                                style={{
                                                    flex: 1, padding: '12px 8px', borderRadius: '12px', cursor: 'pointer',
                                                    border: eqRes.portable === true ? '2px solid #10b981' : '1.5px solid #e2e8f0',
                                                    background: eqRes.portable === true ? 'linear-gradient(135deg,#ecfdf5,#f0fdf4)' : '#fff',
                                                    fontWeight: '700', fontSize: '13px',
                                                    color: eqRes.portable === true ? '#059669' : '#64748b',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                                    transition: 'all 0.2s'
                                                }}>
                                                <ToggleRight size={20} color={eqRes.portable === true ? '#059669' : '#94a3b8'} />
                                                Portable
                                            </button>
                                            <button type="button"
                                                onClick={() => handleEqChange('portable', false)}
                                                style={{
                                                    flex: 1, padding: '12px 8px', borderRadius: '12px', cursor: 'pointer',
                                                    border: eqRes.portable === false ? '2px solid #f59e0b' : '1.5px solid #e2e8f0',
                                                    background: eqRes.portable === false ? 'linear-gradient(135deg,#fffbeb,#fefce8)' : '#fff',
                                                    fontWeight: '700', fontSize: '13px',
                                                    color: eqRes.portable === false ? '#b45309' : '#64748b',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                                    transition: 'all 0.2s'
                                                }}>
                                                <ToggleLeft size={20} color={eqRes.portable === false ? '#f59e0b' : '#94a3b8'} />
                                                Fixed
                                            </button>
                                        </div>
                                        {eqErrors.portable && eqTouched.portable && (
                                            <span style={{ color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', fontWeight: '600' }}>
                                                <AlertCircle size={14} /> {eqErrors.portable}
                                            </span>
                                        )}
                                    </div>

                                    {/* Image upload */}
                                    <div id="image">
                                        <label className="form-label-navy">Digital Cover Image</label>
                                        <div style={{ position: 'relative' }}>
                                            <Image size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#3b82f6', pointerEvents: 'none', zIndex: 1 }} />
                                            <input type="file" accept="image/*" onChange={e => handleEqImageChange(e.target.files[0])}
                                                className={`baby-blue-input with-icon ${eqErrors.image && eqTouched.image ? 'input-error' : ''}`} 
                                                style={{ padding: '13px 13px 13px 48px', background: 'white' }} />
                                        </div>
                                        {eqErrors.image && eqTouched.image ? (
                                            <span style={{ color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontWeight: '600' }}>
                                                <AlertCircle size={14} /> {eqErrors.image}
                                            </span>
                                        ) : (
                                            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>JPG, PNG or WEBP (Max 5MB)</p>
                                        )}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="animate-pop-in delay-400" style={{ display: 'flex', gap: '16px' }}>
                                    <button type="submit" style={{
                                        flex: 2, padding: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                                        background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', color: 'white', border: 'none',
                                        borderRadius: '16px', cursor: 'pointer', fontSize: '16px', fontWeight: '800',
                                        boxShadow: '0 10px 20px -5px rgba(124,58,237,0.4)',
                                        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)'
                                    }}
                                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(124,58,237,0.5)'; }}
                                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(124,58,237,0.4)'; }}>
                                        <Rocket size={20} /> Register Equipment
                                    </button>
                                    <button type="button" className="btn-secondary-soft" onClick={closeForm}
                                        style={{ flex: 1, padding: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                        <Trash2 size={20} /> Discard
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Prompt if no mode selected yet */}
                        {!assetMode && !isEditing && (
                            <div style={{ textAlign: 'center', padding: '20px 0 10px', color: '#94a3b8', fontSize: '14px' }}>
                                ☝️ Select an asset category above to continue
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ===== EQUIPMENT REQUEST MODAL ===== */}
            {requestModalResource && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="animate-pop-in" style={{ background: 'var(--surface)', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid var(--border)', position: 'relative' }}>
                        <button type="button" onClick={handleCloseRequestModal} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', fontWeight: '900' }}>
                            <div style={{ padding: '6px 12px', background: 'var(--bg-main)', borderRadius: '12px' }}>✕</div>
                        </button>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7c3aed', fontWeight: '800', marginBottom: '8px' }}>
                            <Cpu size={20} /> Request Equipment
                        </div>
                        <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{requestModalResource.name}</h2>
                        <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted)' }}>Provide a schedule and logic for usage. Admin approval is strictly required before formalized booking.</p>

                        {reqError && (
                            <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '12px', fontSize: '13px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={16} /> {reqError}
                            </div>
                        )}

                        <form onSubmit={submitEquipmentRequest} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="form-label-navy" style={{ marginBottom: '8px', display: 'block' }}>Start Date</label>
                                    <input type="date" required value={reqForm.startDate} onChange={e => setReqForm({...reqForm, startDate: e.target.value})} className="premium-input" style={{ width: '100%', padding: '12px' }} />
                                </div>
                                <div>
                                    <label className="form-label-navy" style={{ marginBottom: '8px', display: 'block' }}>Start Time</label>
                                    <input type="time" required value={reqForm.startTime} onChange={e => setReqForm({...reqForm, startTime: e.target.value})} className="premium-input" style={{ width: '100%', padding: '12px' }} />
                                </div>
                                <div>
                                    <label className="form-label-navy" style={{ marginBottom: '8px', display: 'block' }}>End Date</label>
                                    <input type="date" required value={reqForm.endDate} onChange={e => setReqForm({...reqForm, endDate: e.target.value})} className="premium-input" style={{ width: '100%', padding: '12px' }} />
                                </div>
                                <div>
                                    <label className="form-label-navy" style={{ marginBottom: '8px', display: 'block' }}>End Time</label>
                                    <input type="time" required value={reqForm.endTime} onChange={e => setReqForm({...reqForm, endTime: e.target.value})} className="premium-input" style={{ width: '100%', padding: '12px' }} />
                                </div>
                            </div>
                            <div>
                                <label className="form-label-navy" style={{ marginBottom: '8px', display: 'block' }}>Purpose / Reason</label>
                                <textarea required value={reqForm.purpose} onChange={e => setReqForm({...reqForm, purpose: e.target.value})} className="premium-input" rows="3" placeholder="Describe why you definitively need this equipment..." style={{ width: '100%', padding: '12px', resize: 'vertical' }}></textarea>
                            </div>

                            <button type="submit" disabled={reqSubmitting} style={{ marginTop: '8px', padding: '16px', background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', color: 'white', border: 'none', borderRadius: '14px', cursor: reqSubmitting ? 'not-allowed' : 'pointer', fontWeight: '800', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: reqSubmitting ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 8px 16px rgba(124,58,237,0.3)' }} onMouseOver={e => !reqSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseOut={e => !reqSubmitting && (e.currentTarget.style.transform = 'translateY(0)')}>
                                {reqSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Request</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== FILTER BAR ===== */}
            <div style={{
                marginBottom: '40px', padding: '24px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '24px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', gap: '20px', flexWrap: 'wrap',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Find lecture halls, labs, equipment..."
                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="premium-input" style={{ padding: '12px 16px 12px 48px', width: '100%', fontSize: '15px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--border)', padding: '10px', borderRadius: '12px', color: 'var(--text-muted)' }}>
                            <Filter size={18} />
                        </div>
                        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                            className="premium-input" style={{ padding: '10px 16px', width: '200px', cursor: 'pointer' }}>
                            <option value="">All Categories</option>
                            <option value="LECTURE_HALL">Lecture Halls</option>
                            <option value="LAB">Laboratories</option>
                            <option value="MEETING_ROOM">Meeting Rooms</option>
                            <option value="EQUIPMENT">Equipment</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--border)', padding: '10px', borderRadius: '12px', color: 'var(--text-muted)' }}>
                            <Users size={18} />
                        </div>
                        <select value={minCapacity} onChange={e => setMinCapacity(e.target.value)}
                            className="premium-input" style={{ padding: '10px 16px', width: '180px', cursor: 'pointer' }}>
                            <option value="">All Capacities</option>
                            <option value="50">50+ Pax</option>
                            <option value="100">100+ Pax</option>
                            <option value="200">200+ Pax</option>
                            <option value="500">500+ Pax</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border)' }}>
                    {[{ mode: 'list', label: 'Horizontal', Icon: List }, { mode: 'grid', label: 'Gallery', Icon: LayoutGrid }].map(({ mode, label, Icon }) => (
                        <button key={mode} onClick={() => setViewMode(mode)} style={{
                            padding: '10px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                            background: viewMode === mode ? 'var(--primary)' : 'transparent',
                            color: viewMode === mode ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '13px'
                        }}>
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== RESOURCE GRID ===== */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr', gap: '30px' }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="premium-card" style={{ display: 'flex', flexDirection: viewMode === 'grid' ? 'column' : 'row', gap: '25px', padding: '20px', minHeight: '300px' }}>
                            <div className="skeleton" style={{ flex: viewMode === 'grid' ? '0 0 180px' : '0 0 220px', height: viewMode === 'grid' ? '180px' : 'auto', borderRadius: '16px' }} />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div className="skeleton" style={{ width: '60%', height: '24px' }} />
                                <div className="skeleton" style={{ width: '90%', height: '40px', borderRadius: '10px' }} />
                                <div className="skeleton" style={{ width: '100%', height: '44px', marginTop: 'auto', borderRadius: '12px' }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr', gap: '30px' }}>
                    {resources.filter(res => {
                        const matchesType = typeFilter === '' || res.type === typeFilter ||
                            (typeFilter === 'EQUIPMENT' && res.assetCategory === 'EQUIPMENT');
                        
                        // Capacity Filter: When active, hide Equipment and filter Facilities by capacity.
                        const matchesCapacity = !minCapacity 
                            ? true 
                            : (res.assetCategory === 'FACILITY' && res.capacity >= parseInt(minCapacity, 10));

                        const q = searchQuery.toLowerCase();
                        const matchesSearch = (res.name || '').toLowerCase().includes(q) ||
                            (res.location || '').toLowerCase().includes(q) ||
                            (res.type || '').toLowerCase().includes(q);
                        return matchesType && matchesCapacity && matchesSearch;
                    }).map(res => {
                        const isEquipment = res.assetCategory === 'EQUIPMENT';
                        return (
                            <div key={res.id} className="premium-card" style={{
                                display: 'flex', flexDirection: viewMode === 'grid' ? 'column' : 'row',
                                gap: '20px', padding: '18px', alignItems: 'stretch', overflow: 'hidden', position: 'relative'
                            }}>
                                {/* Thumbnail / placeholder */}
                                {res.image ? (
                                    <div style={{ flex: viewMode === 'grid' ? '0 0 200px' : '0 0 240px', height: viewMode === 'grid' ? '200px' : 'auto', overflow: 'hidden', borderRadius: '16px' }}>
                                        <img src={`data:${res.imageContentType};base64,${res.image}`} alt={res.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="zoom-hover" />
                                    </div>
                                ) : (
                                    <div style={{ flex: viewMode === 'grid' ? '0 0 200px' : '0 0 240px', height: viewMode === 'grid' ? '200px' : '200px', background: isEquipment ? '#f5f3ff' : 'var(--border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                        {isEquipment ? <Cpu size={40} opacity={0.35} color="#7c3aed" /> : <Building2 size={40} opacity={0.3} />}
                                    </div>
                                )}

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        {/* Name + category badge + status */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div>
                                                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: isEquipment ? '#7c3aed' : '#2563eb', background: isEquipment ? '#f5f3ff' : '#eff6ff', padding: '2px 8px', borderRadius: '6px' }}>
                                                    {isEquipment ? 'Equipment' : 'Facility'}
                                                </span>
                                                <h3 style={{ margin: '6px 0 0', color: 'var(--text-main)', fontSize: '18px', letterSpacing: '-0.5px' }}>{res.name}</h3>
                                            </div>
                                            <span style={{
                                                backgroundColor: res.status === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : res.status === 'INACTIVE' ? 'rgba(148,163,184,0.1)' : 'rgba(239,68,68,0.1)',
                                                color: res.status === 'ACTIVE' ? '#10b981' : res.status === 'INACTIVE' ? '#94a3b8' : '#ef4444',
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', whiteSpace: 'nowrap'
                                            }}>
                                                {res.status === 'ACTIVE' ? 'AVAILABLE' : (res.status || '').replace('_', ' ')}
                                            </span>
                                        </div>

                                        {/* Detail rows — smart per type */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: '16px', marginTop: '12px' }}>
                                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <MapPin size={14} opacity={0.6} /> {res.location}
                                            </div>

                                            {isEquipment ? (
                                                <>
                                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Package size={14} opacity={0.6} /> Qty: {res.quantity ?? '—'}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Monitor size={14} opacity={0.6} /> {res.brand || '—'}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        {res.portable !== false
                                                            ? <><ToggleRight size={14} color="#10b981" /> Portable</>
                                                            : <><ToggleLeft size={14} color="#f59e0b" /> Fixed</>}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Users size={14} opacity={0.6} /> {res.capacity ?? '—'} pax
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Clock size={14} opacity={0.6} /> {res.startTime || '08:00'} – {res.endTime || '18:00'}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Settings size={14} opacity={0.6} /> {(res.type || '').replace(/_/g, ' ')}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', gap: '12px', paddingTop: '12px' }}>
                                        {user?.role === 'ROLE_USER' && res.status === 'ACTIVE' && !isEquipment && (
                                            <>
                                                <button onClick={() => navigate(`/book/${res.id}`)}
                                                    style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                    <CalendarPlus size={16} /> Book Now
                                                </button>
                                                <button onClick={() => navigate(`/report/${res.id}`)}
                                                    style={{ padding: '12px 18px', background: 'rgba(239,68,68,0.05)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px' }}>
                                                    <AlertTriangle size={16} />
                                                </button>
                                            </>
                                        )}
                                        {/* Equipment: dynamic request state button */}
                                        {user?.role === 'ROLE_USER' && isEquipment && (() => {
                                            const myReq = getMyRequestForResource(res.id);
                                            if (!myReq) {
                                                // No request yet — show Request button
                                                return res.status === 'ACTIVE' ? (
                                                    <button
                                                        onClick={() => handleOpenRequestModal(res)}
                                                        style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(124,58,237,0.3)', transition: 'all 0.2s' }}
                                                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(124,58,237,0.4)'; }}
                                                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.3)'; }}
                                                    >
                                                        <Send size={15} /> Request
                                                    </button>
                                                ) : (
                                                    <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(148,163,184,0.1)', borderRadius: '12px', fontSize: '13px', color: '#94a3b8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <ShieldCheck size={15} /> {res.status}
                                                    </div>
                                                );
                                            }
                                            if (myReq.status === 'PENDING') {
                                                return (
                                                    <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', fontSize: '13px', color: '#f59e0b', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Clock size={15} /> Pending Approval
                                                    </div>
                                                );
                                            }
                                            if (myReq.status === 'APPROVED') {
                                                return (
                                                    <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', fontSize: '13px', color: '#10b981', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <CheckCircle2 size={15} /> Approved
                                                    </div>
                                                );
                                            }
                                            if (myReq.status === 'REJECTED') {
                                                return (
                                                    <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', fontSize: '13px', color: '#ef4444', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <XCircle size={15} /> Rejected
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                        {user?.role === 'ROLE_ADMIN' && (
                                            <>
                                                <button onClick={() => handleEditClick(res)}
                                                    style={{ flex: 1, padding: '12px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                    <Pencil size={16} /> Edit
                                                </button>
                                                <button onClick={() => handleDeleteClick(res.id)}
                                                    style={{ padding: '12px 18px', background: 'rgba(239,68,68,0.05)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Catalogue;


