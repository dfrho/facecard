/**
 * Utility functions for working with environment variables
 */

/**
 * Get a required environment variable
 * Throws an error if the variable is not set
 */
export function getRequiredEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Get an optional environment variable
 * Returns a default value if the variable is not set
 */
export function getOptionalEnvVar(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(featureFlag: string): boolean {
  const value = process.env[`ENABLE_${featureFlag.toUpperCase()}`];
  return value === 'true' || value === '1';
}

/**
 * Get a client-side environment variable
 * Must start with NEXT_PUBLIC_
 */
export function getClientEnvVar(key: string, defaultValue: string = ''): string {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    console.warn(`Attempting to access non-public env var on client: ${key}`);
    return defaultValue;
  }
  
  // @ts-ignore - process.env is available at build time
  return process.env[key] || defaultValue;
}

/**
 * Parse a comma-separated environment variable into an array
 */
export function parseArrayEnvVar(key: string, defaultValue: string[] = []): string[] {
  const value = getOptionalEnvVar(key);
  if (!value) return defaultValue;
  
  return value.split(',').map(v => v.trim());
}

/**
 * Parse a numeric environment variable
 * Returns a default value if the variable is not set or is not a number
 */
export function parseNumericEnvVar(key: string, defaultValue: number): number {
  const value = getOptionalEnvVar(key);
  if (!value) return defaultValue;
  
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}