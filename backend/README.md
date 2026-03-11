# Backend API - Application de Mise en Relation Client-Moto

API REST complète pour une application de mise en relation entre clients et conducteurs de moto-taxi, utilisant Prisma ORM et Socket.IO pour les communications temps réel.

## 🚀 Technologies utilisées

- **Node.js** avec **Express.js**
- **Prisma ORM** pour la gestion de base de données
- **MySQL** comme base de données
- **Socket.IO** pour les communications temps réel
- **JWT** pour l'authentification
- **bcrypt** pour le hashage des mots de passe

## 📋 Prérequis

- Node.js (v16+)
- MySQL (v8+)
- npm ou yarn

## 🛠️ Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de la base de données**
   - Créer une base de données MySQL nommée `moto_app`
   - Modifier le fichier `.env` avec vos paramètres de base de données

4. **Configuration Prisma**
   ```bash
   npm run prisma:generate
   npm run prisma:db:push
   ```

5. **Démarrer le serveur**
   ```bash
   npm start
   # ou en mode développement
   npm run dev
   ```

## 🔧 Scripts disponibles

- `npm start` - Démarre le serveur en production
- `npm run dev` - Démarre le serveur en mode développement avec nodemon
- `npm run prisma:generate` - Génère le client Prisma
- `npm run prisma:db:push` - Synchronise le schéma avec la base de données
- `npm run prisma:migrate` - Crée et applique des migrations
- `npm run prisma:studio` - Ouvre Prisma Studio (interface graphique)

## 📚 API Endpoints

### 🔐 Authentification

#### POST `/api/users/register`
Inscription d'un nouvel utilisateur.

**Body:**
```json
{
  "name": "Ahmadou Bello",
  "phone": "+237699123456",
  "password": "password123",
  "role": "client" // ou "driver"
}
```

#### POST `/api/users/login`
Connexion utilisateur.

**Body:**
```json
{
  "phone": "+237699123456",
  "password": "password123"
}
```

#### GET `/api/users/me`
Récupère les informations de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer <token>
```

#### POST `/api/auth/refresh`
Rafraîchit le token d'accès.

#### POST `/api/auth/logout`
Déconnecte l'utilisateur.

### 👤 Gestion des conducteurs

#### POST `/api/drivers/register`
Enregistre un profil de conducteur.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "car_model": "Honda CB 500",
  "license_plate": "CM-123456"
}
```

#### GET `/api/drivers/profile`
Récupère le profil du conducteur connecté.

#### PATCH `/api/drivers/status`
Met à jour la disponibilité et la localisation du conducteur.

**Body:**
```json
{
  "is_available": true,
  "latitude": 48.8566,
  "longitude": 2.3522
}
```

### 🚗 Gestion des courses (trajets)

#### POST `/api/rides`
Crée une nouvelle course.

**Body:**
```json
{
  "pickup_lat": 48.8566,
  "pickup_lng": 2.3522,
  "dropoff_lat": 48.8606,
  "dropoff_lng": 2.3376,
  "estimated_price": 15.50
}
```

#### GET `/api/rides`
Liste les courses du client connecté.

#### GET `/api/rides/:ride_id`
Détails d'une course spécifique.

#### PATCH `/api/rides/:ride_id/status`
Met à jour le statut d'une course.

**Body:**
```json
{
  "status": "in_progress" // waiting, assigned, in_progress, completed, cancelled
}
```

### 📍 Gestion des courses (adresses)

#### POST `/api/courses/create`
Crée une course basée sur des adresses textuelles.

**Body:**
```json
{
  "depart": "123 Rue de la Paix, Paris",
  "arrivee": "456 Avenue des Champs-Élysées, Paris"
}
```

### 🏥 Health Check

#### GET `/health`
Vérifie l'état du serveur.

## 🔌 Socket.IO Events

### Événements client → serveur

#### `join`
Rejoindre une room personnelle.
```javascript
socket.emit('join', userId);
```

#### `join-drivers`
Rejoindre la room des conducteurs.
```javascript
socket.emit('join-drivers');
```

### Événements serveur → client

#### `new-ride`
Nouvelle course assignée à un conducteur.
```javascript
{
  ride: {
    id: 1,
    client: { name: "Jean", phone: "+237699123456" },
    pickup: { lat: 3.8480, lng: 11.5021 },
    dropoff: { lat: 3.8667, lng: 11.5167 },
    price: 5000
  }
}
```

#### `new-ride-available`
Nouvelle course disponible pour tous les conducteurs.

#### `ride-status-update`
Mise à jour du statut d'une course.
```javascript
{
  rideId: 1,
  status: "in_progress",
  driver: { name: "Marie", phone: "+237698765432", carModel: "Honda CB 500" }
}
```

## 🔒 Sécurité

- **JWT Authentication** : Tokens d'accès et de rafraîchissement
- **Password Hashing** : Utilisation de bcrypt
- **Input Validation** : Validation des données entrantes
- **CORS** : Configuration CORS appropriée
- **Rate Limiting** : À implémenter selon les besoins

## 📊 Base de données

### Schéma Prisma

Le schéma définit 5 modèles principaux :
- `User` : Utilisateurs (clients et conducteurs)
- `Driver` : Profils des conducteurs
- `Ride` : Courses avec géolocalisation
- `Course` : Courses textuelles
- `RefreshToken` : Gestion des tokens de rafraîchissement

### Relations

- Un `User` peut avoir un `Driver`
- Un `User` peut créer plusieurs `Ride` et `Course`
- Un `Driver` peut être assigné à plusieurs `Ride` et `Course`

## 🧪 Tests

À implémenter avec Jest et Supertest.

## 📝 Logs

Les logs sont affichés dans la console avec :
- Requêtes HTTP entrantes
- Connexions Socket.IO
- Erreurs de base de données
- Messages de succès

## 🚀 Déploiement

1. Configurer les variables d'environnement de production
2. Générer le client Prisma : `npm run prisma:generate`
3. Synchroniser la base de données : `npm run prisma:db:push`
4. Démarrer le serveur : `npm start`

## 📞 Support

Pour toute question ou problème, veuillez contacter l'équipe de développement.