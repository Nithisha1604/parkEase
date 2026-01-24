import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, DollarSign, PieChart, CreditCard } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Volume', value: '$0.00', icon: DollarSign, color: 'text-neon-blue' },
    { label: 'Platform Fees', value: '$0.00', icon: PieChart, color: 'text-neon-purple' },
    { label: 'Payouts Made', value: '$0.00', icon: CreditCard, color: 'text-green-500' },
  ]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await adminAPI.getTransactions();
        setTransactions(data);
        
        const volume = data.reduce((acc, tx) => acc + (tx.type === 'Debit' ? tx.amount : 0), 0);
        const fees = volume * 0.1; // Example 10% fee
        
        setStats([
          { label: 'Total Volume', value: `$${volume.toFixed(2)}`, icon: DollarSign, color: 'text-neon-blue' },
          { label: 'Platform Fees', value: `$${fees.toFixed(2)}`, icon: PieChart, color: 'text-neon-purple' },
          { label: 'Payouts Made', value: `$${(volume - fees).toFixed(2)}`, icon: CreditCard, color: 'text-green-500' },
        ]);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) return <div className="text-center py-10">Loading transactions...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">System Transactions</h1>
          <p className="text-gray-400 mt-1">Monitor and audit all financial activities across the platform</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all text-sm font-bold">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold shrink-0">Recent Transactions</h3>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search by ID or user..."
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-neon-blue w-full md:w-64 transition-all text-sm"
              />
            </div>
            <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400">
                <th className="px-6 py-4 text-xs font-bold uppercase">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-400">{tx._id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {tx.type === 'Credit' ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-neon-blue" />
                      )}
                      <span className="text-sm font-medium">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{tx.userName}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${tx.type === 'Credit' ? 'text-green-500' : 'text-gray-200'}`}>
                      {tx.type === 'Credit' ? '+' : ''}${tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-[10px] font-bold uppercase border border-green-500/20">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
