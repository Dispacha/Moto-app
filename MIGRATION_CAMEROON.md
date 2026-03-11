# Migration de Format Français vers Camerounais - MotoApp

## 📱 Vue d'ensemble de la migration

Ce document résume tous les changements effectués pour migrer le projet **MotoApp** d'un format de validation téléphonique français vers un format **camerounais**.

---

## 🔄 Changements effectués

### 1. **Backend - Validation des numéros de téléphone**
**Fichier**: `backend/middleware/validationMiddleware.js`

#### Avant (Format Français):
```regex
/^(\+33|0)[1-9](\d{2}){4}$/
// Accepte: +33 ou 0, suivi de [1-9], puis 4 paires de chiffres
// Exemples: +33612345678, 0612345678
```

#### Après (Format Camerounais):
```regex
/^(\+237|237|0)[1-9]\d{7,8}$/
// Accepte: +237, 237, ou 0, suivi de [1-9], puis 7-8 chiffres
// Exemples: +237699123456, 237699123456, 0699123456
```

**Message d'erreur**:
- Avant: "Numéro de téléphone français valide requis"
- Après: "Numéro de téléphone camerounais valide requis (ex: +237699123456 ou 0699123456)"

---

### 2. **Backend - Validation des plaques d'immatriculation**
**Fichier**: `backend/middleware/validationMiddleware.js`

#### Avant (Format Français):
```regex
/^[A-Z]{2}-\d{3}-[A-Z]{2}$/
// Accepte: AB-123-CD
// Exemple: AB-123-CD
```

#### Après (Format Camerounais):
```regex
/^[A-Z0-9]{4,8}$/
// Accepte: 4-8 caractères alphanumériques
// Exemples: CM123456, AA123456
```

**Message d'erreur**:
- Avant: "Plaque d'immatriculation française valide requise (ex: AB-123-CD)"
- Après: "Plaque d'immatriculation camerounaise valide requise (ex: AA-123-456)"

---

### 3. **Backend - Documentation API**
**Fichier**: `backend/README.md`

#### Exemples mis à jour:

**Exemple 1 - Inscription Client**:
```json
// Avant
{
  "name": "John Doe",
  "phone": "+33123456789",
  "password": "password123",
  "role": "client"
}

// Après
{
  "name": "Ahmadou Bello",
  "phone": "+237699123456",
  "password": "password123",
  "role": "client"
}
```

**Exemple 2 - Modèle de conducteur**:
```json
// Avant
{
  "car_model": "Yamaha MT-07",
  "license_plate": "AB-123-CD"
}

// Après
{
  "car_model": "Honda CB 500",
  "license_plate": "CM-123456"
}
```

**Exemple 3 - Événement Socket.IO (new-ride)**:
```javascript
// Avant
{
  ride: {
    id: 1,
    client: { name: "John", phone: "+33123456789" },
    pickup: { lat: 48.8566, lng: 2.3522 },
    dropoff: { lat: 48.8606, lng: 2.3376 },
    price: 15.50
  }
}

// Après
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

---

### 4. **Backend - Collection Postman**
**Fichier**: `backend/postman_collection.json`

Tous les exemples d'appels API ont été mis à jour :

#### Requête Register:
```json
// Avant
"phone": "0600000002"

// Après
"phone": "0699123456"
```

#### Requête Login:
```json
// Avant
"phone": "0600000002"

// Après
"phone": "0699123456"
```

---

### 5. **Racine - Documentation principale**
**Fichier**: `README.md`

Tous les exemples `curl` ont été mis à jour :

```bash
# Avant
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Client Test","phone":"0600000002","password":"password","role":"client"}' \
  http://localhost:5000/api/users/register

# Après
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Client Test","phone":"0699123456","password":"password","role":"client"}' \
  http://localhost:5000/api/users/register
```

---

### 6. **Frontend - Placeholder formulaire de connexion**
**Fichier**: `client-app/src/pages/LoginPage.jsx`

#### Champ "Nom":
```jsx
// Avant
placeholder="John Doe"

// Après
placeholder="Jean Nkomo"
```

#### Champ "Téléphone":
```jsx
// Avant
placeholder="+33612345678"

// Après
placeholder="+237699123456"
```

---

## 📞 Formats de numéros camerounais acceptés

Le système accepte les trois formats suivants :

### Format international
```
+237 6XXXXXXXX  (ex: +237699123456)
+237 2XXXXXXX   (ex: +237298765432)
```

### Format national (avec code pays)
```
237 6XXXXXXXX   (ex: 237699123456)
237 2XXXXXXX    (ex: 237298765432)
```

### Format local (avec 0)
```
0 6XXXXXXXX     (ex: 0699123456)
0 2XXXXXXX      (ex: 0298765432)
```

### Explications:
- **+237 ou 237**: Code pays du Cameroun
- **0**: Préfixe utilisé pour les numéros locaux
- **6 ou 2**: Premier chiffre du numéro (6 pour mobile, 2 pour fixe)
- **7-8 chiffres supplémentaires**: Le reste du numéro

---

## 🏍️ Formats de plaques camerounaises acceptées

Le système accepte les formats suivants :

```
4-8 caractères alphanumériques
Exemples: CM123456, AA123456, CAM12345
```

---

## 🧪 Tests recommandés

Après la migration, testez les scénarios suivants :

### 1. Inscription avec formats de numéros valides
```bash
# Format international
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"+237699123456","password":"password123","role":"client"}'

# Format national
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"237699123456","password":"password123","role":"client"}'

# Format local
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"0699123456","password":"password123","role":"client"}'
```

### 2. Tests d'erreurs - Numéros invalides
```bash
# Numéro français (doit échouer)
{"phone":"+33612345678"}

# Longueur incorrecte (doit échouer)
{"phone":"+2376991"}

# Format incorrect (doit échouer)
{"phone":"069912345678"}
```

### 3. Enregistrement d'un conducteur
```bash
curl -X POST http://localhost:5000/api/drivers/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"car_model":"Honda CB 500","license_plate":"CM123456"}'
```

---

## 📋 Résumé des fichiers modifiés

| Fichier | Type de modification | Description |
|---------|---------------------|------------|
| `backend/middleware/validationMiddleware.js` | Validation | Regex téléphone et plaque d'immatriculation |
| `backend/README.md` | Documentation | Exemples d'API avec numéros camerounais |
| `backend/postman_collection.json` | Tests | Données de test mises à jour |
| `README.md` | Documentation | Exemples curl mis à jour |
| `client-app/src/pages/LoginPage.jsx` | UI/UX | Placeholders du formulaire |

---

## ✅ Vérification post-migration

- [x] Validation des numéros camerounais
- [x] Validation des plaques camerounaises
- [x] Documentation mise à jour
- [x] Exemples Postman mis à jour
- [x] Frontend avec placeholders camerounais
- [x] Messages d'erreur en français mentionnant "camerounais"

---

## 🚀 Déploiement

Aucune modification de base de données n'est nécessaire. La migration est entièrement au niveau de la validation. Les numéros de téléphone existants resteront stockés sans changement.

---

## 📝 Notes

- Les numéros stockés en base de données ne sont pas modifiés
- La validation s'effectue uniquement lors de l'inscription/connexion
- Les espaces dans les numéros sont automatiquement supprimés
- Les messages d'erreur sont en français avec contexte camerounais

---

**Date de migration**: 2026-03-09  
**Version**: 1.0  
**Statut**: ✅ Complété
