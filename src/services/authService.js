import ApiService from "./api";
import { API_ENDPOINTS, BASE_URL } from "../config/api";

const apiService = new ApiService(BASE_URL);

export const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(email, password) {
    try {
      // Use the full endpoint URL
      const endpoint = API_ENDPOINTS.AUTH.LOGIN.replace(BASE_URL, "");
      const response = await apiService.post(endpoint, {
        email,
        password,
      });

      // Store token and user if received
      // API returns: { token, user } or { data: { token, user } }
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user || {}));
      } else if (response.data?.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user || {}));
      }

      return response;
    } catch (error) {
      throw new Error(error.message || "Login failed. Please try again.");
    }
  },

  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{token: string, user: object}>}
   */
  async register(email, password) {
    try {
      // Use the full endpoint URL
      const endpoint = API_ENDPOINTS.AUTH.REGISTER.replace(BASE_URL, "");
      const response = await apiService.post(endpoint, {
        email,
        password,
      });

      // Store token and user if received
      // API returns: { token, user } or { data: { token, user } }
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user || {}));
      } else if (response.data?.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user || {}));
      }

      return response;
    } catch (error) {
      throw new Error(
        error.message || "Registration failed. Please try again."
      );
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  /**
   * Get current user from localStorage
   * @returns {object|null}
   */
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  },
};

export default authService;
