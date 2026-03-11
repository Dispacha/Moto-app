import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token, isAuthenticated: !!token });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));

export const useRideStore = create((set) => ({
  rides: [],
  currentRide: null,
  
  setRides: (rides) => set({ rides }),
  setCurrentRide: (ride) => set({ currentRide: ride }),
  addRide: (ride) => set((state) => ({ rides: [ride, ...state.rides] })),
}));

export const useLocationStore = create((set) => ({
  userLocation: null,
  mapCenter: { lat: 3.8667, lng: 11.5167 }, // Yaoundé, Cameroun par défaut
  
  setUserLocation: (location) => set({ userLocation: location }),
  setMapCenter: (center) => set({ mapCenter: center }),
}));