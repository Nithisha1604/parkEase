import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { authAPI } from '../../utils/api';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  Search, 
  Calendar, 
  Clock, 
  Heart, 
  Wallet as WalletIcon, 
  User, 
  LogOut,
  ChevronRight,
  Chrome,
  Github
} from 'lucide-react';

const LoginType2 = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = () => {
    login({ role: 'driver', name: 'Demo Driver' });
    navigate('/driver');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await authAPI.googleLogin({ 
          tokenId: tokenResponse.access_token, 
          role: 'driver' 
        });
        login(data.user, data.token);
        navigate(`/${data.user.role}`);
      } catch (err) {
        setError('Google login failed');
      }
    },
    onError: () => setError('Google login failed'),
  });

  const sidebarItems = [
    { icon: Search, label: 'Find Spot' },
    { icon: Calendar, label: 'My Bookings' },
    { icon: Clock, label: 'History' },
    { icon: Heart, label: 'Favorites' },
    { icon: WalletIcon, label: 'Wallet', active: true },
    { icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-dark flex overflow-hidden">
      {/* Sidebar Mockup (Part of the Login Page Type 2) */}
      <div className="hidden lg:flex w-72 flex-col border-r border-white/10 bg-dark-lighter p-6 relative">
        <div className="mb-10 px-4">
          <h1 className="text-2xl font-bold">
            Park<span className="neon-text">Ease</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer group ${
                item.active 
                  ? 'bg-neon-gradient-vertical p-[1px]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`flex items-center gap-4 w-full h-full rounded-xl px-4 py-3 ${item.active ? 'bg-dark-lighter' : ''}`}>
                <item.icon className={`w-5 h-5 ${item.active ? 'text-neon-blue' : 'group-hover:text-neon-blue'}`} />
                <span className="font-medium">{item.label}</span>
                {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue shadow-neon-blue" />}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto px-4 py-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-gradient p-[2px]">
              <div className="w-full h-full rounded-full bg-dark flex items-center justify-center">
                <User className="w-5 h-5 text-neon-blue" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">Guest User</p>
              <p className="text-xs text-gray-500">guest@parkease.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/20 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-blue/20 blur-[120px] rounded-full -ml-48 -mb-48" />

        <div className="w-full max-w-md space-y-8 relative">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold">
              Park<span className="neon-text">Ease</span>
            </h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Sign In</h2>
            <p className="text-gray-400">Access your wallet and parking spots</p>
          </div>

          <div className="space-y-4">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm text-center">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Email</label>
              <input type="email" placeholder="name@example.com" className="input-field" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Password</label>
              <input type="password" placeholder="••••••••" className="input-field" />
            </div>
            
            <button 
              onClick={handleLogin}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 mt-4"
            >
              Get Started
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span>OR</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => googleLogin()}
              className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all"
            >
              <Chrome className="w-5 h-5" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all">
              <Github className="w-5 h-5" />
              Github
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginType2;
