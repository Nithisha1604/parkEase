import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../utils/api';
import { Calendar, Clock, MapPin, Download, MoreVertical, Loader2 } from 'lucide-react';

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await bookingAPI.getUserBookings();
        // Filter for non-active bookings (Completed or Cancelled)
        setBookings(data.filter(b => b.status !== 'Active'));
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Booking History</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-all border border-white/10">
          <Download className="w-4 h-4 text-neon-blue" />
          Export CSV
        </button>
      </div>

      <div className="card overflow-hidden p-0 border-white/10 bg-dark-lighter shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Spot Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-neon-gradient p-[1px]">
                        <div className="w-full h-full rounded-xl bg-dark flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-neon-blue" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold">{booking.parkingSpot?.name || 'Unknown Spot'}</p>
                        <p className="text-xs text-gray-500 uppercase">{booking.parkingSpot?.type || 'Standard'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center gap-2 text-gray-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-neon-purple" />
                        {booking.date}
                      </p>
                      <p className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.time}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-neon-blue">${booking.amount?.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      booking.status === 'Completed' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5 shadow-inner">
            <Calendar className="w-10 h-10 text-gray-700" />
          </div>
          <h3 className="text-xl font-bold mb-2">No past bookings found</h3>
          <p className="text-gray-500 max-w-xs">Your completed parking sessions and receipts will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default History;
