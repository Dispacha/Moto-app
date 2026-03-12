const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token mal formé' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, payload) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = payload;
    next();
  });
};

// Vérifier que l'utilisateur est admin
const verifyAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Token manquant" });
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Accès refusé" });
  next();
};

module.exports = { verifyToken, verifyAdmin };