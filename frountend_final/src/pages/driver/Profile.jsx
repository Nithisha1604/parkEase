import React, { useState } from 'react';
import { useAuth } from '../../App';
import { User, Mail, Phone, MapPin, Camera, Shield, Bell, CreditCard, LogOut, CheckCircle2 } from 'lucide-react';
import { userAPI } from '../../utils/api';

const Profile = () => {
  const { user, logout, login } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    vehicles: user?.vehicles || [],
    paymentMethods: user?.paymentMethods || []
  });

  // Keep formData in sync with user state updates
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        vehicles: user.vehicles || [],
        paymentMethods: user.paymentMethods || []
      });
    }
  }, [user]);

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: true,
    sms: false,
    promotions: true
  });

  const [newVehicle, setNewVehicle] = useState({ model: '', plateNumber: '', color: '' });
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const [newCard, setNewCard] = useState({ cardType: 'Visa', cardNumber: '', expiry: '' });
  const [showCardModal, setShowCardModal] = useState(false);

  const handleSave = async (updatedData = formData) => {
    setIsSaving(true);
    try {
      const { data } = await userAPI.updateProfile(updatedData);
      login(data, localStorage.getItem('token'));
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecurityUpdate = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSavedToast(true);
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowSavedToast(false), 3000);
    }, 1000);
  };

  const toggleNotification = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addVehicle = () => {
    if (!newVehicle.model || !newVehicle.plateNumber) return;
    const updatedVehicles = [...formData.vehicles, newVehicle];
    const newFormData = { ...formData, vehicles: updatedVehicles };
    setFormData(newFormData);
    handleSave(newFormData);
    setNewVehicle({ model: '', plateNumber: '', color: '' });
    setShowVehicleModal(false);
  };

  const removeVehicle = (index) => {
    const updatedVehicles = formData.vehicles.filter((_, i) => i !== index);
    const newFormData = { ...formData, vehicles: updatedVehicles };
    setFormData(newFormData);
    handleSave(newFormData);
  };

  const addCard = () => {
    if (!newCard.cardNumber || !newCard.expiry) return;
    const last4 = newCard.cardNumber.slice(-4);
    const cardToAdd = {
      cardType: newCard.cardType,
      last4: last4,
      expiry: newCard.expiry,
      isDefault: formData.paymentMethods.length === 0
    };
    const updatedMethods = [...formData.paymentMethods, cardToAdd];
    const newFormData = { ...formData, paymentMethods: updatedMethods };
    setFormData(newFormData);
    handleSave(newFormData);
    setNewCard({ cardType: 'Visa', cardNumber: '', expiry: '' });
    setShowCardModal(false);
  };

  const removeCard = (index) => {
    const updatedMethods = formData.paymentMethods.filter((_, i) => i !== index);
    const newFormData = { ...formData, paymentMethods: updatedMethods };
    setFormData(newFormData);
    handleSave(newFormData);
  };

  const tabs = [
    { name: 'Personal Info', icon: User },
    { name: 'Security', icon: Shield },
    { name: 'Notifications', icon: Bell },
    { name: 'Payment Methods', icon: CreditCard }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {showSavedToast && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl shadow-green-500/20">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">Profile updated successfully!</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-400 mt-1">Manage your profile and security preferences</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-bold hover:bg-red-500/20 transition-all hover:scale-105"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="card text-center group">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-full bg-neon-gradient p-[2px] group-hover:rotate-12 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-dark flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 text-neon-blue" />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2.5 rounded-full bg-neon-blue text-dark border-4 border-dark hover:scale-110 active:scale-95 transition-all shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-2xl font-bold text-white">{user?.name || 'User Name'}</h3>
            <p className="text-neon-blue text-sm uppercase tracking-widest font-bold mt-1">{user?.role || 'Driver'}</p>
          </div>

          <div className="card p-2 space-y-1">
            {tabs.map((tab) => (
              <button 
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${
                  activeTab === tab.name 
                    ? 'bg-neon-blue text-dark shadow-lg shadow-neon-blue/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {activeTab === 'Personal Info' && (
            <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <User className="w-5 h-5 text-neon-blue" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-neon-blue transition-colors" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue focus:bg-white/[0.05] transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-neon-blue transition-colors" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue focus:bg-white/[0.05] transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-neon-blue transition-colors" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue focus:bg-white/[0.05] transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-neon-blue transition-colors" />
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue focus:bg-white/[0.05] transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-10 py-4 rounded-2xl bg-neon-gradient text-dark font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-neon-blue/20 disabled:opacity-50"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Shield className="w-5 h-5 text-neon-blue" />
                Security Settings
              </h3>
              <form onSubmit={handleSecurityUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Password</label>
                  <input 
                    type="password" 
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-neon-blue transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">New Password</label>
                    <input 
                      type="password" 
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-neon-blue transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-neon-blue transition-all"
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit"
                    className="px-10 py-4 rounded-2xl bg-neon-gradient text-dark font-bold hover:scale-105 transition-all shadow-xl"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Bell className="w-5 h-5 text-neon-blue" />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div>
                      <p className="font-bold text-lg capitalize">{key} Notifications</p>
                      <p className="text-sm text-gray-500">Receive alerts via {key}</p>
                    </div>
                    <button 
                      onClick={() => toggleNotification(key)}
                      className={`w-14 h-8 rounded-full transition-all relative ${value ? 'bg-neon-blue' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Payment Methods' && (
            <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-neon-blue" />
                  Saved Payment Methods
                </h3>
                <button 
                  onClick={() => setShowCardModal(true)}
                  className="text-xs text-neon-blue font-bold uppercase tracking-widest hover:underline"
                >
                  + Add New
                </button>
              </div>
              <div className="space-y-4">
                {formData.paymentMethods.length > 0 ? (
                  formData.paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/10 group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold">{method.cardType} ending in {method.last4}</p>
                            {method.isDefault && (
                              <span className="px-2 py-0.5 rounded-md bg-neon-blue/10 text-neon-blue text-[10px] font-bold">DEFAULT</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 font-medium">Expires {method.expiry}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeCard(index)}
                        className="text-gray-500 hover:text-red-500 font-bold text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500 italic">No payment methods saved</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Personal Info' && (
            <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <h3 className="text-xl font-bold mb-8 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-neon-purple" />
                  Vehicle Information
                </span>
                <button className="text-xs text-neon-blue hover:underline uppercase tracking-widest font-bold">Manage All</button>
              </h3>
              <div className="space-y-4">
                {formData.vehicles.map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 flex items-center justify-center text-neon-purple group-hover:scale-110 transition-transform">
                        <Shield className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white">{vehicle.model}</p>
                        <p className="text-sm text-gray-500 font-medium">{vehicle.plateNumber} • {vehicle.color || 'N/A'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeVehicle(index)}
                      className="p-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setShowVehicleModal(true)}
                  className="w-full py-6 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 font-bold hover:border-neon-blue/50 hover:text-neon-blue hover:bg-neon-blue/5 transition-all flex items-center justify-center gap-2 group"
                >
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-neon-blue/20 transition-colors">+</span>
                  Add New Vehicle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm" onClick={() => setShowVehicleModal(false)} />
          <div className="relative w-full max-w-md bg-dark-lighter border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold mb-6 text-white">Add New Vehicle</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Model</label>
                <input 
                  type="text" 
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  placeholder="Tesla Model 3"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-neon-blue transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Plate Number</label>
                <input 
                  type="text" 
                  value={newVehicle.plateNumber}
                  onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
                  placeholder="ABC-1234"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-neon-blue transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Color</label>
                <input 
                  type="text" 
                  value={newVehicle.color}
                  onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                  placeholder="Midnight Blue"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-neon-blue transition-all"
                />
              </div>
              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => setShowVehicleModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={addVehicle}
                  className="flex-1 py-4 rounded-2xl bg-neon-gradient text-dark font-bold hover:opacity-90 transition-all"
                >
                  Add Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm" onClick={() => setShowCardModal(false)} />
          <div className="relative w-full max-w-md bg-dark-lighter border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold mb-6 text-white">Add New Card</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Card Type</label>
                <select 
                  value={newCard.cardType}
                  onChange={(e) => setNewCard({ ...newCard, cardType: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-neon-blue transition-all"
                >
                  <option value="Visa" className="bg-dark">Visa</option>
                  <option value="Mastercard" className="bg-dark">Mastercard</option>
                  <option value="Amex" className="bg-dark">American Express</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Card Number</label>
                <input 
                  type="text" 
                  maxLength="16"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                  placeholder="**** **** **** ****"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-neon-blue transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Expiry (MM/YY)</label>
                <input 
                  type="text" 
                  maxLength="5"
                  value={newCard.expiry}
                  onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-neon-blue transition-all"
                />
              </div>
              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => setShowCardModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={addCard}
                  className="flex-1 py-4 rounded-2xl bg-neon-gradient text-dark font-bold hover:opacity-90 transition-all"
                >
                  Save Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
