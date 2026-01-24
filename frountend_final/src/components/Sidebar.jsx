import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Search, Calendar, Clock, Heart, Wallet, User, 
  LayoutDashboard, MapPin, BarChart3, Users, 
  Settings, LogOut, X, ShieldCheck, History
} from 'lucide-react';
import { useAuth } from '../App';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = {
    driver: [
      { icon: Search, label: 'Find Spot', path: '/driver' },
      { icon: Calendar, label: 'My Bookings', path: '/driver/bookings' },
      { icon: History, label: 'History', path: '/driver/history' },
      { icon: Heart, label: 'Favorites', path: '/driver/favorites' },
      { icon: Wallet, label: 'Wallet', path: '/driver/wallet' },
      { icon: User, label: 'Profile', path: '/driver/profile' },
    ],
    owner: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/owner' },
      { icon: MapPin, label: 'Manage Spaces', path: '/owner/spaces' },
      { icon: Calendar, label: 'Live Bookings', path: '/owner/bookings' },
      { icon: Wallet, label: 'Earnings', path: '/owner/wallet' },
    ],
    admin: [
      { icon: ShieldCheck, label: 'Admin Dashboard', path: '/admin' },
      { icon: Users, label: 'Manage Users', path: '/admin/users' },
      { icon: MapPin, label: 'Approve Spaces', path: '/admin/spaces' },
      { icon: BarChart3, label: 'Transactions', path: '/admin/transactions' },
    ]
  };

  const currentMenu = menuItems[user?.role] || [];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-dark-lighter border-r border-white/10 
        transition-transform duration-300 transform lg:translate-x-0 lg:static lg:block
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10 px-4">
            <h1 className="text-2xl font-bold">
              Park<span className="neon-text">Ease</span>
            </h1>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {currentMenu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all group
                    ${isActive 
                      ? 'bg-neon-gradient text-white shadow-neon-blue' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-neon-blue'}`} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto space-y-2">
            <div className="px-4 py-4 rounded-xl bg-white/5 border border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-gradient p-[2px]">
                  <div className="w-full h-full rounded-full bg-dark flex items-center justify-center">
                    <User className="w-5 h-5 text-neon-blue" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={logout}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
