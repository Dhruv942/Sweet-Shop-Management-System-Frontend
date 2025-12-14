import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";
import DashboardContent from "./DashboardContent";
import { authService } from "../services/authService";

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsChecking(false);
    };

    checkAuth();

    // Check authentication status periodically
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show admin login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Show dashboard content if authenticated
  return <DashboardContent />;
}

export default Dashboard;
