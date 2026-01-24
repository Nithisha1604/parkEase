import React, { createContext, useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginType1 from './pages/auth/LoginType1';
import LoginType2 from './pages/auth/LoginType2';
import Signup from './pages/auth/Signup';
import MainLayout from './layout/MainLayout';
import { userAPI } from './utils/api';

// Driver Pages
import FindSpot from './pages/driver/FindSpot';
import SpotDetails from './pages/driver/SpotDetails';
import MyBookings from './pages/driver/MyBookings';
import History from './pages/driver/History';
import Favorites from './pages/driver/Favorites';
import Wallet from './pages/driver/Wallet';
import Profile from './pages/driver/Profile';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import ManageSpaces from './pages/owner/ManageSpaces';
import OwnerBookings from './pages/owner/ManageBookings';
import OwnerWallet from './pages/owner/Wallet';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import AdminManageSpaces from './pages/admin/ManageSpaces';
import Transactions from './pages/admin/Transactions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await userAPI.getProfile();
          setUser(data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginType1 />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login-v2" element={<LoginType2 />} />
        
        <Route path="/" element={<MainLayout />}>
          {/* Driver Routes */}
          <Route path="driver" element={<ProtectedRoute allowedRoles={['driver']}><FindSpot /></ProtectedRoute>} />
          <Route path="driver/spot/:id" element={<ProtectedRoute allowedRoles={['driver']}><SpotDetails /></ProtectedRoute>} />
          <Route path="driver/bookings" element={<ProtectedRoute allowedRoles={['driver']}><MyBookings /></ProtectedRoute>} />
          <Route path="driver/history" element={<ProtectedRoute allowedRoles={['driver']}><History /></ProtectedRoute>} />
          <Route path="driver/favorites" element={<ProtectedRoute allowedRoles={['driver']}><Favorites /></ProtectedRoute>} />
          <Route path="driver/wallet" element={<ProtectedRoute allowedRoles={['driver']}><Wallet /></ProtectedRoute>} />
          <Route path="driver/profile" element={<ProtectedRoute allowedRoles={['driver']}><Profile /></ProtectedRoute>} />

          {/* Owner Routes */}
          <Route path="owner" element={<ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="owner/spaces" element={<ProtectedRoute allowedRoles={['owner']}><ManageSpaces /></ProtectedRoute>} />
          <Route path="owner/bookings" element={<ProtectedRoute allowedRoles={['owner']}><OwnerBookings /></ProtectedRoute>} />
          <Route path="owner/wallet" element={<ProtectedRoute allowedRoles={['owner']}><OwnerWallet /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
          <Route path="admin/spaces" element={<ProtectedRoute allowedRoles={['admin']}><AdminManageSpaces /></ProtectedRoute>} />
          <Route path="admin/transactions" element={<ProtectedRoute allowedRoles={['admin']}><Transactions /></ProtectedRoute>} />
          
          <Route index element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
