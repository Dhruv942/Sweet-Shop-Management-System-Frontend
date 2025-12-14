import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

function ProtectedRoute({ children, redirectTo = "/dashboard" }) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to dashboard which will show admin login
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;
