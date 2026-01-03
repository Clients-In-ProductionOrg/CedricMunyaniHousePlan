/**
 * Application Configuration Constants
 * All URLs are sourced from environment variables for easy deployment switching
 */

// Backend API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Backend and Frontend URLs
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || '';
export const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || '';

// API Endpoints
export const API_ENDPOINTS = {
  PLANS: import.meta.env.VITE_API_PLANS || '',
  PLAN_DETAIL: (id: string | number) => import.meta.env.VITE_API_PLAN_DETAIL ? import.meta.env.VITE_API_PLAN_DETAIL.replace(':id', String(id)) : '',
  BUILT_HOMES: import.meta.env.VITE_API_BUILT_HOMES || '',
  SITE_SETTINGS: import.meta.env.VITE_API_SITE_SETTINGS || '',
  SETTINGS: import.meta.env.VITE_API_SETTINGS || '',
  CONTACTS: import.meta.env.VITE_API_CONTACTS || '',
  QUOTES: import.meta.env.VITE_API_QUOTES || '',
  PURCHASES: import.meta.env.VITE_API_PURCHASES || '',
};

