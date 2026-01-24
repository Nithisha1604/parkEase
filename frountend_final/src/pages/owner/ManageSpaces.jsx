import React, { useState, useEffect } from 'react';
import { spotAPI } from '../../utils/api';
import { MapPin, Plus, Edit2, Trash2, Eye, Star, Settings, X } from 'lucide-react';

const ManageSpaces = () => {
  const [ownerSpaces, setOwnerSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState(null);
  const [newSpace, setNewSpace] = useState({
    name: '',
    location: '',
    price: '',
    totalSpots: '',
    type: 'Indoor',
    liveFeedURL: '',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=400'
  });

  const fetchSpaces = async () => {
    try {
      const { data } = await spotAPI.getOwnerSpots();
      setOwnerSpaces(data);
    } catch (error) {
      console.error('Error fetching owner spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleOpenEdit = (spot) => {
    setEditingSpot(spot);
    setNewSpace({
      name: spot.name,
      location: spot.location,
      price: spot.price.toString(),
      totalSpots: spot.totalSpots.toString(),
      type: spot.type,
      liveFeedURL: spot.liveFeedURL || '',
      image: spot.image
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSpot(null);
    setNewSpace({
      name: '',
      location: '',
      price: '',
      totalSpots: '',
      type: 'Indoor',
      liveFeedURL: '',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=400'
    });
  };

  const handleAddSpace = async (e) => {
    e.preventDefault();
    try {
      const spotData = {
        ...newSpace,
        price: Number(newSpace.price),
        totalSpots: Number(newSpace.totalSpots),
        availableSpots: editingSpot ? undefined : Number(newSpace.totalSpots)
      };

      if (editingSpot) {
        await spotAPI.updateSpot(editingSpot._id, spotData);
      } else {
        await spotAPI.createSpot(spotData);
      }
      
      handleCloseModal();
      fetchSpaces();
    } catch (error) {
      alert(`Failed to ${editingSpot ? 'update' : 'add'} space`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this space?')) {
      try {
        await spotAPI.deleteSpot(id);
        setOwnerSpaces(ownerSpaces.filter(s => s._id !== id));
      } catch (error) {
        alert('Failed to delete space');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading your spaces...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Parking Spaces</h1>
          <p className="text-gray-400 mt-1">Add, edit or remove your parking locations</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-gradient text-dark font-bold hover:opacity-90 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Space
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
          <div className="card w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6">{editingSpot ? 'Edit' : 'Add New'} Parking Space</h2>
            <form onSubmit={handleAddSpace} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Space Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newSpace.name}
                  onChange={(e) => setNewSpace({...newSpace, name: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Location</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newSpace.location}
                  onChange={(e) => setNewSpace({...newSpace, location: e.target.value})}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Price ($/hr)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={newSpace.price}
                    onChange={(e) => setNewSpace({...newSpace, price: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Total Spots</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={newSpace.totalSpots}
                    onChange={(e) => setNewSpace({...newSpace, totalSpots: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Type</label>
                <select 
                  className="input-field"
                  value={newSpace.type}
                  onChange={(e) => setNewSpace({...newSpace, type: e.target.value})}
                >
                  <option value="Indoor">Indoor</option>
                  <option value="Underground">Underground</option>
                  <option value="Open Space">Open Space</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Live Feed URL (Optional)</label>
                <input 
                  type="url" 
                  className="input-field" 
                  placeholder="https://example.com/live-stream"
                  value={newSpace.liveFeedURL}
                  onChange={(e) => setNewSpace({...newSpace, liveFeedURL: e.target.value})}
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3 mt-4">
                {editingSpot ? 'Update' : 'Create'} Space
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ownerSpaces.map((spot) => (
          <div key={spot._id} className="card p-4 group">
            <div className="flex gap-4">
              <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0">
                <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-neon-blue transition-colors truncate">{spot.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {spot.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-neon-purple font-bold">
                    <Star className="w-3.5 h-3.5 fill-neon-purple" />
                    <span className="text-sm">{spot.rating}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Availability</p>
                    <p className="text-sm font-bold text-neon-blue">{spot.availableSpots}/{spot.totalSpots} <span className="text-[10px] text-gray-500 font-normal">spots</span></p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Price Rate</p>
                    <p className="text-sm font-bold text-gray-300">${spot.price.toFixed(2)}<span className="text-[10px] text-gray-500 font-normal">/hr</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2 border-t border-white/5 pt-4">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-sm font-bold">
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button 
                onClick={() => handleOpenEdit(spot)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-sm font-bold"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-sm font-bold">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button 
                onClick={() => handleDelete(spot._id)}
                className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSpaces;
