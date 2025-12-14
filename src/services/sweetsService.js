import ApiService from "./api";
import { API_ENDPOINTS, BASE_URL } from "../config/api";

const apiService = new ApiService(BASE_URL);

export const sweetsService = {
  /**
   * Get all sweets
   * @returns {Promise<Array>}
   */
  async getAllSweets() {
    // TODO: API integration
    return [];
  },

  /**
   * Search sweets
   * @param {string} query - Search query
   * @returns {Promise<Array>}
   */
  async searchSweets(query) {
    // TODO: API integration
    return [];
  },

  /**
   * Create new sweet
   * @param {object} sweetData - Sweet data (name, category, price, image, stock)
   * @returns {Promise<object>}
   */
  async createSweet(sweetData) {
    // TODO: API integration
    return sweetData;
  },

  /**
   * Update sweet
   * @param {string} id - Sweet ID
   * @param {object} sweetData - Updated sweet data
   * @returns {Promise<object>}
   */
  async updateSweet(id, sweetData) {
    // TODO: API integration
    return { id, ...sweetData };
  },

  /**
   * Delete sweet
   * @param {string} id - Sweet ID
   * @returns {Promise<void>}
   */
  async deleteSweet(id) {
    // TODO: API integration
    return;
  },

  /**
   * Restock sweet
   * @param {string} id - Sweet ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise<object>}
   */
  async restockSweet(id, quantity) {
    // TODO: API integration
    return { id, quantity };
  },
};

export default sweetsService;
