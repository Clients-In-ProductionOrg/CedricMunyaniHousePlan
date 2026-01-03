/**
 * Application Configuration Constants
 * All URLs are sourced from environment variables for easy deployment switching
 */

// Backend URL with fallback
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Backend API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || BACKEND_BASE;

// Backend and Frontend URLs
export const BACKEND_URL = BACKEND_BASE;
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:8082';
export const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || `${BACKEND_BASE}/admin/`;

// API Endpoints with proper fallbacks
export const API_ENDPOINTS = {
  PLANS: import.meta.env.VITE_API_PLANS || `${BACKEND_BASE}/api/house-plans/`,
  PLAN_DETAIL: (id: string | number) => {
    const template = import.meta.env.VITE_API_PLAN_DETAIL || `${BACKEND_BASE}/api/house-plans/:id/`;
    return template.replace(':id', String(id));
  },
  BUILT_HOMES: import.meta.env.VITE_API_BUILT_HOMES || `${BACKEND_BASE}/api/built-homes/`,
  SITE_SETTINGS: import.meta.env.VITE_API_SITE_SETTINGS || `${BACKEND_BASE}/api/site-settings/`,
  SETTINGS: import.meta.env.VITE_API_SETTINGS || `${BACKEND_BASE}/api/settings/`,
  CONTACTS: import.meta.env.VITE_API_CONTACTS || `${BACKEND_BASE}/api/contact-message/`,
  QUOTES: import.meta.env.VITE_API_QUOTES || `${BACKEND_BASE}/api/quote-request/`,
  PURCHASES: import.meta.env.VITE_API_PURCHASES || `${BACKEND_BASE}/api/purchase/`,
};

