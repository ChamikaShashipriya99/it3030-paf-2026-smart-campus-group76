import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ConfirmProvider } from './context/ConfirmContext';
import Login from './pages/Login';
import LoginSuccess from './pages/LoginSuccess';
import Dashboard from './pages/Dashboard';
import Catalogue from './pages/Catalogue';
import BookResource from './pages/BookResource';
import ManageBookings from './pages/ManageBookings';
import ManageUsers from './pages/ManageUsers';
import ReportIssue from './pages/ReportIssue';
import ReportIssueStandalone from './pages/ReportIssueStandalone';
import TechnicianDashboard from './pages/TechnicianDashboard';
import TechnicianAnalyticsDashboard from './pages/TechnicianAnalyticsDashboard';
import TicketDetails from './pages/TicketDetails';
import Notifications from './pages/Notifications';
import MyBookings from './pages/MyBookings';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading profile...</div>;

    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <ConfirmProvider>
                    <Router>
                        <Navbar />
                        <div style={{ minHeight: 'calc(100vh - 70px)', paddingBottom: '40px' }}>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/login/success" element={<LoginSuccess />} />

                                {/* Secure Route */}
                                <Route path="/dashboard" element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                } />
                                <Route path="/catalogue" element={
                                    <PrivateRoute>
                                        <Catalogue />
                                    </PrivateRoute>
                                } />
                                <Route path="/book/:id" element={
                                    <PrivateRoute>
                                        <BookResource />
                                    </PrivateRoute>
                                } />
                                <Route path="/admin/bookings" element={
                                    <PrivateRoute>
                                        <ManageBookings />
                                    </PrivateRoute>
                                } />
                                <Route path="/admin/users" element={
                                    <PrivateRoute>
                                        <ManageUsers />
                                    </PrivateRoute>
                                } />
                                <Route path="/report/:id" element={
                                    <PrivateRoute>
                                        <ReportIssue />
                                    </PrivateRoute>
                                } />
                                <Route path="/report-issue" element={
                                    <PrivateRoute>
                                        <ReportIssueStandalone />
                                    </PrivateRoute>
                                } />
                                <Route path="/ticket/:id" element={
                                    <PrivateRoute>
                                        <TicketDetails />
                                    </PrivateRoute>
                                } />
                                <Route path="/technician/desk" element={
                                    <PrivateRoute>
                                        <TechnicianDashboard />
                                    </PrivateRoute>
                                } />
                                <Route path="/technician/analytics" element={
                                    <PrivateRoute>
                                        <TechnicianAnalyticsDashboard />
                                    </PrivateRoute>
                                } />
                                <Route path="/notifications" element={
                                    <PrivateRoute>
                                        <Notifications />
                                    </PrivateRoute>
                                } />
                                <Route path="/my-bookings" element={
                                    <PrivateRoute>
                                        <MyBookings />
                                    </PrivateRoute>
                                } />

                                {/* Open Route */}
                                <Route path="/" element={<LandingPage />} />

                                {/* Default Fallback */}
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </div>
                    </Router>
                </ConfirmProvider>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
