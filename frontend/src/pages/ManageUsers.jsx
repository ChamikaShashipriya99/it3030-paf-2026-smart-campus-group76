import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { NotificationContext } from '../context/NotificationContext';
import { useConfirm } from '../context/ConfirmContext';
import { 
    Users, 
    Shield, 
    User, 
    Wrench, 
    Check, 
    Search,
    RefreshCw,
    UserCircle,
    HardHat,
    Lock
} from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const { showNotification } = useContext(NotificationContext);
    const { ask } = useConfirm();

    const fetchUsers = () => {
        setLoading(true);
        api.get('/users').then(res => {
            setUsers(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
            showNotification('Access Denied: Admin authorization required.', 'error');
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateRole = async (userId, newRole) => {
        const roleLabel = newRole.replace('ROLE_', '');
        const confirmed = await ask(
            `You are about to reassign this member to the ${roleLabel} group. Do you wish to proceed with this authority change?`,
            "Confirm Role Elevation"
        );
        
        if (!confirmed) return;

        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            showNotification('Role updated successfully', 'success');
            fetchUsers();
        } catch (err) {
            showNotification('Failed to update role', 'error');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(filter.toLowerCase()) || 
        u.email.toLowerCase().includes(filter.toLowerCase())
    );

    const roleControls = [
        { id: 'ROLE_USER', label: 'Ordinary', icon: UserCircle, color: '#6b7280' },
        { id: 'ROLE_TECHNICIAN', label: 'Technician', icon: HardHat, color: '#10b981' },
        { id: 'ROLE_ADMIN', label: 'Administrator', icon: Lock, color: '#2563EB' }
    ];

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 className="page-title">Identity Registry</h2>
                    <p className="page-subtitle">Administrative control over campus-wide user authorizations and system roles.</p>
                </div>
                <button 
                    onClick={fetchUsers}
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '12px 24px', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', boxShadow: 'var(--shadow-soft)' }}>
                    <RefreshCw size={16} className={loading ? 'spin' : ''} /> Sync Data
                </button>
            </div>

            <div style={{ background: 'var(--surface)', borderRadius: '28px', boxShadow: 'var(--shadow-premium)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ padding: '24px 30px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ position: 'relative', width: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="text" 
                            placeholder="Find a member by name or university email..." 
                            className="premium-input" 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ padding: '14px 15px 14px 45px', fontSize: '14px', borderRadius: '16px' }} 
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '20px 30px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Member Profile</th>
                                <th style={{ padding: '20px 30px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Current Designation</th>
                                <th style={{ padding: '20px 30px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Access Delegation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}><td colSpan="3" style={{ padding: '30px' }}><div className="skeleton" style={{ height: '40px', borderRadius: '12px' }} /></td></tr>
                                ))
                            ) : filteredUsers.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '25px 30px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ position: 'relative' }}>
                                                <div style={{ width: '45px', height: '45px', borderRadius: '15px', background: 'linear-gradient(135deg, var(--border) 0%, rgba(255,255,255,0) 100%)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', border: '1px solid var(--border)' }}>{u.name.charAt(0)}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '15px' }}>{u.name}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500' }}>{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 30px' }}>
                                        <div style={{ 
                                            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px',
                                            background: u.role === 'ROLE_ADMIN' ? 'rgba(59, 130, 246, 0.1)' : u.role === 'ROLE_TECHNICIAN' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                            color: u.role === 'ROLE_ADMIN' ? '#2563EB' : u.role === 'ROLE_TECHNICIAN' ? '#10b981' : '#6b7280',
                                            border: `1px solid ${u.role === 'ROLE_ADMIN' ? 'rgba(59, 130, 246, 0.2)' : u.role === 'ROLE_TECHNICIAN' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)'}`
                                        }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                                            {u.role.replace('ROLE_', '')}
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 30px' }}>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            {roleControls.map(role => (
                                                <button 
                                                    key={role.id}
                                                    onClick={() => updateRole(u.id, role.id)}
                                                    style={{ 
                                                        border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '70px', padding: '10px', borderRadius: '14px', transition: 'all 0.2s',
                                                        opacity: u.role === role.id ? 1 : 0.4,
                                                        transform: u.role === role.id ? 'scale(1.05)' : 'scale(1)',
                                                        backgroundColor: u.role === role.id ? 'rgba(0,0,0,0.03)' : 'transparent'
                                                    }}
                                                    onMouseOver={e => e.currentTarget.style.opacity = '1'}
                                                    onMouseOut={e => { if(u.role !== role.id) e.currentTarget.style.opacity = '0.4' }}>
                                                    <div style={{ padding: '8px', borderRadius: '10px', background: u.role === role.id ? role.color : '#f3f4f6', color: u.role === role.id ? 'white' : '#9ca3af' }}>
                                                        <role.icon size={18} />
                                                    </div>
                                                    <span style={{ fontSize: '10px', fontWeight: '800', color: u.role === role.id ? 'var(--text-main)' : 'var(--text-muted)', textTransform: 'uppercase' }}>{role.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
