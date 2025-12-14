import ApiService from "./api";
import { API_ENDPOINTS, BASE_URL } from "../config/api";

const apiService = new ApiService(BASE_URL);

export const sweetsService = {
  async getAllSweets() {
    try {
      const endpoint = API_ENDPOINTS.SWEETS.GET_ALL.replace(BASE_URL, "");
      const response = await apiService.get(endpoint);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      throw new Error(
        error.message || "Failed to fetch sweets. Please try again."
      );
    }
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

  async createSweet(sweetData) {
    try {
      const endpoint = API_ENDPOINTS.SWEETS.CREATE.replace(BASE_URL, "");
      const payload = {
        name: sweetData.name,
        category: sweetData.category,
        price: parseInt(sweetData.price),
        quantity: parseInt(sweetData.stock || sweetData.quantity),
        image: sweetData.image || "",
      };
      const response = await apiService.post(endpoint, payload);
      return response;
    } catch (error) {
      throw new Error(
        error.message || "Failed to create sweet. Please try again."
      );
    }
  },

  async updateSweet(id, sweetData) {
    try {
      const endpoint = API_ENDPOINTS.SWEETS.UPDATE(id).replace(BASE_URL, "");
      const payload = {
        name: sweetData.name,
        category: sweetData.category,
        price: parseInt(sweetData.price),
        quantity: parseInt(sweetData.stock || sweetData.quantity),
        image: sweetData.image || "",
      };
      const response = await apiService.put(endpoint, payload);
      return response;
    } catch (error) {
      throw new Error(
        error.message || "Failed to update sweet. Please try again."
      );
    }
  },

  /**
   * Delete sweet
   * @param {string} id - Sweet ID
   * @returns {Promise<void>}
   */
  async deleteSweet(id) {
    try {
      const endpoint = API_ENDPOINTS.SWEETS.DELETE(id).replace(BASE_URL, "");
      await apiService.delete(endpoint);
      return;
    } catch (error) {
      throw new Error(
        error.message || "Failed to delete sweet. Please try again."
      );
    }
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
