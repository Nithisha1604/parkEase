import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  googleLogin: (data) => API.post('/auth/google', data),
};

export const spotAPI = {
  getSpots: () => API.get('/spots'),
  getOwnerSpots: () => API.get('/spots/owner'),
  getOwnerStats: () => API.get('/spots/stats'),
  createSpot: (data) => API.post('/spots', data),
  updateSpot: (id, data) => API.put(`/spots/${id}`, data),
  deleteSpot: (id) => API.delete(`/spots/${id}`),
};

export const bookingAPI = {
  createBooking: (data) => API.post('/bookings', data),
  getUserBookings: () => API.get('/bookings/my-bookings'),
  getOwnerBookings: () => API.get('/bookings/owner'),
  cancelBooking: (id) => API.put(`/bookings/${id}/cancel`),
  completeBooking: (id) => API.put(`/bookings/${id}/complete`),
};

export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  addMoney: (amount) => API.post('/users/add-money', { amount }),
  getFavorites: () => API.get('/users/favorites'),
  toggleFavorite: (spotId) => API.post('/users/favorites/toggle', { spotId }),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getTransactions: () => API.get('/admin/transactions'),
  getPendingSpots: () => API.get('/admin/pending-spots'),
  getUsers: () => API.get('/admin/users'),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getSpots: () => API.get('/admin/spots'),
  approveSpot: (id) => API.put(`/admin/spots/${id}/approve`),
  rejectSpot: (id) => API.put(`/admin/spots/${id}/reject`),
};

export default API;
