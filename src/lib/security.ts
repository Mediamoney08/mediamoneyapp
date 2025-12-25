/**
 * Security Utilities
 * 
 * This module provides security-related utility functions for input validation,
 * sanitization, and security checks.
 */

/**
 * Validates username format
 * - Must be 3-20 characters
 * - Only alphanumeric and underscore allowed
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username must be at most 20 characters' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true };
}

/**
 * Validates password strength
 * - Minimum 8 characters
 * - Must contain uppercase, lowercase, and numbers
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!hasLowerCase) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!hasNumber) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  return { valid: true };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

/**
 * Sanitizes string input by removing potentially dangerous characters
 * Note: React automatically escapes content, but this provides extra safety
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length to prevent DoS
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }

  return sanitized;
}

/**
 * Validates numeric input
 */
export function validateNumber(
  value: number,
  options?: { min?: number; max?: number; integer?: boolean }
): { valid: boolean; error?: string } {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return { valid: false, error: 'Invalid number' };
  }

  if (options?.integer && !Number.isInteger(value)) {
    return { valid: false, error: 'Must be an integer' };
  }

  if (options?.min !== undefined && value < options.min) {
    return { valid: false, error: `Must be at least ${options.min}` };
  }

  if (options?.max !== undefined && value > options.max) {
    return { valid: false, error: `Must be at most ${options.max}` };
  }

  return { valid: true };
}

/**
 * Validates file upload
 */
export function validateFile(
  file: File,
  options?: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  }
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size (default 1MB)
  const maxSize = options?.maxSize || 1024 * 1024;
  if (file.size > maxSize) {
    const sizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `File size must be less than ${sizeMB}MB` };
  }

  // Check file type
  if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }

  // Check file extension
  if (options?.allowedExtensions) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !options.allowedExtensions.includes(extension)) {
      return { valid: false, error: 'Invalid file extension' };
    }
  }

  return { valid: true };
}

/**
 * Validates URL format
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validates UUID format
 */
export function validateUuid(uuid: string): { valid: boolean; error?: string } {
  if (!uuid || typeof uuid !== 'string') {
    return { valid: false, error: 'UUID is required' };
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) {
    return { valid: false, error: 'Invalid UUID format' };
  }

  return { valid: true };
}

/**
 * Rate limiting helper (client-side)
 * Prevents rapid repeated actions
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  /**
   * Check if action is allowed
   * @param key - Unique identifier for the action
   * @param maxAttempts - Maximum attempts allowed
   * @param windowMs - Time window in milliseconds
   */
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return true;
  }

  /**
   * Reset attempts for a key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clear all attempts
   */
  clearAll(): void {
    this.attempts.clear();
  }
}

/**
 * Secure random string generator
 * Useful for generating tokens, IDs, etc.
 */
export function generateSecureRandomString(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if a string contains potentially dangerous patterns
 */
export function containsDangerousPatterns(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  // Check for common injection patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /eval\(/i,
    /expression\(/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Validates player ID format
 * Adjust regex based on your requirements
 */
export function validatePlayerId(playerId: string): { valid: boolean; error?: string } {
  if (!playerId || typeof playerId !== 'string') {
    return { valid: false, error: 'Player ID is required' };
  }

  // Remove whitespace
  const trimmed = playerId.trim();

  if (trimmed.length < 3) {
    return { valid: false, error: 'Player ID is too short' };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Player ID is too long' };
  }

  // Check for dangerous patterns
  if (containsDangerousPatterns(trimmed)) {
    return { valid: false, error: 'Player ID contains invalid characters' };
  }

  return { valid: true };
}

/**
 * Validates amount for transactions
 */
export function validateAmount(amount: number): { valid: boolean; error?: string } {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return { valid: false, error: 'Invalid amount' };
  }

  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  if (amount > 1000000) {
    return { valid: false, error: 'Amount is too large' };
  }

  // Check for reasonable decimal places (max 2)
  if (amount.toString().split('.')[1]?.length > 2) {
    return { valid: false, error: 'Amount can have at most 2 decimal places' };
  }

  return { valid: true };
}
