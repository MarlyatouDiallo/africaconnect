// utils/validators.js

/**
 * Validates an email address using a robust regex.
 */
export function validateEmail(email) {
  if (!email) return 'L\'adresse e-mail est requise.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Format d\'adresse e-mail invalide.';
  }
  return null;
}

/**
 * Validates a password's strength:
 * - Must be at least 6 characters (minimum requirement for Supabase)
 * - Checks for basic letters and numbers
 */
export function validatePassword(password) {
  if (!password) return 'Le mot de passe est requis.';
  if (password.length < 6) {
    return 'Le mot de passe doit contenir au moins 6 caractères.';
  }
  return null;
}

/**
 * Validates a username:
 * - Required
 * - Must be alphanumeric and underscores only
 * - 3 to 20 characters
 */
export function validateUsername(username) {
  if (!username) return 'Le nom d\'utilisateur est requis.';
  if (username.length < 3) {
    return 'Le nom d\'utilisateur doit contenir au moins 3 caractères.';
  }
  if (username.length > 20) {
    return 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères.';
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores (_).';
  }
  return null;
}
