import React, { useState, useEffect } from "react";
import AdminLogin from "../components/AdminLogin";
import { authService } from "../services/authService";

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
    }
  }, []);

  // Check authentication status periodically
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        setIsAuthenticated(true);
      }
    };

    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  // Show admin login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Show dashboard content if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-4000"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-300">
              Manage your sweet shop
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500/20 backdrop-blur-md text-red-200 rounded-xl font-semibold hover:bg-red-500/30 transition-all border border-red-400/50"
          >
            Logout
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-2">Total Orders</h3>
            <p className="text-4xl font-extrabold text-purple-400">0</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-2">Total Revenue</h3>
            <p className="text-4xl font-extrabold text-pink-400">₹0</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-2">Total Products</h3>
            <p className="text-4xl font-extrabold text-indigo-400">0</p>
          </div>
        </div>

        {/* Dashboard Content Placeholder */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-4">Dashboard Content</h2>
          <p className="text-gray-300">
            Admin dashboard content will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
