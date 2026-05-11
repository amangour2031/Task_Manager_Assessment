import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {

  const { token } = useAuth();

  // if not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // allow access
  return children;
}

export default ProtectedRoute;