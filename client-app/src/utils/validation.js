// Regex patterns for form validation
export const VALIDATION_PATTERNS = {
  // French phone: +33 6 xx xx xx xx or 06 xx xx xx xx
  // Also supports Cameroon: +237 6 xx xx xx xx or 06 xx xx xx xx
  PHONE_FR: /^(\+33|33|0)[1-9](?:[0-9]{8})|(\+237|237|0)[1-9](?:[0-9]{7,8})$/,
  // License plate: XX-123-AB or XY123AB
  LICENSE_PLATE: /^[A-Z]{2}-\d{3}-[A-Z]{2}$/i,
  // Email
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const validatePhone = (phone) => {
  if (!phone) return { valid: false, message: 'Téléphone requis' };
  
  const cleanPhone = phone.replace(/\s/g, '');
  if (!VALIDATION_PATTERNS.PHONE_FR.test(cleanPhone)) {
    return {
      valid: false,
      message: 'Format: +33 6 xx xx xx xx, 06 xx xx xx xx, +237 6 xx xx xx xx'
    };
  }
  return { valid: true, message: '' };
};

export const validateLicensePlate = (plate) => {
  if (!plate) return { valid: false, message: 'Plaque d\'immatriculation requise' };
  
  const cleanPlate = plate.replace(/\s/g, '').toUpperCase();
  if (!VALIDATION_PATTERNS.LICENSE_PLATE.test(cleanPlate)) {
    return {
      valid: false,
      message: 'Format: XX-123-AB'
    };
  }
  return { valid: true, message: '' };
};

export const validatePrice = (price) => {
  if (!price) return { valid: false, message: 'Prix requis' };
  
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    return {
      valid: false,
      message: 'Le prix doit être supérieur à 0'
    };
  }
  return { valid: true, message: '' };
};

export const validateAddress = (address) => {
  if (!address) return { valid: false, message: 'Adresse requise' };
  
  const trimmed = address.trim();
  if (trimmed.length < 3) {
    return {
      valid: false,
      message: 'L\'adresse doit avoir au moins 3 caractères'
    };
  }
  if (trimmed.length > 255) {
    return {
      valid: false,
      message: 'L\'adresse ne doit pas dépasser 255 caractères'
    };
  }
  return { valid: true, message: '' };
};