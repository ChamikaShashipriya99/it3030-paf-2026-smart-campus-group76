import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

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
            
            <button 
                onClick={logout}
                style={{
                    padding: '10px 20px', marginTop: '30px', cursor: 'pointer',
                    backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px'
                }}
            >
                Logout securely
            </button>
        </div>
    );
};

export default Dashboard;
