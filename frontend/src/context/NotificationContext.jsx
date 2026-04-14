import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import ToastContainer from '../components/Toast';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useContext(AuthContext);

    const showNotification = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random();
        setNotifications(prev => [...prev, { id, message, type }]);
        
        // Auto-dismiss after 4.5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 4500);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // WebSocket Connection Logic
    useEffect(() => {
        if (!user) return;

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = (frame) => {
            console.log('Connected to WebSocket');
            // Subscribe to private user queue
            client.subscribe(`/user/${user.id}/queue/notifications`, (message) => {
                const notification = JSON.parse(message.body);
                showNotification(notification.message, notification.type.toLowerCase() || 'info');
            });
        };

        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        client.activate();

        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [user, showNotification]);

    return (
        <NotificationContext.Provider value={{ showNotification, removeNotification, notifications }}>
            {children}
            <ToastContainer />
        </NotificationContext.Provider>
    );
};
