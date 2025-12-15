import React, { useState, useEffect } from "react";
import { sweetsService } from "../services/sweetsService";

function Shop() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    setLoading(true);
    setError("");
    try {
      const fetchedSweets = await sweetsService.getAllSweets();
      const normalizedSweets = fetchedSweets.map((sweet) => ({
        ...sweet,
        stock: sweet.quantity !== undefined ? sweet.quantity : sweet.stock,
      }));
      setSweets(normalizedSweets);
      const initialQuantities = {};
      normalizedSweets.forEach((sweet) => {
        initialQuantities[sweet.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      setError(err.message || "Failed to fetch sweets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id, value) => {
    const numValue = parseInt(value) || 1;
    if (numValue < 1) return;
    setQuantities({
      ...quantities,
      [id]: numValue,
    });
  };

  const handlePurchase = async (id) => {
    setError("");
    setSuccessMessage("");
    const quantity = quantities[id] || 1;
    try {
      const purchasedSweet = await sweetsService.purchaseSweet(id, quantity);
      const normalizedSweet = {
        ...purchasedSweet,
        stock:
          purchasedSweet.quantity !== undefined
            ? purchasedSweet.quantity
            : purchasedSweet.stock,
      };
      setSweets(
        sweets.map((sweet) =>
          sweet.id === id ? normalizedSweet : sweet
        )
      );
      setSuccessMessage("Purchase successful! Thank you for your order.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to purchase sweet. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-4000"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to Shop
          </h1>
          <p className="text-xl text-gray-300">
            Explore our delicious collection of sweets
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-500/20 backdrop-blur-sm border border-green-400/50 text-green-200 px-4 py-3 rounded-xl text-center animate-shake">
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-200 px-4 py-3 rounded-xl text-center animate-shake">
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-purple-300 text-xl">Loading sweets...</div>
          </div>
        )}

        {/* Sweets Grid */}
        {!loading && sweets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet) => (
              <div
                key={sweet.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 hover:scale-105 transition-all duration-300 hover:shadow-purple-500/50"
              >
                {/* Image */}
                <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                  <img
                    src={sweet.image}
                    alt={sweet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=" + sweet.name;
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-purple-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold">
                    {sweet.category}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">{sweet.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Category:</span>
                    <span className="text-purple-300 font-semibold">
                      {sweet.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Stock:</span>
                    <span className="text-indigo-300 font-semibold">
                      {sweet.stock || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-gray-300 text-sm">Price:</span>
                    <span className="text-2xl font-bold text-pink-400">
                      ₹{sweet.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <label className="text-gray-300 text-sm">Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      max={sweet.stock || 999}
                      value={quantities[sweet.id] || 1}
                      onChange={(e) => handleQuantityChange(sweet.id, e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => handlePurchase(sweet.id)}
                    disabled={!quantities[sweet.id] || quantities[sweet.id] < 1 || (sweet.stock && quantities[sweet.id] > sweet.stock)}
                    className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && sweets.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-xl">No sweets available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
