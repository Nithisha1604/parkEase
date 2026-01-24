import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { Search, Filter, MapPin, CheckCircle2, XCircle, MoreVertical, Star, ShieldAlert } from 'lucide-react';

const AdminManageSpaces = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSpots = async () => {
    try {
      const { data } = await adminAPI.getSpots();
      setSpots(data);
    } catch (error) {
      console.error('Error fetching spots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveSpot(id);
      fetchSpots();
    } catch (error) {
      alert('Error approving spot');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminAPI.rejectSpot(id);
      fetchSpots();
    } catch (error) {
      alert('Error rejecting spot');
    }
  };

  if (loading) return <div className="text-center py-10">Loading spaces...</div>;

  const pendingSpots = spots.filter(s => s.status === 'Inactive');
  const activeSpots = spots.filter(s => s.status === 'Active');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Manage All Spaces</h1>
          <p className="text-gray-400 mt-1">Review, approve and manage platform parking locations</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by space or owner..."
              className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-neon-blue w-64 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all text-sm font-bold">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="card overflow-hidden p-0">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-bold">Pending Approval <span className="ml-2 px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold">{pendingSpots.length} New</span></h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase font-bold">
                  <th className="px-6 py-4">Space Info</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingSpots.map((spot) => (
                  <tr key={spot._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-200">{spot.name}</p>
                      <p className="text-xs text-gray-500">Submitted {new Date(spot.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{spot.owner?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {spot.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase border border-yellow-500/20">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleApprove(spot._id)}
                          className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs font-bold transition-all"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(spot._id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold transition-all"
                        >
                          Reject
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

        <div className="card overflow-hidden p-0">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-bold">Active Listings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase font-bold">
                  <th className="px-6 py-4">Space Info</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Pricing</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeSpots.map((spot) => (
                  <tr key={spot._id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                          <img src={spot.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-200">{spot.name}</p>
                          <p className="text-xs text-gray-500">{spot.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{spot.owner?.name}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-neon-blue">${spot.price?.toFixed(2)}/hr</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-neon-purple text-sm font-bold">
                        <Star className="w-3.5 h-3.5 fill-neon-purple" />
                        {spot.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManageSpaces;
