const getBaseUrl = () => {
  // Use VITE_API_URL if provided, otherwise fallback to localhost
  let url = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  
  // Ensure it's a string and trim whitespace
  let trimmedUrl = String(url).trim();
  
  // Remove trailing slashes
  while (trimmedUrl.endsWith('/')) {
    trimmedUrl = trimmedUrl.slice(0, -1);
  }

  // If it already ends with /api, we're good
  if (trimmedUrl.endsWith('/api')) {
    return trimmedUrl;
  }
  
  // Otherwise, append /api
  return `${trimmedUrl}/api`;
};

export const API_URL = getBaseUrl();

export const getEndpoint = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};
