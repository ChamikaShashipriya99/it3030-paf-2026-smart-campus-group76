import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

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
        </div>
    );
};

export default Dashboard;
