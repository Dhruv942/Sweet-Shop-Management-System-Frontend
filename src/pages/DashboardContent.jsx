import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { sweetsService } from "../services/sweetsService";

// Dummy sweets data for design
const dummySweets = [
  {
    id: 1,
    name: "Gulab Jamun",
    category: "Traditional",
    price: 50,
    stock: 100,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Rasgulla",
    category: "Traditional",
    price: 45,
    stock: 80,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Kaju Katli",
    category: "Dry Fruits",
    price: 120,
    stock: 60,
    image:
      "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=300&fit=crop",
  },
];

function DashboardContent() {
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        setFetchLoading(true);
        const fetchedSweets = await sweetsService.getAllSweets();
        const normalizedSweets = fetchedSweets.map((sweet) => ({
          ...sweet,
          stock: sweet.stock || sweet.quantity || 0,
        }));
        setSweets(normalizedSweets);
      } catch (err) {
        setError(err.message || "Failed to load sweets");
        setSweets(dummySweets);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchSweets();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/dashboard");
  };

  const handleAddSweet = () => {
    setFormData({ name: "", category: "", price: "", stock: "", image: "" });
    setShowAddModal(true);
  };

  const handleEditSweet = (sweet) => {
    setSelectedSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      stock: sweet.stock,
      image: sweet.image,
    });
    setShowEditModal(true);
  };

  const handleDeleteSweet = async (id) => {
    // Check if user is admin
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.email !== "admin@example.com") {
      setError("Only admin can delete sweets.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this sweet?")) {
      setError("");
      setLoading(true);
      try {
        await sweetsService.deleteSweet(id);
        setSweets(sweets.filter((sweet) => sweet.id !== id));
      } catch (err) {
        setError(err.message || "Failed to delete sweet. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestock = (sweet) => {
    setSelectedSweet(sweet);
    setFormData({ stock: "" });
    setShowRestockModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const newSweet = await sweetsService.createSweet(formData);
      setSweets([
        ...sweets,
        { ...newSweet, stock: newSweet.quantity || newSweet.stock },
      ]);
      setShowAddModal(false);
      setFormData({ name: "", category: "", price: "", stock: "", image: "" });
    } catch (err) {
      setError(err.message || "Failed to create sweet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const updatedSweet = await sweetsService.updateSweet(
        selectedSweet.id,
        formData
      );
      // Normalize response: API might return 'quantity' instead of 'stock'
      const normalizedSweet = {
        ...updatedSweet,
        stock:
          updatedSweet.quantity !== undefined
            ? updatedSweet.quantity
            : updatedSweet.stock,
      };
      setSweets(
        sweets.map((sweet) =>
          sweet.id === selectedSweet.id ? normalizedSweet : sweet
        )
      );
      setShowEditModal(false);
      setSelectedSweet(null);
      setFormData({ name: "", category: "", price: "", stock: "", image: "" });
    } catch (err) {
      setError(err.message || "Failed to update sweet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRestock = (e) => {
    e.preventDefault();
    setSweets(
      sweets.map((sweet) =>
        sweet.id === selectedSweet.id
          ? { ...sweet, stock: sweet.stock + parseInt(formData.stock) }
          : sweet
      )
    );
    setShowRestockModal(false);
    setSelectedSweet(null);
  };

  const filteredSweets = sweets.filter(
    (sweet) =>
      sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sweet.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = sweets.reduce(
    (sum, sweet) => sum + sweet.price * sweet.stock,
    0
  );
  const totalProducts = sweets.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-4000"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-300">Manage your sweet shop</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500/20 backdrop-blur-md text-red-200 rounded-xl font-semibold hover:bg-red-500/30 transition-all border border-red-400/50"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-2">
              Total Products
            </h3>
            <p className="text-4xl font-extrabold text-purple-400">
              {totalProducts}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-2">Total Revenue</h3>
            <p className="text-4xl font-extrabold text-pink-400">
              ₹{totalRevenue}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-2">Total Stock</h3>
            <p className="text-4xl font-extrabold text-indigo-400">
              {sweets.reduce((sum, sweet) => sum + sweet.stock, 0)}
            </p>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search sweets by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/30 transition-all"
            />
          </div>
          <button
            onClick={handleAddSweet}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Sweet
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-200 px-4 py-3 rounded-xl text-sm text-center mb-4 animate-shake">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Sweets Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {fetchLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-300"
                    >
                      Loading sweets...
                    </td>
                  </tr>
                ) : (
                  filteredSweets.map((sweet) => (
                    <tr
                      key={sweet.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={sweet.image}
                          alt={sweet.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/64?text=" +
                              sweet.name;
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">
                        {sweet.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                          {sweet.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-pink-400 font-bold">
                        ₹{sweet.price}
                      </td>
                      <td className="px-6 py-4 text-indigo-400 font-semibold">
                        {sweet.stock}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSweet(sweet)}
                            className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRestock(sweet)}
                            className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all text-sm font-medium"
                          >
                            Restock
                          </button>
                          <button
                            onClick={() => handleDeleteSweet(sweet.id)}
                            className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {!fetchLoading && filteredSweets.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No sweets found. Add your first sweet!
              </div>
            )}
          </div>
        </div>

        {/* Add Sweet Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
              <h2 className="text-3xl font-bold text-white mb-6">
                Add New Sweet
              </h2>
              <form onSubmit={handleSubmitAdd} className="space-y-4">
                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-200 px-4 py-3 rounded-xl text-sm text-center">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    placeholder="Sweet name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    placeholder="Category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    placeholder="Stock quantity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    placeholder="Image URL"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Adding..." : "Add Sweet"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setError("");
                    }}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Sweet Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
              <h2 className="text-3xl font-bold text-white mb-6">Edit Sweet</h2>
              <form onSubmit={handleSubmitEdit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-200 px-4 py-3 rounded-xl text-sm text-center">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      "Update Sweet"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Restock Modal */}
        {showRestockModal && selectedSweet && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
              <h2 className="text-3xl font-bold text-white mb-2">
                Restock {selectedSweet.name}
              </h2>
              <p className="text-gray-300 mb-6">
                Current Stock: {selectedSweet.stock}
              </p>
              <form onSubmit={handleSubmitRestock} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">
                    Add Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    placeholder="Quantity to add"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    Restock
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRestockModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardContent;
