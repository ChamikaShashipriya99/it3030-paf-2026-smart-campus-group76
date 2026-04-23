import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { 
    LayoutDashboard, 
    Ticket, 
    ClipboardCheck, 
    Loader2, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    FileText 
} from 'lucide-react';
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip, 
    Legend 
} from 'recharts';

const TechnicianAnalyticsDashboard = () => {
    const { user } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.id) return;
            
            try {
                setLoading(true);
                const [analyticsRes, chartRes] = await Promise.all([
                    api.get(`/analytics/technician/${user.id}`),
                    api.get(`/analytics/technician/${user.id}/chart`)
                ]);
                
                setAnalytics(analyticsRes.data);
                setChartData(chartRes.data);
                setError(null);
            } catch (err) {
                console.error("Dashboard error:", err);
                setError("Failed to load analytics data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Assembeling your data portal...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">System Error</h3>
                <p className="text-gray-600 max-w-md">{error}</p>
            </div>
        );
    }

    const COLORS = ['#6366f1', '#eab308', '#22c55e'];

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #E5E7EB',
            flex: '1',
            minWidth: '240px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#6B7280', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em',
                        margin: 0,
                        whiteSpace: 'nowrap'
                    }}>{title}</p>
                    <h3 style={{ fontSize: '30px', fontWeight: '800', color: '#111827', marginTop: '4px', marginBottom: 0 }}>{value}</h3>
                </div>
                <div style={{ 
                    padding: '12px', 
                    borderRadius: '16px', 
                    marginLeft: '16px',
                    flexShrink: 0,
                    background: colorClass.includes('indigo') ? '#EEF2FF' : 
                                colorClass.includes('blue') ? '#EFF6FF' : 
                                colorClass.includes('yellow') ? '#FEFCE8' : 
                                colorClass.includes('green') ? '#F0FDF4' : '#F3F4F6',
                    color: colorClass.includes('indigo') ? '#4F46E5' : 
                           colorClass.includes('blue') ? '#2563EB' : 
                           colorClass.includes('yellow') ? '#CA8A04' : 
                           colorClass.includes('green') ? '#16A34A' : '#4B5563'
                }}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', margin: 0, color: '#111827' }}>
                        <LayoutDashboard size={32} color="#2563EB" />
                        Technician Command Center
                    </h1>
                    <p style={{ color: '#6B7280', marginTop: '8px', fontSize: '16px' }}>Operational intelligence for {user?.name}</p>
                </div>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: 'white', 
                    padding: '10px 20px', 
                    borderRadius: '12px', 
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ width: '10px', height: '10px', background: '#22C55E', borderRadius: '50%', marginRight: '10px' }}></div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Live Infrastructure Feed</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
                <StatCard 
                    title="Total System Load" 
                    value={analytics?.totalTickets} 
                    icon={FileText} 
                    colorClass="bg-gray-100 text-gray-600"
                />
                <StatCard 
                    title="Personal Queue" 
                    value={analytics?.assignedTickets} 
                    icon={Ticket} 
                    colorClass="bg-indigo-100 text-indigo-600"
                />
                <StatCard 
                    title="Open Protocols" 
                    value={analytics?.openTickets} 
                    icon={AlertCircle} 
                    colorClass="bg-blue-100 text-blue-600"
                />
                <StatCard 
                    title="In Progress" 
                    value={analytics?.inProgressTickets} 
                    icon={Clock} 
                    colorClass="bg-yellow-100 text-yellow-600"
                />
                <StatCard 
                    title="Resolved" 
                    value={analytics?.resolvedTickets} 
                    icon={CheckCircle2} 
                    colorClass="bg-green-100 text-green-600"
                />
            </div>

            {/* Chart Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                <div style={{ gridColumn: 'span 2', background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ClipboardCheck size={24} color="#2563EB" />
                        Workload Distribution
                    </h2>
                    <div style={{ height: '400px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={140}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ 
                    background: '#2563EB', 
                    borderRadius: '24px', 
                    padding: '32px', 
                    color: 'white', 
                    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '400px'
                }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>Focus Mode</h2>
                        <p style={{ color: '#BFDBFE', fontSize: '16px', lineHeight: '1.6' }}>
                            You currently have <span style={{ fontWeight: '700', color: 'white' }}>{analytics?.openTickets + analytics?.inProgressTickets}</span> active protocols. 
                            Prioritize high-impact infrastructure failures to maintain campus operational efficiency.
                        </p>
                    </div>
                    
                    <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.2)', marginTop: '20px' }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', textAlign: 'center' }}>Protocol Completion Strength</p>
                        <div style={{ width: '100%', background: 'rgba(30, 58, 138, 0.4)', borderRadius: '99px', height: '16px', overflow: 'hidden' }}>
                            <div 
                                style={{ 
                                    background: '#4ADE80', 
                                    height: '100%', 
                                    width: `${analytics?.assignedTickets > 0 ? (analytics.resolvedTickets / analytics.assignedTickets) * 100 : 0}%`,
                                    transition: 'width 1s ease-in-out'
                                }}
                            ></div>
                        </div>
                        <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '12px', color: '#BFDBFE' }}>
                            {Math.round(analytics?.assignedTickets > 0 ? (analytics.resolvedTickets / analytics.assignedTickets) * 100 : 0)}% Success Rate
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicianAnalyticsDashboard;
