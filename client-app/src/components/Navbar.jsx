import React, { useEffect } from 'react';
import { useAuthStore } from '../stores';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, Home, History, Settings } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-dark hidden sm:inline">MotoApp</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
            >
              <Home size={20} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
            >
              <History size={20} />
              <span>Historique</span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
            >
              <Settings size={20} />
              <span>Profil</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => {
                navigate('/');
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate('/history');
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Historique
            </button>
            <button
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Profil
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-primary hover:bg-gray-100 rounded"
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}