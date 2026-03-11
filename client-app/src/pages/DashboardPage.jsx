import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import RideForm from '../components/RideForm';
import { useGeolocation } from '../hooks/useGeolocation';
import { useLocationStore, useRideStore } from '../stores';
import { rideService } from '../services/api';
import { subscribeToRideStatus, unsubscribeFromEvent } from '../services/socket';
import { MapPin, AlertCircle, CheckCircle, Clock, Loader } from 'lucide-react';

export default function DashboardPage() {
  const { isLoading: geoLoading, error: geoError } = useGeolocation();
  const { userLocation } = useLocationStore();
  const { currentRide } = useRideStore();
  const [recentRide, setRecentRide] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [isLoadingRide, setIsLoadingRide] = useState(false);

  useEffect(() => {
    fetchRecentRide();

    // Subscribe aux mises à jour Socket.IO
    const handleRideUpdate = (data) => {
      setRideStatus(data.status);
      setRecentRide((prev) => ({
        ...prev,
        status: data.status
      }));
    };

    subscribeToRideStatus(handleRideUpdate);

    return () => {
      unsubscribeFromEvent('ride-status-update');
    };
  }, []);

  const fetchRecentRide = async () => {
    try {
      const response = await rideService.getRides();
      if (response.data && response.data.length > 0) {
        setRecentRide(response.data[0]);
      }
    } catch (err) {
      console.error('Erreur fetch recent ride:', err);
    }
  };

  const handleRideCreated = () => {
    fetchRecentRide();
  };

  return (
    <div className="min-h-screen bg-neutral">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-primary to-red-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Bienvenue</h1>
          <p className="text-white text-opacity-90">
            Commandez une course en quelques secondes
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Messages d'erreur */}
        {geoError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-yellow-800 font-semibold">Géolocalisation</p>
              <p className="text-yellow-700 text-sm">{geoError}</p>
            </div>
          </div>
        )}

        {recentRide && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
            <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-blue-900 font-semibold">Course en cours</p>
              <p className="text-blue-800 text-sm">
                Statut : <span className="font-bold">{recentRide.status}</span>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche : Carte et formulaire */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Map
                pickup={userLocation}
                dropoff={recentRide ? {
                  lat: recentRide.dropoff_lat,
                  lng: recentRide.dropoff_lng
                } : null}
              />
            </div>

            {/* Informations de localisation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Votre position</p>
                    <p className="font-bold text-dark">
                      {userLocation ? `${userLocation.lat.toFixed(3)}°` : 'Localisation...'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Mise à jour automatique en continu
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conducteurs près</p>
                    <p className="font-bold text-dark">12 disponibles</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Dans un rayon de 2km
                </p>
              </div>
            </div>
          </div>

          {/* Colonne droite : Formulaire */}
          <div>
            <RideForm onRideCreated={handleRideCreated} />

            {/* Conseils */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-dark mb-4">💡 Conseils d'utilisation</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Activez la géolocalisation pour de meilleurs résultats</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Les conducteurs sont assignés automatiquement</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Vous recevrez une notification quand un conducteur accepte</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}