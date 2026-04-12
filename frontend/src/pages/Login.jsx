import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const handleGoogleLogin = () => {
        // Triggers the Google OAuth2 flow via Spring Boot
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 50%, #F9FAFB 0%, #F3F4F6 100%)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            fontFamily: '"League Spartan", sans-serif'
        }}>
            {/* Back Button Outside the Box */}
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'fixed',
                    top: '40px',
                    left: '40px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    color: '#4B5563',
                    padding: '12px 24px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '800',
                    transition: 'all 0.2s',
                    zIndex: 2100,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.transform = 'translateX(-5px)'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
                <ArrowLeft size={18} /> Back to Home
            </button>

            {/* Background Decorations */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(129, 140, 248, 0.05) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />

            <div style={{
                width: '100%',
                maxWidth: '460px',
                padding: '60px',
                background: '#FFFFFF',
                borderRadius: '40px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #F3F4F6',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
            }}>
                <img src="/SmartCampus.png" alt="SmartCampus Logo" style={{ height: '70px', width: 'auto', marginBottom: '40px' }} />

                <h1 style={{ fontSize: '36px', color: '#111827', margin: '0 0 15px 0', letterSpacing: '-2px', fontWeight: '900' }}>
                    Welcome Back
                </h1>
                <p style={{ color: '#4B5563', fontSize: '17px', margin: '0 0 45px 0', lineHeight: '1.6', fontWeight: '500' }}>
                    Access the unified operating hub for university facilities and resources.
                </p>

                <button
                    onClick={handleGoogleLogin}
                    style={{
                        width: '100%',
                        padding: '18px 24px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#FFFFFF',
                        color: '#111827',
                        border: '1px solid #E5E7EB',
                        borderRadius: '20px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '15px',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; e.currentTarget.style.borderColor = '#2563EB'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '22px', height: '22px' }} />
                    Sign in with Google
                </button>

                <div style={{ marginTop: '45px', borderTop: '1px solid #F3F4F6', paddingTop: '30px' }}>
                    <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Internal Access Only &bull; SLIIT
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
