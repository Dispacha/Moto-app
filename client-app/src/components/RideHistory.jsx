import React, { useState, useEffect } from 'react';
import { Clock, MapPin, DollarSign, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { rideService } from '../services/api';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusConfig = {
  waiting: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  assigned: { label: 'Conducteur assigné', color: 'bg-blue-100 text-blue-800', icon: Loader },
  in_progress: { label: 'En cours', color: 'bg-purple-100 text-purple-800', icon: Loader },
  completed: { label: 'Complétée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      setIsLoading(true);
      const response = await rideService.getRides();
      setRides(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des courses');
      console.error('Erreur fetch rides:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-dark mb-8">Historique de vos courses</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {rides.length === 0 ? (
        <div className="text-center py-16 bg-neutral rounded-lg">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-semibold mb-2">Aucune course trouvée</p>
          <p className="text-gray-500">Commencez par commander votre première course !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => {
            const config = statusConfig[ride.status] || statusConfig.waiting;
            const StatusIcon = config.icon;

            return (
              <div
                key={ride.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-primary"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Statut et date */}
                  <div className="flex items-start gap-3">
                    <StatusIcon size={24} className={`text-primary flex-shrink-0`} />
                    <div>
                      <p className={`text-sm font-bold px-3 py-1 rounded-full ${config.color} w-fit`}>
                        {config.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(ride.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* De - À */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <MapPin size={16} className="text-white" />
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">Départ</p>
                        <p className="font-semibold text-dark">
                          {ride.pickup_lat?.toFixed(4)}, {ride.pickup_lng?.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        <MapPin size={16} className="text-white" />
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">Arrivée</p>
                        <p className="font-semibold text-dark">
                          {ride.dropoff_lat?.toFixed(4)}, {ride.dropoff_lng?.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="flex items-center gap-3">
                    <DollarSign size={24} className="text-primary flex-shrink-0" />
                    <div>
                      <p className="text-gray-600 text-sm">Montant</p>
                      <p className="text-2xl font-bold text-dark">€{ride.price?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 justify-center">
                    <button className="px-4 py-2 text-sm font-semibold text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition">
                      Détails
                    </button>
                    {ride.status === 'completed' && (
                      <button className="px-4 py-2 text-sm font-semibold text-secondary bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                        Renouveler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}