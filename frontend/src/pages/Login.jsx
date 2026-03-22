import React from 'react';

const Login = () => {
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
            background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            fontFamily: '"Inter", sans-serif'
        }}>
            {/* Background Decorations */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />

            <div style={{ 
                width: '100%', 
                maxWidth: '440px', 
                padding: '50px', 
                background: 'rgba(15, 23, 42, 0.6)', 
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderRadius: '32px', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ 
                    width: '70px', 
                    height: '70px', 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                    borderRadius: '20px', 
                    margin: '0 auto 25px auto', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
                    fontSize: '32px'
                }}>
                    🏫
                </div>
                
                <h1 style={{ fontSize: '32px', color: '#f8fafc', margin: '0 0 12px 0', letterSpacing: '-1px', fontWeight: '800' }}>
                    Welcome to <span style={{color: '#60a5fa'}}>SmartCampus</span>
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '16px', margin: '0 0 40px 0', lineHeight: '1.6' }}>
                    The unified operating hub for university facilities, incidents, and resource management.
                </p>

                <button 
                    onClick={handleGoogleLogin}
                    style={{
                        width: '100%',
                        padding: '16px 24px', 
                        fontSize: '16px', 
                        cursor: 'pointer',
                        backgroundColor: '#1e293b', 
                        color: '#f8fafc', 
                        border: '1px solid #334155', 
                        borderRadius: '16px', 
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.4)'; e.currentTarget.style.borderColor = '#60a5fa'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.2)'; e.currentTarget.style.borderColor = '#334155'; }}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: '20px', height: '20px'}} />
                    Continue with Google
                </button>

                <div style={{ marginTop: '30px', borderTop: '1px solid rgba(226, 232, 240, 0.5)', paddingTop: '20px' }}>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                        Internal Access Only &bull; University of Smart Campus
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
