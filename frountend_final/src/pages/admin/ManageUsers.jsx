import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { Search, Filter, MoreVertical, Shield, User, Mail, Calendar, Edit2, Ban, Trash2 } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading users...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-gray-400 mt-1">View and manage all registered platform users</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search users..."
              className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-neon-blue w-64 transition-all"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400">
                <th className="px-6 py-4 text-xs font-bold uppercase">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Joined Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-neon-blue/20 text-neon-blue`}>
                        {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </div>
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase border ${
                      user.role === 'owner' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' : 'bg-neon-blue/10 text-neon-blue border-neon-blue/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
