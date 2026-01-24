import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { ShieldCheck, Users, MapPin, CreditCard, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [pendingSpots, setPendingSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, spotsRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getPendingSpots()
        ]);
        
        const s = statsRes.data;
        setStats([
          { label: 'Total Users', value: s.totalUsers.toString(), icon: Users, color: 'text-neon-blue' },
          { label: 'Pending Spaces', value: s.pendingSpots.toString(), icon: MapPin, color: 'text-yellow-500' },
          { label: 'Total Volume', value: `$${s.totalVolume.toFixed(2)}`, icon: CreditCard, color: 'text-green-500' },
          { label: 'Reports', value: s.reports.toString(), icon: AlertCircle, color: 'text-neon-pink' },
        ]);
        setPendingSpots(spotsRes.data);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveSpot(id);
      setPendingSpots(pendingSpots.filter(s => s._id !== id));
      // Refresh stats
      const { data: s } = await adminAPI.getStats();
      setStats([
        { label: 'Total Users', value: s.totalUsers.toString(), icon: Users, color: 'text-neon-blue' },
        { label: 'Pending Spaces', value: s.pendingSpots.toString(), icon: MapPin, color: 'text-yellow-500' },
        { label: 'Total Volume', value: `$${s.totalVolume.toFixed(2)}`, icon: CreditCard, color: 'text-green-500' },
        { label: 'Reports', value: s.reports.toString(), icon: AlertCircle, color: 'text-neon-pink' },
      ]);
    } catch (error) {
      alert('Error approving spot');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminAPI.rejectSpot(id);
      setPendingSpots(pendingSpots.filter(s => s._id !== id));
    } catch (error) {
      alert('Error rejecting spot');
    }
  };

  if (loading) return <div className="text-center py-10">Loading admin dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-neon-blue shadow-neon-blue" />
          Admin Control Center
        </h1>
        <p className="text-gray-400 mt-2">Global system overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6 flex items-center gap-6">
            <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden p-0">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-bold">Pending Space Approvals</h3>
          <button className="text-sm text-neon-blue hover:underline font-bold">Review All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Space Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Owner</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Location</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Date Submitted</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pendingSpots.map((spot) => (
                <tr key={spot._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold">{spot.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{spot.owner?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{spot.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(spot.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleApprove(spot._id)}
                        className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleReject(spot._id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pendingSpots.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No pending approvals</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
