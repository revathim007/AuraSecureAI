import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, ShieldCheck, Activity, Zap } from 'lucide-react';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { hazardService } from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashRes = await hazardService.getDashboard();
        setData(dashRes.data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-10 bg-gradient-to-br from-white to-gray-50 rounded-[2.5rem] shadow-premium border border-gray-100/50">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
            Welcome back, <span className="text-primary">{user.username}</span>! 👋
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            System status: <span className="text-green-500 font-bold uppercase tracking-wider text-sm">Operational</span>
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/hazard-detection">
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-soft transition-all hover:bg-primary-dark hover:-translate-y-1 active:scale-95">
              <Zap size={20} />
              Hazard Detection
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Scans" 
          value={data?.summary?.total_scans || 0} 
          icon={Activity} 
          colorClass="bg-blue-50 text-blue-500" 
        />
        <StatCard 
          title="Total Alarms" 
          value={data?.summary?.alarms || 0} 
          icon={ShieldAlert} 
          colorClass="bg-red-50 text-red-500" 
        />
        <StatCard 
          title="Total Safe" 
          value={data?.summary?.safe || 0} 
          icon={ShieldCheck} 
          colorClass="bg-green-50 text-green-500" 
        />
        <StatCard 
          title="24h Alarms" 
          value={data?.summary?.recent_alarms_24h || 0} 
          icon={Zap} 
          colorClass="bg-yellow-50 text-yellow-500" 
        />
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {/* Environmental Averages */}
        <Card title="Averages" subtitle="Baseline sensor levels" className="shadow-premium border-none">
          <div className="space-y-8 py-4">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <p className="text-sm font-bold text-gray-600">Gas Level</p>
                <p className="text-xl font-extrabold text-blue-600">{data?.averages?.avg_gas || 0}</p>
              </div>
              <div className="h-3 w-full bg-blue-50 rounded-full overflow-hidden border border-blue-100/50">
                <div 
                  className="h-full bg-blue-500 rounded-full shadow-sm" 
                  style={{ width: `${Math.min((data?.averages?.avg_gas || 0), 100)}%` }} 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <p className="text-sm font-bold text-gray-600">Temperature</p>
                <p className="text-xl font-extrabold text-orange-600">{data?.averages?.avg_temp || 0}°C</p>
              </div>
              <div className="h-3 w-full bg-orange-50 rounded-full overflow-hidden border border-orange-100/50">
                <div 
                  className="h-full bg-orange-500 rounded-full shadow-sm" 
                  style={{ width: `${Math.min((data?.averages?.avg_temp || 0), 100)}%` }} 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <p className="text-sm font-bold text-gray-600">Smoke Level</p>
                <p className="text-xl font-extrabold text-gray-600">{data?.averages?.avg_smoke || 0}</p>
              </div>
              <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                <div 
                  className="h-full bg-gray-500 rounded-full shadow-sm" 
                  style={{ width: `${Math.min((data?.averages?.avg_smoke || 0), 100)}%` }} 
                />
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 text-center">ML Model Confidence</p>
              <p className="text-xs text-primary/70 text-center font-medium leading-relaxed">
                Averages are calculated across all your system evaluations.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
