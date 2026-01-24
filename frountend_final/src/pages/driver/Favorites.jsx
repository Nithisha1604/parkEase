import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import { Star, MapPin, Navigation, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favoriteSpots, setFavoriteSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const { data } = await userAPI.getFavorites();
      setFavoriteSpots(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (spotId) => {
    try {
      await userAPI.toggleFavorite(spotId);
      // Refresh the list after removing
      fetchFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">My Favorites</h1>
        <p className="text-gray-400">{favoriteSpots.length} saved locations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {favoriteSpots.map((spot) => (
          <div key={spot._id} className="card group hover:border-neon-blue/30 transition-all duration-500">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
              <img 
                src={spot.image} 
                alt={spot.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3">
                <button 
                  onClick={() => handleToggleFavorite(spot._id)}
                  className="p-2 rounded-lg bg-dark/60 backdrop-blur-md text-neon-blue border border-neon-blue/20 hover:bg-neon-blue hover:text-dark transition-all"
                >
                  <Star className="w-5 h-5 fill-neon-blue" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-dark/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                {spot.type}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg text-white group-hover:text-neon-blue transition-colors">{spot.name}</h3>
                  <div className="flex items-center gap-1 text-neon-purple font-bold">
                    <Star className="w-4 h-4 fill-neon-purple" />
                    <span>{spot.rating}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {spot.location}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Price</p>
                  <p className="text-neon-blue font-bold">${spot.price?.toFixed(2)}<span className="text-xs text-gray-500 font-normal">/hr</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                  <p className={`text-xs font-bold ${spot.availableSpots > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {spot.availableSpots > 0 ? `${spot.availableSpots} Left` : 'Full'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-white transition-all">
                  <Navigation className="w-4 h-4" />
                  Route
                </button>
                <Link 
                  to={`/driver/spot/${spot._id}`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neon-gradient hover:opacity-90 text-dark text-sm font-bold transition-all"
                >
                  Book Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {favoriteSpots.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Star className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">No favorites yet</h3>
          <p className="text-gray-500 max-w-xs">Save the parking spots you use most frequently for quick access.</p>
          <Link to="/driver" className="mt-6 px-6 py-3 rounded-xl bg-neon-blue/10 text-neon-blue border border-neon-blue/20 font-bold hover:bg-neon-blue/20 transition-all">
            Find Spots
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
