/**
 * Configuration utilities for the application
 */

/**
 * Gets the Google Client ID from environment variables
 * In development, this will use the value from .env.local
 * In production, this should be set in the hosting environment
 */
export const getGoogleClientId = (): string => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    console.warn('REACT_APP_GOOGLE_CLIENT_ID is not set in environment variables');
    return 'YOUR_GOOGLE_CLIENT_ID'; // Placeholder for development
  }
  
  return clientId;
};

/**
 * Gets the Google API Key from environment variables
 */
export const getGoogleApiKey = (): string => {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.warn('REACT_APP_GOOGLE_API_KEY is not set in environment variables');
    return 'YOUR_API_KEY'; // Placeholder for development
  }
  
  return apiKey;
};
