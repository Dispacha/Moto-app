**Moto App - Backend README**

Résumé
- Backend Express + MySQL
- Endpoints principaux: users, drivers, rides/courses, auth (refresh/logout)
- JWT access token (short-lived) + refresh token (stored server-side + HttpOnly cookie)

Prérequis
- Node.js 18+ (tests faits avec Node 24)
- MySQL local en écoute

Installation

```powershell
cd backend
npm install
# (si nécessaire) npm install cookie-parser
node server.js
```

Variables d'environnement utiles (.env)
- JWT_SECRET (par défaut "secret")
- ACCESS_EXPIRES (par ex. "1h")
- REFRESH_DAYS (par ex. "7")

Endpoints & exemples curl

1) Register
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Client Test","phone":"0699123456","password":"password","role":"client"}' \
  http://localhost:5000/api/users/register
```

2) Login (sets refresh cookie, returns access token)
```bash
curl -i -X POST -H "Content-Type: application/json" \
  -d '{"phone":"0699123456","password":"password"}' \
  http://localhost:5000/api/users/login
```

3) Use access token for protected request
```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"depart":"Point A","arrivee":"Point B"}' \
  http://localhost:5000/api/courses/create
```

4) Refresh access token (browser will send the HttpOnly cookie automatically). Example using curl with cookie extracted from login response:
```bash
curl -X POST -H "Content-Type: application/json" -b "refreshToken=<TOKEN_FROM_COOKIE>" \
  http://localhost:5000/api/auth/refresh
```

5) Logout (revoke refresh token)
```bash
curl -X POST -H "Content-Type: application/json" -b "refreshToken=<TOKEN_FROM_COOKIE>" \
  http://localhost:5000/api/auth/logout
```

Postman
- La collection d'exemples est dans `backend/postman_collection.json`.

Client example
- Un exemple d'implémentation client (Axios) avec interception et rafraîchissement automatique est dans `backend/examples/axiosClient.js`.

Prochaine étape
- Intégrer HTTPS en production et sécuriser `secure: true` pour les cookies.
- Ajouter tests automatisés si nécessaire.
