const getBaseUrl = () => {
  // Use VITE_API_URL if provided, otherwise fallback to localhost
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  
  // Ensure it's a string and trim whitespace
  const trimmedUrl = String(url).trim();
  
  // If the URL already ends with /api, return it
  if (trimmedUrl.endsWith('/api')) {
    return trimmedUrl;
  }
  
  // If the URL ends with a slash, append 'api'
  if (trimmedUrl.endsWith('/')) {
    return `${trimmedUrl}api`;
  }
  
  // Otherwise append '/api'
  return `${trimmedUrl}/api`;
};

export const API_URL = getBaseUrl();

export const getEndpoint = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};
