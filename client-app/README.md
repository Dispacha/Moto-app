# MotoApp - Application Client React

Interface client moderne et professionnelle pour l'application de mise en relation client-moto, construite avec React, Vite et Tailwind CSS.

## 🚀 Fonctionnalités

- **Authentification sécurisée** : Inscription et connexion avec JWT
- **Géolocalisation en temps réel** : Suivi continu de la position utilisateur
- **Carte interactive** : Affichage des positions avec Leaflet
- **Formulaire de réservation** : Interface intuitive pour commander une course
- **Historique des courses** : Consultez vos trajets précédents
- **Notifications en temps réel** : Mises à jour instantanées via Socket.IO
- **Design professionnel** : Interface moderne et élégante avec Tailwind CSS
- **Responsive** : Compatible mobile, tablette et desktop

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la version construite
npm run preview
```

## 🏗️ Structure du projet

```
src/
├── components/         # Composants réutilisables
│   ├── Navbar.jsx     # Barre de navigation
│   ├── Map.jsx        # Composant carte
│   ├── RideForm.jsx   # Formulaire de course
│   └── RideHistory.jsx # Historique des courses
├── pages/             # Pages principales
│   ├── LoginPage.jsx  # Page de connexion/inscription
│   └── DashboardPage.jsx # Dashboard principal
├── services/          # Services et API
│   ├── api.js         # Clients Axios pour les appels API
│   └── socket.js      # Configuration Socket.IO
├── stores/            # État global (Zustand)
│   └── index.js       # Stores d'authentification et localisation
├── hooks/             # Hooks personnalisés
│   └── useGeolocation.js # Hook de géolocalisation
├── utils/             # Utilitaires
├── App.jsx            # Composant principal avec routage
├── main.jsx           # Point d'entrée React
└── index.css          # Styles globaux avec Tailwind
```

## 🎨 Design et Couleurs

- **Primaire** : #FF6B35 (Orange brillant)
- **Secondaire** : #004E89 (Bleu marine)
- **Accent** : #1FA24F (Vert)
- **Neutre** : #F5F7FA (Gris clair)
- **Dark** : #1B1F3A (Gris foncé)

## 📱 Pages disponibles

### `/login`
Page d'authentification avec :
- Toggle entre inscription et connexion
- Validation des formulaires
- Sélection du rôle (client/conducteur)
- Affichage des erreurs

### `/` (Dashboard)
Page principale avec :
- Carte interactive avec géolocalisation
- Formulaire de réservation de course
- Informations de localisation
- Conseils d'utilisation
- Affichage de la course en cours

### `/history`
Historique des courses avec :
- Liste de tous les trajets
- Affichage du statut
- Détails des coordonnées
- Montants et dates
- Options de renouvellement

## 🗄️ État Global (Zustand)

### `useAuthStore`
- `user` : Informations utilisateur
- `token` : JWT token
- `isAuthenticated` : Statut d'authentification
- Méthodes : `setUser`, `setToken`, `logout`

### `useRideStore`
- `rides` : Liste des courses
- `currentRide` : Course actuelle
- Méthodes : `setRides`, `setCurrentRide`, `addRide`

### `useLocationStore`
- `userLocation` : Position actuelle
- `mapCenter` : Centre de la carte
- Méthodes : `setUserLocation`, `setMapCenter`

## 🔌 Socket.IO

### Événements reçus
- `new-ride` : Nouvelle course assignée
- `ride-status-update` : Mise à jour du statut

### Événements envoyés
- `join` : Rejoindre la room utilisateur
- `join-drivers` : Rejoindre la room conducteurs

## 🔐 Authentification

Les tokens JWT sont stockés dans `localStorage` et envoyés automatiquement avec chaque requête API via les intercepteurs Axios.

## 🗺️ Géolocalisation

La géolocalisation est gérée par le hook `useGeolocation` qui :
- Demande la permission utilisateur
- Met à jour la position en continu
- Gère les erreurs gracieusement
- Utilise Nominatim (OpenStreetMap) pour le reverse geocoding

## 🔧 Configuration

Modifier les paramètres dans :
- [`vite.config.js`](vite.config.js) - Configuration Vite
- [`tailwind.config.js`](tailwind.config.js) - Couleurs et thème
- `src/services/api.js` - URL de l'API (défaut: `http://localhost:5000/api`)

## 📱 Responsive Design

L'application utilise Tailwind CSS pour être entièrement responsive :
- Mobile : < 640px
- Tablet : 640px - 1024px
- Desktop : > 1024px

## 🚀 Déploiement

```bash
# Construire la version optimisée
npm run build

# Le dossier dist contient les fichiers prêts pour le déploiement
# À déployer sur un serveur web (Vercel, Netlify, AWS, etc.)
```

## 📚 Dépendances principales

- **React 18** : Framework UI
- **Vite** : Build tool et dev server
- **Tailwind CSS** : Framework CSS utilitaire
- **React Router** : Navigation entre les pages
- **Axios** : Client HTTP
- **Socket.IO** : Communications temps réel
- **Leaflet** : Cartes interactives
- **Zustand** : Gestion d'état
- **Lucide React** : Icônes

## 📝 Notes

- L'application requiert le backend MotoApp en fonctionnement
- La géolocalisation nécessite HTTPS en production
- Les navigateurs doivent supporter l'API Geolocation

## 🤝 Support

Pour toute question ou problème, contactez l'équipe de développement.