import React, { useState } from 'react';
import { MapPin, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { rideService } from '../services/api';
import { useLocationStore, useRideStore } from '../stores';
import { useGeocoding } from '../hooks/useGeocoding';

export default function RideForm({ onRideCreated }) {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { userLocation } = useLocationStore();
  const { addRide } = useRideStore();
  const { geocodeAddress, reverseGeocode, isLoading: geocodingLoading } = useGeocoding();

  // Met à jour automatiquement l'adresse de départ lorsque la position change
  React.useEffect(() => {
    if (userLocation) {
      // reverse geocode to human-readable address
      reverseGeocode(userLocation.lat, userLocation.lng)
        .then((res) => {
          if (res && res.displayName) {
            setPickupAddress(res.displayName);
          } else {
            setPickupAddress(`${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`);
          }
        })
        .catch(() => {
          setPickupAddress(`${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`);
        });
    }
  }, [userLocation, reverseGeocode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!userLocation) {
        throw new Error('Géolocalisation non disponible');
      }

      if (!dropoffAddress.trim()) {
        throw new Error('Veuillez entrer une destination');
      }

      if (!estimatedPrice || parseFloat(estimatedPrice) <= 0) {
        throw new Error('Veuillez entrer un prix estimé valide');
      }

      // Géocoder la destination réelle
      const dropoffLocation = await geocodeAddress(dropoffAddress);
      if (!dropoffLocation) {
        throw new Error('Destination non trouvée. Veuillez vérifier l\'adresse');
      }

      const response = await rideService.createRide(
        userLocation.lat,
        userLocation.lng,
        dropoffLocation.lat,
        dropoffLocation.lng,
        parseFloat(estimatedPrice)
      );

      addRide(response.data);
      onRideCreated?.();

      // Réinitialiser le formulaire
      setPickupAddress('');
      setDropoffAddress('');
      setEstimatedPrice('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Erreur création course:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-dark mb-6">Commander une course</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Point de départ */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">
            Point de départ
          </label>
          <div className="flex items-center gap-3 p-3 bg-neutral rounded-lg">
            <MapPin size={20} className="text-primary flex-shrink-0" />
            <input
              type="text"
              placeholder="Localisation en cours..."
              value={pickupAddress || ''}
              disabled
              className="flex-1 bg-neutral text-gray-600 text-sm outline-none"
            />
          </div>
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="dropoff-input" className="block text-sm font-semibold text-dark mb-2">
            Destination <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg focus-within:border-primary transition">
            <MapPin size={20} className="text-primary flex-shrink-0" aria-hidden="true" />
            <input
              id="dropoff-input"
              type="text"
              placeholder="Où allez-vous ?"
              value={dropoffAddress}
              onChange={(e) => setDropoffAddress(e.target.value)}
              className="flex-1 bg-transparent text-dark text-sm outline-none placeholder-gray-400"
              aria-label="Destination"
              aria-required="true"
              required
            />
          </div>
        </div>

        {/* Prix estimé */}
        <div>
          <label htmlFor="price-input" className="block text-sm font-semibold text-dark mb-2">
            Prix estimé (FCFA, optionnel)
          </label>
          <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg focus-within:border-primary transition">
            <DollarSign size={20} className="text-primary flex-shrink-0" aria-hidden="true" />
            <input
              id="price-input"
              type="number"
              placeholder="Budget (FCFA)"
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(e.target.value)}
              min="0"
              step="100"
              className="flex-1 bg-transparent text-dark text-sm outline-none placeholder-gray-400"
              aria-label="Prix estimé en FCFA"
            />
          </div>
        </div>

        {/* Informations estimées */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <div className="flex gap-2 items-start">
            <Clock size={16} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Temps estimé</p>
              <p className="text-blue-800">Environ 10-15 minutes</p>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-red-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Recherche d\'un conducteur...' : 'Demander une course'}
        </button>
      </form>

      {/* Information supplémentaire */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Vos données de localisation sont utilisées uniquement pour trouver un conducteur proche
      </p>
    </div>
  );
}