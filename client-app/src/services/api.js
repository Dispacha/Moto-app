import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Ajouter le token aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion des erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await api.post('/auth/refresh');
        const newToken = refreshResponse.data.token;
        
        localStorage.setItem('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  register: (name, phone, password, role) =>
    api.post('/users/register', { name, phone, password, role }),
  login: (phone, password) =>
    api.post('/users/login', { phone, password }),
  getCurrentUser: () =>
    api.get('/users/me'),
  logout: () =>
    api.post('/auth/logout'),
  refreshToken: () =>
    api.post('/auth/refresh'),
};

export const rideService = {
  createRide: (pickupLat, pickupLng, dropoffLat, dropoffLng, estimatedPrice) =>
    api.post('/rides', {
      pickup_lat: pickupLat,
      pickup_lng: pickupLng,
      dropoff_lat: dropoffLat,
      dropoff_lng: dropoffLng,
      estimated_price: estimatedPrice,
    }),
  getRides: () =>
    api.get('/rides'),
  getRideDetails: (rideId) =>
    api.get(`/rides/${rideId}`),
  updateRideStatus: (rideId, status) =>
    api.patch(`/rides/${rideId}/status`, { status }),
};

export const driverService = {
  registerDriver: (carModel, licensePlate) =>
    api.post('/drivers/register', { car_model: carModel, license_plate: licensePlate }),
  getDriverProfile: () =>
    api.get('/drivers/profile'),
  updateDriverStatus: (isAvailable, latitude, longitude) =>
    api.patch('/drivers/status', { is_available: isAvailable, latitude, longitude }),
};

export default api;