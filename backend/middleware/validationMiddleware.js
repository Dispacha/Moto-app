const validateRegisterUser = (req, res, next) => {
  const { name, phone, password, role } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ message: "Nom requis (minimum 2 caractères)" });
  }

  // Accept only Cameroon phone numbers
  const cleanPhone = phone?.replace(/\s/g, '') || '';
  if (!phone || typeof phone !== 'string' || !/^(\+237|237|0)[1-9]\d{7,8}$/.test(cleanPhone)) {
    return res.status(400).json({ message: "Numéro de téléphone camerounais valide requis (ex: +237699123456, 699123456)" });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: "Mot de passe requis (minimum 6 caractères)" });
  }

  if (!role || !['client', 'driver'].includes(role)) {
    return res.status(400).json({ message: "Rôle requis (client ou driver)" });
  }

  req.body.name = name.trim();
  req.body.phone = cleanPhone;
  next();
};

const validateLogin = (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone || typeof phone !== 'string') {
    return res.status(400).json({ message: "Numéro de téléphone requis" });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: "Mot de passe requis" });
  }

  req.body.phone = phone.replace(/\s/g, '');
  next();
};

const validateRideCreation = (req, res, next) => {
  const { pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, estimated_price } = req.body;

  if (typeof pickup_lat !== 'number' || pickup_lat < -90 || pickup_lat > 90) {
    return res.status(400).json({ message: "Latitude de départ invalide" });
  }

  if (typeof pickup_lng !== 'number' || pickup_lng < -180 || pickup_lng > 180) {
    return res.status(400).json({ message: "Longitude de départ invalide" });
  }

  if (typeof dropoff_lat !== 'number' || dropoff_lat < -90 || dropoff_lat > 90) {
    return res.status(400).json({ message: "Latitude d'arrivée invalide" });
  }

  if (typeof dropoff_lng !== 'number' || dropoff_lng < -180 || dropoff_lng > 180) {
    return res.status(400).json({ message: "Longitude d'arrivée invalide" });
  }

  if (estimated_price !== undefined && (typeof estimated_price !== 'number' || estimated_price < 0)) {
    return res.status(400).json({ message: "Prix estimé invalide" });
  }

  next();
};

const validateDriverRegistration = (req, res, next) => {
  const { car_model, license_plate } = req.body;

  if (!car_model || typeof car_model !== 'string' || car_model.trim().length < 2) {
    return res.status(400).json({ message: "Modèle de voiture requis" });
  }

  if (!license_plate || typeof license_plate !== 'string' || !/^[A-Z0-9]{4,8}$/.test(license_plate.toUpperCase())) {
    return res.status(400).json({ message: "Plaque d'immatriculation camerounaise valide requise (ex: AA-123-456)" });
  }

  req.body.car_model = car_model.trim();
  req.body.license_plate = license_plate.toUpperCase();
  next();
};

const validateDriverStatusUpdate = (req, res, next) => {
  const { is_available, latitude, longitude } = req.body;

  if (is_available !== undefined && typeof is_available !== 'boolean') {
    return res.status(400).json({ message: "Disponibilité doit être un booléen" });
  }

  if (latitude !== undefined && (typeof latitude !== 'number' || latitude < -90 || latitude > 90)) {
    return res.status(400).json({ message: "Latitude invalide" });
  }

  if (longitude !== undefined && (typeof longitude !== 'number' || longitude < -180 || longitude > 180)) {
    return res.status(400).json({ message: "Longitude invalide" });
  }

  if ((latitude !== undefined && longitude === undefined) || (latitude === undefined && longitude !== undefined)) {
    return res.status(400).json({ message: "Latitude et longitude doivent être fournies ensemble" });
  }

  next();
};

const validateCourseCreation = (req, res, next) => {
  const { depart, arrivee } = req.body;

  if (!depart || typeof depart !== 'string' || depart.trim().length < 3) {
    return res.status(400).json({ message: "Adresse de départ requise (minimum 3 caractères)" });
  }

  if (!arrivee || typeof arrivee !== 'string' || arrivee.trim().length < 3) {
    return res.status(400).json({ message: "Adresse d'arrivée requise (minimum 3 caractères)" });
  }

  req.body.depart = depart.trim();
  req.body.arrivee = arrivee.trim();
  next();
};

module.exports = {
  validateRegisterUser,
  validateLogin,
  validateRideCreation,
  validateDriverRegistration,
  validateDriverStatusUpdate,
  validateCourseCreation
};