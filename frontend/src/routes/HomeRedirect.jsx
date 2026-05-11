import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function HomeRedirect() {

  const { token } = useAuth();

  // if logged in
  if (token) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // if not logged in
  return (
    <Navigate
      to="/login"
      replace
    />
  );
}

export default HomeRedirect;