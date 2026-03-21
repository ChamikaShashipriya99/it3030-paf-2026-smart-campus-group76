import React from 'react';

const Login = () => {
    const handleGoogleLogin = () => {
        // Triggers the Google OAuth2 flow via Spring Boot
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <h1>Smart Campus Operations Hub</h1>
            <p style={{marginBottom: '30px'}}>Please log in to your dashboard.</p>
            <button 
                onClick={handleGoogleLogin}
                style={{
                    padding: '12px 24px', fontSize: '16px', cursor: 'pointer',
                    backgroundColor: '#4285F4', color: 'white', border: 'none', 
                    borderRadius: '8px', fontWeight: 'bold'
                }}
            >
                Sign in with Google
            </button>
        </div>
    );
};

export default Login;
