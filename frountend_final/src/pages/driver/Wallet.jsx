import React, { useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, CreditCard, History as HistoryIcon, X } from 'lucide-react';
import { useAuth } from '../../App';
import { userAPI } from '../../utils/api';

const Wallet = () => {
  const { user, login } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    
    setLoading(true);
    try {
      const { data } = await userAPI.addMoney(Number(amount));
      login({ ...user, wallet: data.wallet, transactions: data.transactions }, localStorage.getItem('token'));
      setShowAddModal(false);
      setAmount('');
    } catch (error) {
      alert('Failed to add money');
    } finally {
      setLoading(false);
    }
  };

  // Use real transactions from user if available, else empty array
  // Sort by date descending
  const recentTransactions = [...(user?.transactions || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalIncome = recentTransactions
    .filter(tx => tx.type === 'Credit')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = recentTransactions
    .filter(tx => tx.type === 'Debit')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Wallet</h1>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="px-6 py-3 rounded-xl bg-neon-gradient text-dark font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-neon-blue/20"
        >
          <Plus className="w-5 h-5" />
          Add Money
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Balance Card */}
          <div className="relative overflow-hidden rounded-3xl bg-neon-gradient p-[1px] shadow-2xl shadow-neon-blue/20">
            <div className="bg-dark-lighter rounded-[23px] p-8 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 blur-3xl -mr-16 -mt-16" />
              <div className="relative">
                <div className="flex justify-between items-start mb-10">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    <WalletIcon className="w-6 h-6 text-neon-blue" />
                  </div>
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-dark-lighter bg-blue-600" />
                    <div className="w-10 h-10 rounded-full border-2 border-dark-lighter bg-red-600" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-widest">Available Balance</p>
                <h2 className="text-5xl font-bold mb-8 text-white">${user?.wallet?.toFixed(2) || '0.00'}</h2>
                <div className="flex justify-between items-end pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Card Holder</p>
                    <p className="text-sm font-bold">{user?.name}</p>
                  </div>
                  <p className="text-sm font-bold tracking-widest font-mono">**** 4582</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 bg-white/5 border-white/10">
              <p className="text-xs text-gray-500 mb-1 uppercase">Income</p>
              <p className="text-xl font-bold text-green-500">+${totalIncome.toFixed(2)}</p>
            </div>
            <div className="card p-4 bg-white/5 border-white/10">
              <p className="text-xs text-gray-500 mb-1 uppercase">Expenses</p>
              <p className="text-xl font-bold text-neon-pink">-${totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                <HistoryIcon className="w-5 h-5 text-neon-blue" />
                Transaction History
              </h3>
              <button className="text-sm text-neon-blue hover:text-neon-purple transition-colors font-bold">See All Activity</button>
            </div>

            {recentTransactions.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {recentTransactions.map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] hover:bg-white/5 transition-all border border-white/5 hover:border-white/10 group">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        tx.type === 'Credit' ? 'bg-green-500/10 text-green-500' : 'bg-neon-pink/10 text-neon-pink'
                      }`}>
                        {tx.type === 'Credit' ? <ArrowDownLeft className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-neon-blue transition-colors">{tx.description || tx.type}</p>
                        <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${tx.type === 'Credit' ? 'text-green-500' : 'text-white'}`}>
                        {tx.type === 'Credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{tx.status || 'Completed'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <HistoryIcon className="w-8 h-8" />
                </div>
                <p>No recent transactions</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm" onClick={() => !loading && setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-dark-lighter border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
            
            <h3 className="text-2xl font-bold mb-6">Top Up Wallet</h3>
            <form onSubmit={handleAddMoney} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Amount to Add</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-neon-blue">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-3xl font-bold focus:outline-none focus:border-neon-blue transition-all"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {[10, 20, 50].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="py-3 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue hover:text-neon-blue font-bold transition-all"
                  >
                    +${val}
                  </button>
                ))}
              </div>

              <button 
                type="submit"
                disabled={loading || !amount}
                className="w-full py-4 rounded-2xl bg-neon-gradient text-dark font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Confirm Top Up'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
