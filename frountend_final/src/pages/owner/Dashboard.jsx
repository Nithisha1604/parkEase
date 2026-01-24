import React, { useState, useEffect } from 'react';
import { LayoutDashboard, MapPin, DollarSign, Calendar, TrendingUp, Users, ArrowUpRight, Loader2 } from 'lucide-react';
import { spotAPI } from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await spotAPI.getOwnerStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching owner stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Spots', value: stats.totalSpots, icon: MapPin, color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Active Bookings', value: stats.activeBookings, icon: Calendar, color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
    { label: 'Utilization', value: stats.utilization, icon: TrendingUp, color: 'text-neon-pink', bg: 'bg-neon-pink/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Space Owner Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor your parking assets performance</p>
        </div>
        <button className="btn-primary px-6 py-3 rounded-xl font-bold">Refresh Analytics</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6 border-white/10 hover:border-white/20 relative group overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            <div className="flex justify-between items-start relative z-10">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                +12% <TrendingUp className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-6 relative z-10">
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Revenue Analytics</h3>
            <select className="bg-dark border border-white/10 rounded-lg px-3 py-1 text-xs outline-none focus:border-neon-blue">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className="w-full bg-neon-blue/20 rounded-t-lg group-hover:bg-neon-blue/40 transition-all cursor-pointer relative"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute inset-0 bg-neon-gradient opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg shadow-neon-blue" />
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-center">Day {i + 1}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-6">
          <h3 className="text-xl font-bold">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((booking) => (
                <div key={booking._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neon-purple font-bold text-xs uppercase">
                    {booking.status.substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">New Booking <span className="text-gray-500 font-normal">received</span></p>
                    <p className="text-xs text-gray-500">${booking.amount.toFixed(2)} • {booking.date}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-600" />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">No recent activity</p>
            )}
          </div>
          <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-all">
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
