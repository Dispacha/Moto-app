import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { authService } from '../services/api';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { setUser, setToken } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await authService.login(formData.phone, formData.password);
        setToken(response.data.token);
        setUser(response.data.user);
        navigate('/');
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Les mots de passe ne correspondent pas');
        }
        
        const response = await authService.register(
          formData.name,
          formData.phone,
          formData.password,
          formData.role
        );
        
        // Auto-login après inscription
        const loginResponse = await authService.login(formData.phone, formData.password);
        setToken(loginResponse.data.token);
        setUser(loginResponse.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-primary font-bold text-3xl">M</span>
          </div>
        </div>

        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">MotoApp</h1>
          <p className="text-white text-opacity-90">
            {isLogin ? 'Connectez-vous' : 'Créez votre compte'}
          </p>
        </div>

        {/* Carte de formulaire */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom (inscription uniquement) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jean Nkomo"
                  required={!isLogin}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary outline-none transition"
                />
              </div>
            )}

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+237699123456"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary outline-none transition"
              />
            </div>

            {/* Rôle (inscription uniquement) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Je suis
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary outline-none transition"
                >
                  <option value="client">Client</option>
                  <option value="driver">Conducteur</option>
                </select>
              </div>
            )}

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirmation mot de passe (inscription) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required={!isLogin}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-red-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading
                ? 'Chargement...'
                : isLogin
                ? 'Se connecter'
                : 'Créer mon compte'}
            </button>
          </form>

          {/* Basculer entre login et register */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? 'Pas encore inscrit ?' : 'Déjà inscrit ?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline"
              >
                {isLogin ? "S'inscrire" : 'Se connecter'}
              </button>
            </p>
          </div>
        </div>

        {/* Disclamer */}
        <p className="text-center text-white text-opacity-75 text-sm mt-6">
          En utilisant MotoApp, vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  );
}