import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../utils/api';
import { Calendar, Clock, User, Car, CheckCircle2, AlertTriangle, Eye, X } from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Active');
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

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getOwnerBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleComplete = async (id) => {
    if (window.confirm('Force complete this parking? Overtime will be calculated automatically.')) {
      try {
        await bookingAPI.completeBooking(id);
        alert('Parking completed successfully!');
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || 'Error completing booking');
      }
    }
  };

  const isOvertime = (booking) => {
    if (booking.status !== 'Active') return false;
    const now = new Date();
    // Since we now store endTime correctly in UTC representing IST, 
    // and now is UTC, comparison works.
    return now > new Date(booking.endTime);
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'Active' ? booking.status === 'Active' : booking.status !== 'Active'
  );

  if (loading) return <div className="text-center py-20">Loading live bookings...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Live Bookings</h1>
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-neon-blue" />
              <span className="text-xs font-mono font-bold text-gray-400">IST: {istTime}</span>
            </div>
          </div>
          <p className="text-gray-400 mt-1">Monitor active reservations and handle overstays</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('Active')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'Active' 
                ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20' 
                : 'hover:bg-white/5 text-gray-400'
            } text-sm font-medium`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('Past')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'Past' 
                ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20' 
                : 'hover:bg-white/5 text-gray-400'
            } text-sm font-medium`}
          >
            Past
          </button>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">User & Vehicle</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Spot</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Schedule</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className={`hover:bg-white/[0.02] transition-colors group ${isOvertime(booking) ? 'bg-red-500/5' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-bold">{booking.user?.name}</p>
                        <p className="text-xs text-gray-500">{booking.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-neon-blue">{booking.parkingSpot?.name}</p>
                      <p className="text-xs text-gray-500 uppercase">{booking.parkingSpot?.type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-neon-purple" />
                        {booking.date}
                      </p>
                      <p className="text-sm flex items-center gap-2 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.time}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-block text-center ${
                        booking.status === 'Active' 
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                          : booking.status === 'Cancelled'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-gray-500/10 text-gray-400 border border-white/10'
                      }`}>
                        {booking.status}
                      </span>
                      {isOvertime(booking) && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          OVERTIME
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {booking.status === 'Active' && (
                      <button 
                        onClick={() => handleComplete(booking._id)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                          isOvertime(booking)
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                            : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
                        }`}
                      >
                        {isOvertime(booking) ? 'Force Release' : 'Complete'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <Calendar className="w-10 h-10" />
                      <p>No {filter.toLowerCase()} bookings found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
