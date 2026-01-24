import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, DollarSign, TrendingUp, CreditCard, Download, Loader2 } from 'lucide-react';
import { useAuth } from '../../App';
import { spotAPI } from '../../utils/api';

const OwnerWallet = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await spotAPI.getOwnerStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
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
    { label: 'Current Balance', value: `$${user?.wallet?.toFixed(2) || '0.00'}`, icon: WalletIcon, color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
    { label: 'Total Earnings', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Active Bookings', value: stats.activeBookings, icon: CreditCard, color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
  ];

  const recentTransactions = [...(user?.transactions || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Earnings & Wallet</h1>
          <p className="text-gray-400 mt-1">Track your revenue and manage payouts</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-gradient text-dark font-bold hover:opacity-90 transition-all">
          Withdraw Funds
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6 border-white/10 relative group overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            <div className="flex justify-between items-start relative z-10">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card overflow-hidden p-0">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-bold">Transaction History</h3>
            <button className="text-neon-blue text-sm font-bold flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Description</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Amount</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Type</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentTransactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-bold">{tx.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className={`px-6 py-4 font-bold ${tx.type === 'Credit' ? 'text-green-500' : 'text-neon-pink'}`}>
                      {tx.type === 'Credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{tx.type}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                        {tx.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No transactions yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card space-y-6">
          <h3 className="text-xl font-bold">Earning Analytics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Utilization Rate</span>
                <span className="text-neon-blue font-bold">{stats.utilization}</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-neon-blue shadow-neon-blue" style={{ width: stats.utilization }} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neon-blue/5 border border-neon-blue/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-neon-blue" />
              <span className="font-bold">Growth Insight</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your parking spaces are performing well. Weekend utilization is high.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerWallet;
