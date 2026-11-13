// Utility to get the correct API base URL
// In development: proxy handles /api -> localhost:5000
// In production on Vercel: VITE_API_URL points to Render backend
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}`
  : '';

export function apiUrl(path) {
  // path should start with /api/... or /uploads/...
  return `${API_BASE}${path}`;
}

export default API_BASE;
