import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { authService } from '../services/api';
import { User, Mail, Phone, MapPin, LogOut, AlertCircle, Loader } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userData, setUserData] = useState(user || {});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authService.getCurrentUser();
        setUserData(response.data);
        setUser(response.data);
      } catch (err) {
        setError('Erreur lors du chargement du profil');
        console.error('Profile fetch error:', err);
      }
    };

    if (!userData.id) {
      fetchUserData();
    }
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      logout();
      navigate('/login');
    } catch (err) {
      setError('Erreur lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-primary text-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <User size={48} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userData.name || 'Utilisateur'}</h1>
              <p className="text-orange-100 capitalize">
                {userData.role === 'driver' ? 'Chauffeur' : 'Passager'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-dark mb-6">Informations personnelles</h2>

          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
            <div className="flex items-center gap-3 p-3 bg-neutral-light rounded-lg">
              <User size={20} className="text-gray-500" />
              <p className="text-gray-800">{userData.name}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
            <div className="flex items-center gap-3 p-3 bg-neutral-light rounded-lg">
              <Phone size={20} className="text-gray-500" />
              <p className="text-gray-800">{userData.phone}</p>
            </div>
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rôle</label>
            <div className="flex items-center gap-3 p-3 bg-neutral-light rounded-lg">
              <MapPin size={20} className="text-gray-500" />
              <p className="text-gray-800 capitalize">
                {userData.role === 'driver' ? 'Chauffeur de moto' : 'Passager'}
              </p>
            </div>
          </div>

          {/* ID du compte */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">ID du compte</label>
            <div className="flex items-center gap-3 p-3 bg-neutral-light rounded-lg">
              <Mail size={20} className="text-gray-500" />
              <p className="text-gray-600 text-sm font-mono">{userData.id}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            disabled={isLoading}
          >
            Retour à l'accueil
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Déconnexion...
              </>
            ) : (
              <>
                <LogOut size={20} />
                Déconnexion
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}