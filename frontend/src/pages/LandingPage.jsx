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
            background: '#020617',
            color: '#f8fafc',
            fontFamily: '"Inter", -apple-system, sans-serif',
            overflowX: 'hidden'
        }}>
            {/* Navigation Backdrop */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '90px', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(20px)', zIndex: 1000, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '45px', height: '45px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)' }}>
                            <GraduationCap size={26} color="white" />
                        </div>
                        <span style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1.5px' }}>Smart<span style={{ color: 'var(--primary)' }}>Campus</span></span>
                    </div>
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>

                        <button onClick={() => navigate('/login')} style={{ background: 'var(--primary)', color: 'white', padding: '12px 28px', borderRadius: '14px', fontWeight: '900', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>Launch Portal</button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section style={{ padding: '200px 0 120px 0', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '5%', right: '-5%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0 }} />
                <div style={{ position: 'absolute', bottom: '0', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0 }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        background: 'rgba(59, 130, 246, 0.08)', color: '#60a5fa',
                        padding: '10px 24px', borderRadius: '40px', border: '1px solid rgba(59, 130, 246, 0.15)',
                        fontSize: '12px', fontWeight: '900', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px'
                    }}>
                        <Cpu size={14} /> Integrated Operating System for Universities
                    </div>
                    <h1 style={{ fontSize: '84px', fontWeight: '900', letterSpacing: '-5px', lineHeight: '0.85', marginBottom: '40px', color: 'white' }}>
                        The Intelligence. <br />
                        <span style={{
                            background: 'linear-gradient(to right, #60a5fa, #c084fc)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Behind Every Action.</span>
                    </h1>
                    <p style={{ fontSize: '22px', color: '#94a3b8', maxWidth: '800px', margin: '0 auto 60px auto', lineHeight: '1.6', fontWeight: '500' }}>
                        Orchestrate university resources, infrastructure, and campus maintenance through a unified neural network designed to boost architectural efficiency.
                    </p>
                    <div style={{ display: 'flex', gap: '25px', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/login')} style={{ padding: '22px 48px', background: 'var(--primary)', color: 'white', borderRadius: '18px', fontWeight: '900', fontSize: '18px', border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', gap: '15px', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            Access Neural Portal <ArrowRight size={22} />
                        </button>
                        <button style={{ padding: '22px 48px', background: 'rgba(255,255,255,0.03)', color: 'white', borderRadius: '18px', fontWeight: '900', fontSize: '18px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                            System Overview
                        </button>
                    </div>


                </div>
            </section>

            {/* Core Capabilities */}
            <section style={{ padding: '120px 0', background: 'rgba(255,255,255,0.01)' }}>
                <div className="container" style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', marginBottom: '20px' }}>The Backbone of Innovation</h2>
                    <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Four core pillars that drive our operational intelligence across the campus infrastructure.</p>
                </div>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
                        <div style={{ padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' }}>
                            <div style={{ marginBottom: '30px' }}><Network size={32} color="#60a5fa" /></div>
                            <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '20px' }}>Neural Registry</h3>
                            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '15px' }}>A highly structured facility index allowing instantaneous lookup and status verification of any university asset.</p>
                        </div>
                        <div style={{ padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' }}>
                            <div style={{ marginBottom: '30px' }}><Calendar size={32} color="#8b5cf6" /></div>
                            <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '20px' }}>Dynamic Flow</h3>
                            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '15px' }}>Reservations are processed via a logic-locked engine to eliminate overlaps and ensure 100% room occupancy efficiency.</p>
                        </div>
                        <div style={{ padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' }}>
                            <div style={{ marginBottom: '30px' }}><ShieldCheck size={32} color="#10b981" /></div>
                            <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '20px' }}>Protocol Access</h3>
                            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '15px' }}>Ironclad authentication layers ensure that administrative actions and sensitive maintenance logs are strictly guarded.</p>
                        </div>
                        <div style={{ padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' }}>
                            <div style={{ marginBottom: '30px' }}><Zap size={32} color="#f59e0b" /></div>
                            <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '20px' }}>Rapid Triage</h3>
                            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '15px' }}>Instantaneous reporting of hardware failures with direct integration to technician mobile terminals for rapid response.</p>
                        </div>
                    </div>
                </div>
            </section>



            {/* Final CTA */}
            <section style={{ padding: '160px 0' }}>
                <div className="container">
                    <div style={{
                        background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent), #0f172a',
                        padding: '120px 60px', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.08)',
                        textAlign: 'center', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.2)', filter: 'blur(80px)', borderRadius: '50%' }} />
                        <h2 style={{ fontSize: '64px', fontWeight: '900', letterSpacing: '-3px', marginBottom: '30px', color: 'white' }}>Unlock the Next Level.</h2>
                        <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 50px auto', lineHeight: '1.6' }}>The SmartCampus environment is ready for deployment across your faculty. Authenticate to proceed to the core operations hub.</p>
                        <button onClick={() => navigate('/login')} style={{ padding: '24px 60px', background: 'white', color: '#020617', borderRadius: '24px', fontWeight: '900', fontSize: '18px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '15px', boxShadow: '0 30px 60px -10px rgba(255,255,255,0.2)', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                            Launch Operational Hub <ChevronRight size={22} />
                        </button>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#64748b', background: 'rgba(0,0,0,0.2)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '40px' }}>
                        <div style={{ flex: '1', minWidth: '250px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: 'white' }}>
                                <GraduationCap size={24} />
                                <span style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-1px' }}>Smart<span style={{ color: 'var(--primary)' }}>Campus</span></span>
                            </div>
                            <p style={{ fontSize: '14px', lineHeight: '1.6', maxWidth: '300px' }}>
                                The unified operating hub for university facilities and resource management. Built for efficiency, designed for scale.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
                            <div>
                                <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Contact</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <li>it-support@smartcampus.edu</li>
                                    <li>+94 *** *** ****</li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Location</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <li>SLIIT,Malabe,</li>
                                    <li>Colombo.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '60px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.03)', fontSize: '12px', textAlign: 'center' }}>
                        &copy; 2026 SmartCampus Integrated Systems &bull; All Rights Reserved
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
