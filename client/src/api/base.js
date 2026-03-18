/**
 * API base for production (e.g. Vercel → Render).
 * Set VITE_API_URL in Vercel to your Render URL, e.g. https://hospital-management-software-1-fjvb.onrender.com
 * Leave unset locally — Vite proxies /api to the backend.
 */
export function apiUrl(path) {
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}
