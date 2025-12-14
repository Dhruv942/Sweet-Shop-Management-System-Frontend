// API Configuration
export const API_BASE_URL =
  "https://sweet-shop-management-system-backend-oimn.onrender.com/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  SWEETS: {
    GET_ALL: `${API_BASE_URL}/sweets`,
    SEARCH: `${API_BASE_URL}/sweets/search`,
    CREATE: `${API_BASE_URL}/sweets`,
    UPDATE: (id) => `${API_BASE_URL}/sweets/${id}`,
    DELETE: (id) => `${API_BASE_URL}/sweets/${id}`,
    RESTOCK: (id) => `${API_BASE_URL}/sweets/${id}/restock`,
    PURCHASE: (id) => `${API_BASE_URL}/sweets/${id}/purchase`,
  },
};

export const BASE_URL = API_BASE_URL;

export default {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: API_ENDPOINTS,
};
