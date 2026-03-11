const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  // Erreurs Prisma
  if (err.code && err.code.startsWith('P')) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({ message: 'Donnée déjà existante (conflit)' });
      case 'P2025':
        return res.status(404).json({ message: 'Ressource non trouvée' });
      default:
        return res.status(500).json({ message: 'Erreur de base de données' });
    }
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Token invalide' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expiré' });
  }

  // Erreurs de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  // Erreur par défaut
  res.status(500).json({ message: 'Erreur interne du serveur' });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };