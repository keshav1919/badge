/**
 * API configuration — single source of truth for backend URL.
 *
 * In production (Netlify), set the VITE_API_BASE_URL environment variable
 * to your backend's public URL (e.g., https://your-backend.example.com).
 *
 * In development, leave it empty to use the Vite dev proxy, or set it to
 * your local backend URL (e.g., http://localhost:8000).
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Returns the full avatar proxy URL for a given raw image URL.
 */
export const getAvatarProxyUrl = (rawUrl) => {
  if (!rawUrl) return null;
  return `${API_BASE_URL}/api/avatar-proxy?url=${encodeURIComponent(rawUrl)}`;
};
