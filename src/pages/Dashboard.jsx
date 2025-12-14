import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";
import DashboardContent from "./DashboardContent";
import { authService } from "../services/authService";

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already logged in
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsChecking(false);
    };

    checkAuth();

    // Listen for storage changes (when login happens)
    const handleStorageChange = () => {
      checkAuth();
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    // Custom event listener for same-tab storage changes
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
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
