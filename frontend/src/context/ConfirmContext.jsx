import React, { createContext, useState, useContext } from 'react';
import { HelpCircle, X, Check } from 'lucide-react';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
    const [config, setConfig] = useState(null);

    const ask = (message, title = "Confirm Action") => {
        return new Promise((resolve) => {
            setConfig({ message, title, resolve });
        });
    };

    const handleConfirm = () => {
        config.resolve(true);
        setConfig(null);
    };

    const handleCancel = () => {
        config.resolve(false);
        setConfig(null);
    };

    return (
        <ConfirmContext.Provider value={{ ask }}>
            {children}
            {config && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '32px', width: '90%', maxWidth: '400px', padding: '40px', boxShadow: 'var(--shadow-premium)', textAlign: 'center', position: 'relative', border: '1px solid var(--border)', animation: 'modalSlide 0.3s ease-out' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto' }}>
                            <HelpCircle size={32} />
                        </div>
                        <h3 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 10px 0', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{config.title}</h3>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 35px 0' }}>{config.message}</p>
                        
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button 
                                onClick={handleCancel}
                                style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid var(--border)', background: 'white', color: 'var(--text-muted)', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <X size={18} /> Cancel
                            </button>
                            <button 
                                onClick={handleConfirm}
                                style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)' }}>
                                <Check size={18} /> Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};
