import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../utils/api';
import { Calendar, Clock, MapPin, MoreVertical, ExternalLink, Camera, Eye, X, Star, Shield, Wifi, Zap } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Active');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [istTime, setIstTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      setIstTime(new Date().toLocaleTimeString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return null;
  };

  const isToday = (bookingDate) => {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    return bookingDate === today;
  };

  const isOvertime = (booking) => {
    if (booking.status !== 'Active') return false;
    const now = new Date();
    return now > new Date(booking.endTime);
  };

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getUserBookings();
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

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingAPI.cancelBooking(id);
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || 'Error cancelling booking');
      }
    }
  };

  const handleComplete = async (id) => {
    if (window.confirm('Are you sure you want to complete this parking? Final amount will be calculated based on duration.')) {
      try {
        await bookingAPI.completeBooking(id);
        alert('Parking completed successfully!');
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || 'Error completing booking');
      }
    }
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'Active' ? booking.status === 'Active' : booking.status !== 'Active'
  );

  const totalSpent = bookings.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  if (loading) return <div className="text-center py-10">Loading bookings...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-neon-blue" />
              <span className="text-xs font-mono font-bold text-gray-400">IST: {istTime}</span>
            </div>
          </div>
          <p className="text-gray-400 mt-1">Total Spent: <span className="text-neon-blue font-bold">${totalSpent.toFixed(2)}</span></p>
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
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Spot Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Date & Time</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-neon-gradient p-[1px]">
                        <div className="w-full h-full rounded-xl bg-dark flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-neon-blue" />
                        </div>
                      </div>
                      <div>
                        <p 
                          className="font-bold cursor-pointer hover:text-neon-blue transition-colors"
                          onClick={() => setSelectedSpot(booking.parkingSpot)}
                        >
                          {booking.parkingSpot?.name}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">{booking.parkingSpot?.type}</p>
                        <div className="flex gap-2 mt-1">
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.parkingSpot?.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-neon-blue hover:underline flex items-center gap-1"
                          >
                            <MapPin className="w-2.5 h-2.5" />
                            Maps
                          </a>
                          <span className="text-gray-600 text-[10px]">|</span>
                          <a 
                            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(booking.parkingSpot?.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-neon-pink hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-2.5 h-2.5" />
                            Street View
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-neon-purple" />
                        <span className={`text-sm ${isToday(booking.date) ? 'text-neon-blue font-bold' : ''}`}>
                          {booking.date}
                        </span>
                        {isToday(booking.date) && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
                            TODAY
                          </span>
                        )}
                        {booking.status === 'Active' && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 animate-pulse ml-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-sm flex items-center gap-2 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.time}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-neon-blue">${booking.amount.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          OVERTIME
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {booking.status === 'Active' && (
                        <>
                          <button 
                            onClick={() => handleComplete(booking._id)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              isOvertime(booking)
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
                            }`}
                          >
                            {isOvertime(booking) ? 'Complete (Overtime)' : 'Complete Park'}
                          </button>
                          <button 
                            onClick={() => handleCancel(booking._id)}
                            className="px-3 py-1 text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredBookings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Calendar className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">No {filter.toLowerCase()} bookings</h3>
          <p className="text-gray-500 max-w-xs">You don't have any {filter.toLowerCase()} parking bookings at the moment.</p>
        </div>
      )}

      {/* Spot Details Drawer */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setSelectedSpot(null)}
          />
          <div className="relative w-full max-w-lg bg-dark border-l border-white/10 h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-10 bg-dark/80 backdrop-blur-md p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold">Spot Details</h2>
              <button 
                onClick={() => setSelectedSpot(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10">
                <img src={selectedSpot.image} alt={selectedSpot.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="bg-dark/60 p-3 rounded-xl border border-white/10">
                    <h3 className="font-bold text-lg">{selectedSpot.name}</h3>
                    <p className="text-xs text-gray-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neon-blue" />
                      {selectedSpot.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="card p-4 flex flex-col items-center gap-2">
                  <span className="text-gray-500 text-xs uppercase">Price</span>
                  <span className="text-xl font-bold text-neon-blue">${selectedSpot.price}/hr</span>
                </div>
                <div className="card p-4 flex flex-col items-center gap-2">
                  <span className="text-gray-500 text-xs uppercase">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{selectedSpot.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold flex items-center gap-2">
                    <Camera className="w-4 h-4 text-neon-pink" />
                    Live Feed
                  </h4>
                  <span className="text-[10px] font-bold text-red-500 animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    LIVE
                  </span>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden border border-white/10 relative group bg-black">
                  {selectedSpot.liveFeedURL ? (
                    getEmbedUrl(selectedSpot.liveFeedURL) ? (
                      <iframe
                        src={getEmbedUrl(selectedSpot.liveFeedURL)}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center p-4">
                        <Camera className="w-8 h-8 text-gray-500" />
                        <a 
                          href={selectedSpot.liveFeedURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-neon-blue hover:underline font-bold"
                        >
                          Watch External Stream
                        </a>
                      </div>
                    )
                  ) : (
                    <>
                      <img src={selectedSpot.image} className="w-full h-full object-cover opacity-50" alt="Live" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-[10px] text-gray-500 font-bold bg-dark/80 px-3 py-1 rounded-full border border-white/10">Simulation Mode</p>
                      </div>
                    </>
                  )}
                  <div className="absolute top-2 left-2 text-[8px] font-mono text-white/50 pointer-events-none">
                    {new Date().toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold">Amenities</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4 text-neon-blue" /> Security
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Wifi className="w-4 h-4 text-neon-purple" /> Free WiFi
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Zap className="w-4 h-4 text-yellow-500" /> EV Charging
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4 text-neon-pink" /> 24/7 Access
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedSpot.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
