import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, Car, Shield, Wifi, Zap, ArrowLeft, Calendar, Heart, Camera, Eye, Map as MapIcon, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { spotAPI, bookingAPI, userAPI } from '../../utils/api';
import { useAuth } from '../../App';

const SpotDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }));
  const [arrival, setArrival] = useState(() => {
    const now = new Date();
    const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    return `${istNow.getHours().toString().padStart(2, '0')}:00`;
  });
  const [departure, setDeparture] = useState(() => {
    const now = new Date();
    const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    return `${(istNow.getHours() + 2).toString().padStart(2, '0')}:00`;
  });
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
    return null; // Return null for non-embeddable or generic links
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spotRes, favoritesRes] = await Promise.all([
          spotAPI.getSpots(),
          userAPI.getFavorites()
        ]);
        
        const found = spotRes.data.find(s => s._id === id);
        setSpot(found);
        
        const favorited = favoritesRes.data.some(f => f._id === id);
        setIsFavorite(favorited);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleToggleFavorite = async () => {
    try {
      await userAPI.toggleFavorite(spot._id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleBooking = async () => {
    setBookingLoading(true);
    try {
      // Calculate duration in hours
      const [startH, startM] = arrival.split(':').map(Number);
      const [endH, endM] = departure.split(':').map(Number);
      const durationHours = (endH + endM / 60) - (startH + startM / 60);
      const finalDuration = Math.max(1, Math.ceil(durationHours));
      const amount = spot.price * finalDuration + 0.50; // Including service fee

      await bookingAPI.createBooking({
        parkingSpotId: spot._id,
        date,
        time: `${arrival} - ${departure}`,
        amount
      });
      
      // Refresh user wallet after booking
      const { data: profile } = await userAPI.getProfile();
      login(profile, localStorage.getItem('token'));
      
      alert('Booking successful!');
      navigate('/driver/bookings');
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-white">Loading spot details...</div>;
  if (!spot) return <div className="text-center py-10 text-white">Spot not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to search
        </button>

        <button 
          onClick={handleToggleFavorite}
          className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 font-bold ${
            isFavorite 
              ? 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink' 
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-neon-pink' : ''}`} />
          {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-96 rounded-3xl overflow-hidden border border-white/10">
            <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold mb-2">{spot.name}</h1>
                <p className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-5 h-5 text-neon-blue" />
                  {spot.location}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-dark/60 px-4 py-2 rounded-2xl border border-white/10">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{spot.rating}</span>
                <span className="text-gray-400 text-sm">(124 Reviews)</span>
              </div>
            </div>
          </div>

          <div className="card space-y-6">
            <h2 className="text-2xl font-bold">About this spot</h2>
            <p className="text-gray-400 leading-relaxed">
              Located in the heart of the city, {spot.name} offers premium parking with state-of-the-art security features. 
              Easy access to major business towers and shopping centers. Perfect for both short-term and long-term parking.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
                <Shield className="w-6 h-6 text-neon-blue" />
                <span className="text-xs text-gray-400">Security</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
                <Wifi className="w-6 h-6 text-neon-purple" />
                <span className="text-xs text-gray-400">Free WiFi</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                <span className="text-xs text-gray-400">EV Charging</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
                <Clock className="w-6 h-6 text-neon-pink" />
                <span className="text-xs text-gray-400">24/7 Access</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Camera className="w-5 h-5 text-neon-pink" />
                  Live Feed
                </h3>
                <span className="flex items-center gap-1 text-xs font-bold text-red-500 animate-pulse">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  LIVE
                </span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
                {spot.liveFeedURL ? (
                  getEmbedUrl(spot.liveFeedURL) ? (
                    <iframe
                      src={getEmbedUrl(spot.liveFeedURL)}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center p-6">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-1">Live Feed Available</p>
                        <p className="text-xs text-gray-500">The owner has provided a live stream link for this spot.</p>
                      </div>
                      <a 
                        href={spot.liveFeedURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary py-2 px-6 text-sm flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Watch Live Stream
                      </a>
                    </div>
                  )
                ) : (
                  <div className="relative w-full h-full group">
                    <video 
                      src="https://assets.mixkit.co/videos/preview/mixkit-security-camera-view-of-a-street-at-night-42283-large.mp4" 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      className="w-full h-full object-cover grayscale brightness-75 contrast-125"
                    />
                    {/* CCTV Overlay Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Scanlines */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
                      
                      {/* Vignette */}
                      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
                      
                      {/* Metadata Labels */}
                      <div className="absolute top-4 right-4 text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                          <span className="text-[10px] font-mono text-red-500 font-bold tracking-tighter">REC</span>
                        </div>
                        <p className="text-[10px] font-mono text-white/50 leading-none">24.0 FPS</p>
                        <p className="text-[10px] font-mono text-white/50 leading-none mt-1">BITRATE: 4.2 Mbps</p>
                      </div>

                      <div className="absolute bottom-4 left-4 font-mono text-white/70">
                        <p className="text-xs font-bold tracking-widest uppercase mb-1">CAM-04 | SEC-WEST</p>
                        <p className="text-[10px]">{new Date().toLocaleDateString()} {istTime}</p>
                      </div>

                      {/* Corner Accents */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/30" />
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/30" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/30" />
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/30" />
                    </div>
                  </div>
                )}
                <div className="absolute top-4 left-4 text-[10px] font-mono text-white/70 space-y-1 pointer-events-none">
                  <p>CAM-04 | NORTH ENTRANCE</p>
                  <p>{new Date().toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center italic">Real-time monitoring enabled</p>
            </div>

            <div className="card space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-neon-blue" />
                Location
              </h3>
              <div className="aspect-video rounded-xl overflow-hidden border border-white/10 relative">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(spot.location)}`}
                  allowFullScreen
                ></iframe>
                {/* Note: In a real app, you'd use a real API key. For this demo, we can use a generic search link or keep the iframe as a placeholder with a fallback */}
                <div className="absolute inset-0 bg-dark/20 flex items-center justify-center">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Interactive Map
                  </a>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{spot.location}</span>
                <a 
                  href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(spot.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-blue hover:underline font-medium"
                >
                  Street View
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card sticky top-28 border-neon-blue/30 shadow-neon-blue/10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <span className="text-gray-400">Price</span>
                <span className="text-[10px] text-neon-blue font-bold flex items-center gap-1 uppercase tracking-tighter mt-1">
                  <Clock className="w-2.5 h-2.5" />
                  IST: {istTime}
                </span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold">${spot.price}</span>
                <span className="text-gray-400 text-sm">/hr</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="date" 
                    className="input-field pl-10" 
                    value={date} 
                    min={new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Arrival</label>
                  <input 
                    type="time" 
                    className="input-field" 
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Departure</label>
                  <input 
                    type="time" 
                    className="input-field" 
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {(() => {
                    const [startH, startM] = arrival.split(':').map(Number);
                    const [endH, endM] = departure.split(':').map(Number);
                    const durationHours = (endH + endM / 60) - (startH + startM / 60);
                    const finalDuration = Math.max(1, Math.ceil(durationHours));
                    return `${finalDuration} hours x $${spot.price}`;
                  })()}
                </span>
                <span>
                  {(() => {
                    const [startH, startM] = arrival.split(':').map(Number);
                    const [endH, endM] = departure.split(':').map(Number);
                    const durationHours = (endH + endM / 60) - (startH + startM / 60);
                    const finalDuration = Math.max(1, Math.ceil(durationHours));
                    return `$${(spot.price * finalDuration).toFixed(2)}`;
                  })()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Service Fee</span>
                <span>$0.50</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="neon-text">
                  {(() => {
                    const [startH, startM] = arrival.split(':').map(Number);
                    const [endH, endM] = departure.split(':').map(Number);
                    const durationHours = (endH + endM / 60) - (startH + startM / 60);
                    const finalDuration = Math.max(1, Math.ceil(durationHours));
                    return `$${(spot.price * finalDuration + 0.50).toFixed(2)}`;
                  })()}
                </span>
              </div>
            </div>

            <button 
              onClick={handleBooking}
              disabled={bookingLoading}
              className={`btn-primary w-full py-4 text-lg ${bookingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {bookingLoading ? 'Processing...' : 'Reserve Now'}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">No charge until you arrive at the spot</p>
          </div>

          <div className="card p-6 bg-neon-purple/5 border-neon-purple/20">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-neon-purple">
              <Shield className="w-4 h-4" />
              ParkEase Protection
            </h3>
            <p className="text-xs text-gray-400">Your booking is covered by our protection plan. Cancel for free up to 1 hour before arrival.</p>
          </div>

          <div className="card p-6 bg-neon-blue/5 border-neon-blue/20">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-neon-blue">
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
              Live Occupancy
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current Status</span>
                <span className="text-neon-blue font-bold">{Math.round((spot.availableSpots / spot.totalSpots) * 100)}% Available</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all duration-1000"
                  style={{ width: `${(spot.availableSpots / spot.totalSpots) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-mono">
                <span>{spot.availableSpots} SPOTS FREE</span>
                <span>{spot.totalSpots} TOTAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Live Stream Player */}
      <div 
        className={`fixed z-50 transition-all duration-500 ease-in-out ${
          isPlayerExpanded 
            ? 'inset-4 md:inset-20' 
            : 'bottom-6 right-6 w-64 md:w-80 aspect-video'
        }`}
      >
        <div className={`relative w-full h-full rounded-2xl overflow-hidden border-2 shadow-2xl bg-black group transition-colors duration-300 ${isPlayerExpanded ? 'border-neon-purple' : 'border-neon-blue shadow-neon-blue/20'}`}>
          <video 
            src="https://assets.mixkit.co/videos/preview/mixkit-security-camera-view-of-a-street-at-night-42283-large.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover grayscale brightness-75 contrast-125"
          />
          
          {/* CCTV Overlay Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              <span className="text-[8px] font-mono text-red-500 font-bold">REC</span>
            </div>
          </div>
          
          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white tracking-widest uppercase">Live Feed</span>
              </div>
              
              {isPlayerExpanded && (
                <button 
                  onClick={() => setIsPlayerExpanded(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-white">
                <p className="text-xs font-bold truncate max-w-[150px]">{spot.name}</p>
                <p className="text-[8px] text-gray-400 font-mono">CAM-SEC-01</p>
              </div>
              
              {!isPlayerExpanded && (
                <button 
                  onClick={() => setIsPlayerExpanded(true)}
                  className="p-2 rounded-xl bg-neon-blue/20 hover:bg-neon-blue/40 text-neon-blue backdrop-blur-md transition-all border border-neon-blue/30"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Minimal view status when not expanded and not hovered */}
          {!isPlayerExpanded && (
            <div className="absolute top-2 left-2 group-hover:opacity-0 transition-opacity pointer-events-none">
               <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/5">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-bold text-white/80 uppercase">Live</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;
