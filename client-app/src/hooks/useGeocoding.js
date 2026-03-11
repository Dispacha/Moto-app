import { useState } from 'react';

export function useGeocoding() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const geocodeAddress = React.useCallback(async (address) => {
    if (!address.trim()) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            'User-Agent': 'MotoApp/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur de géocodage');
      }

      const data = await response.json();

      if (data.length === 0) {
        throw new Error('Adresse non trouvée');
      }

      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name
      };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reverseGeocode = React.useCallback(async (lat, lng) => {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'MotoApp/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur de géocodage inverse');
      }

      const data = await response.json();
      if (!data || !data.display_name) {
        throw new Error('Adresse introuvable');
      }

      return {
        displayName: data.display_name
      };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { geocodeAddress, reverseGeocode, isLoading, error };
}