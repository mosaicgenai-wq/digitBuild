/**
 * Central API base URL configuration.
 *
 * In development, Vite's proxy forwards `/api` to localhost:3000,
 * so an empty string works fine.
 *
 * In production (Vercel), set VITE_API_URL to the Render backend URL
 * (e.g. https://digitbuild-api.onrender.com) so requests go directly
 * to the deployed Express server.
 */
export const API_BASE = import.meta.env.VITE_API_URL || '';
