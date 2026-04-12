import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap,
    Calendar,
    ShieldCheck,
    Activity,
    ArrowRight,
    ChevronRight,
    Users,
    Zap,
    Globe,
    Layers,
    Server,
    Cpu,
    Network
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: '#FFFFFF',
            color: '#111827',
            fontFamily: '"League Spartan", sans-serif',
            overflowX: 'hidden'
        }}>
            {/* Navigation Backdrop */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '90px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                zIndex: 1000,
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src="/SmartCampus.png" alt="SmartCampus Logo" style={{ height: '50px', width: 'auto' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '12px 28px',
                                borderRadius: '14px',
                                fontWeight: '800',
                                fontSize: '14px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.15)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={e => e.target.style.transform = 'scale(1)'}
                        >
                            Launch Portal
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section style={{ padding: '200px 0 120px 0', position: 'relative', background: 'var(--surface)' }}>
                <div style={{ position: 'absolute', top: '5%', right: '-5%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0 }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        background: 'rgba(37, 99, 235, 0.06)', color: 'var(--primary)',
                        padding: '10px 24px', borderRadius: '40px', border: '1px solid rgba(37, 99, 235, 0.1)',
                        fontSize: '13px', fontWeight: '800', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px'
                    }}>
                        <Cpu size={14} /> Integrated Operating System for Universities
                    </div>
                    <h1 style={{ fontSize: '84px', fontWeight: '900', letterSpacing: '-4px', lineHeight: '0.9', marginBottom: '40px', color: '#111827' }}>
                        The Intelligence. <br />
                        <span style={{
                            background: 'linear-gradient(to right, #2563EB, #7C3AED)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Behind Every Action.</span>
                    </h1>
                    <p style={{ fontSize: '22px', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 60px auto', lineHeight: '1.6', fontWeight: '500' }}>
                        Orchestrate university resources, infrastructure, and campus maintenance through a unified neural network designed to boost architectural efficiency.
                    </p>
                    <div style={{ display: 'flex', gap: '25px', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/login')} style={{ padding: '22px 48px', background: 'var(--primary)', color: 'white', borderRadius: '18px', fontWeight: '800', fontSize: '18px', border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', gap: '15px', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            Access Neural Portal <ArrowRight size={22} />
                        </button>
                        <button style={{ padding: '22px 48px', background: '#FFFFFF', color: '#111827', borderRadius: '18px', fontWeight: '800', fontSize: '18px', border: '1px solid #E5E7EB', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-soft)' }} onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'} onMouseOut={e => e.currentTarget.style.background = '#FFFFFF'}>
                            System Overview
                        </button>
                    </div>
                </div>
            </section>

            {/* Core Capabilities */}
            <section style={{ padding: '120px 0', background: '#FFFFFF' }}>
                <div className="container" style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', marginBottom: '20px', color: '#111827' }}>The Backbone of Innovation</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Four core pillars that drive our operational intelligence across the campus infrastructure.</p>
                </div>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
                        <div style={{ padding: '50px', background: '#FFFFFF', borderRadius: '32px', border: '1px solid #F3F4F6', boxShadow: 'var(--shadow-soft)', transition: 'all 0.3s' }} className="zoom-hover">
                            <div style={{ marginBottom: '30px' }}><Network size={32} color="var(--primary)" /></div>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#111827' }}>Neural Registry</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '16px' }}>A highly structured facility index allowing instantaneous lookup and status verification of any university asset.</p>
                        </div>
                        <div style={{ padding: '50px', background: '#FFFFFF', borderRadius: '32px', border: '1px solid #F3F4F6', boxShadow: 'var(--shadow-soft)', transition: 'all 0.3s' }} className="zoom-hover">
                            <div style={{ marginBottom: '30px' }}><Calendar size={32} color="#8B5CF6" /></div>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#111827' }}>Dynamic Flow</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '16px' }}>Reservations are processed via a logic-locked engine to eliminate overlaps and ensure 100% room occupancy efficiency.</p>
                        </div>
                        <div style={{ padding: '50px', background: '#FFFFFF', borderRadius: '32px', border: '1px solid #F3F4F6', boxShadow: 'var(--shadow-soft)', transition: 'all 0.3s' }} className="zoom-hover">
                            <div style={{ marginBottom: '30px' }}><ShieldCheck size={32} color="#10B981" /></div>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#111827' }}>Protocol Access</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '16px' }}>Ironclad authentication layers ensure that administrative actions and sensitive maintenance logs are strictly guarded.</p>
                        </div>
                        <div style={{ padding: '50px', background: '#FFFFFF', borderRadius: '32px', border: '1px solid #F3F4F6', boxShadow: 'var(--shadow-soft)', transition: 'all 0.3s' }} className="zoom-hover">
                            <div style={{ marginBottom: '30px' }}><Zap size={32} color="#F59E0B" /></div>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#111827' }}>Rapid Triage</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '16px' }}>Instantaneous reporting of hardware failures with direct integration to technician mobile terminals for rapid response.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section style={{ padding: '120px 0', background: 'var(--surface)' }}>
                <div className="container">
                    <div style={{
                        background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                        padding: '100px 60px', borderRadius: '60px',
                        textAlign: 'center', position: 'relative', overflow: 'hidden',
                        boxShadow: '0 30px 60px -12px rgba(37, 99, 235, 0.25)'
                    }}>
                        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(255, 255, 255, 0.1)', filter: 'blur(80px)', borderRadius: '50%' }} />
                        <h2 style={{ fontSize: '64px', fontWeight: '900', letterSpacing: '-3px', marginBottom: '30px', color: 'white' }}>Unlock the Next Level.</h2>
                        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 50px auto', lineHeight: '1.6' }}>The SmartCampus environment is ready for deployment across your faculty. Authenticate to proceed to the core operations hub.</p>
                        <button onClick={() => navigate('/login')} style={{ padding: '24px 60px', background: 'white', color: 'var(--primary)', borderRadius: '24px', fontWeight: '900', fontSize: '18px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '15px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                            Launch Operational Hub <ChevronRight size={22} />
                        </button>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '100px 0', borderTop: '1px solid #F3F4F6', color: 'var(--text-muted)', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '60px' }}>
                        <div style={{ flex: '1', minWidth: '300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                <img src="/SmartCampus.png" alt="SmartCampus Logo" style={{ height: '45px', width: 'auto' }} />
                            </div>
                            <p style={{ fontSize: '15px', lineHeight: '1.8', maxWidth: '350px' }}>
                                The unified operating hub for university facilities and resource management. Built for efficiency, designed for scale.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '100px', flexWrap: 'wrap' }}>
                            <div>
                                <h4 style={{ color: '#111827', fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '25px' }}>Contact</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <li>it-support@smartcampus.edu</li>
                                    <li>+94 *** *** ****</li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ color: '#111827', fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '25px' }}>Location</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <li>SLIIT, Malabe,</li>
                                    <li>Colombo.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid #F3F4F6', fontSize: '14px', textAlign: 'center', color: '#9CA3AF' }}>
                        &copy; 2026 SmartCampus Integrated Systems &bull; All Rights Reserved
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
