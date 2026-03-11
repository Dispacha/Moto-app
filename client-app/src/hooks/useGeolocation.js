import { useEffect, useState } from 'react';
import { useLocationStore } from '../stores';

export const useGeolocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUserLocation, setMapCenter } = useLocationStore();

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapCenter({ lat: latitude, lng: longitude });
        setIsLoading(false);
      },
      (error) => {
        console.error('Erreur géolocalisation:', error);
        setError(error.message);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [setUserLocation, setMapCenter]);

  return { isLoading, error };
};

export const useReverseGeocoding = async (lat, lng) => {
  try {
    // Utiliser OpenStreetMap Nominatim (gratuit, pas de clé requise)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.address?.road || data.address?.name || 'Adresse inconnue';
  } catch (error) {
    console.error('Erreur reverse geocoding:', error);
    return 'Adresse inconnue';
  }
};

export const useGeocoding = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Erreur geocoding:', error);
    return null;
  }
};