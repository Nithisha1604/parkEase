import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, User, Clock } from 'lucide-react';
import { useAuth } from '../App';

const Navbar = ({ setIsSidebarOpen }) => {
  const { user } = useAuth();
  const [istTime, setIstTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setIstTime(new Date().toLocaleTimeString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-20 border-b border-white/10 bg-dark-lighter/50 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8">
      <div className="h-full flex items-center justify-between gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neon-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search parking spots, locations..." 
              className="w-full bg-dark border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-neon-blue outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 group hover:border-neon-blue transition-all">
            <Clock className="w-4 h-4 text-neon-blue group-hover:animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-tighter text-gray-500">Global IST Time</span>
              <span className="text-sm font-mono font-bold text-white tabular-nums">{istTime}</span>
            </div>
          </div>

          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group">
            <Bell className="w-5 h-5 group-hover:text-neon-blue" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-neon-purple rounded-full shadow-neon-purple" />
          </button>
          
          <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block" />

          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-tight">{user?.name}</p>
              <p className="text-xs text-neon-blue font-medium uppercase tracking-wider">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-dark-lighter border border-white/10 flex items-center justify-center hover:border-neon-blue transition-all cursor-pointer">
              <User className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
