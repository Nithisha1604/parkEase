import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Clock, Car, Heart, Loader2 } from 'lucide-react';
import { spotAPI, userAPI } from '../../utils/api';

const FindSpot = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [parkingSpots, setParkingSpots] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [spotsRes, favsRes] = await Promise.all([
        spotAPI.getSpots(),
        userAPI.getFavorites()
      ]);
      setParkingSpots(spotsRes.data);
      setFavorites(favsRes.data.map(f => f._id));
    } catch (error) {
      console.error('Error fetching spots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleFavorite = async (e, spotId) => {
    e.preventDefault(); // Prevent navigating to details
    try {
      await userAPI.toggleFavorite(spotId);
      setFavorites(prev => 
        prev.includes(spotId) 
          ? prev.filter(id => id !== spotId)
          : [...prev, spotId]
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-neon-blue mb-4" />
        <p>Searching for nearby spots...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-end bg-dark-lighter p-6 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-sm font-medium text-gray-400">Search Destination</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Where are you going?" 
              className="input-field pl-10 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full lg:w-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Date</label>
            <input 
              type="date" 
              className="input-field h-12" 
              min={new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })}
              defaultValue={new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Time</label>
            <input type="time" className="input-field h-12" />
          </div>
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-sm font-medium text-gray-400">&nbsp;</label>
            <button className="btn-primary w-full h-12 flex items-center justify-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkingSpots.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((spot) => (
          <Link to={`/driver/spot/${spot._id}`} key={spot._id} className="card group cursor-pointer overflow-hidden p-0 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={spot.image} 
                alt={spot.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <button 
                onClick={(e) => handleToggleFavorite(e, spot._id)}
                className="absolute top-4 left-4 p-2 rounded-lg bg-dark/60 backdrop-blur-md border border-white/10 text-white hover:bg-neon-pink/20 transition-all z-10"
              >
                <Heart className={`w-5 h-5 ${favorites.includes(spot._id) ? 'fill-neon-pink text-neon-pink' : ''}`} />
              </button>
              <div className="absolute top-4 right-4 bg-dark/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-neon-blue border border-neon-blue/20">
                ${spot.price}/hr
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark to-transparent">
                <span className="text-xs font-semibold text-neon-purple uppercase tracking-wider">{spot.type}</span>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold mb-1 group-hover:text-neon-blue transition-colors">{spot.name}</h3>
              <p className="text-gray-400 text-sm flex items-center gap-1 mb-4">
                <MapPin className="w-4 h-4" />
                {spot.location}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{spot.rating} (120 reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock className="w-4 h-4 text-neon-blue" />
                  <span>{spot.distance}</span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${spot.availableSpots > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <span className="text-gray-400">{spot.availableSpots} spots left</span>
                </div>
                <button className="text-neon-blue font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Details <Car className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FindSpot;
