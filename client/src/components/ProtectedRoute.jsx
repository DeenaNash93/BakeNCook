import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getProfile } from "../services/userService";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const data = await getProfile();

      if (data.ok) {
        setIsAuth(true);
      }

      setLoading(false);
    }

    checkAuth();
  }, []);

  if (loading) {
    return <h2 style={{ padding: "30px" }}>טוען...</h2>;
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;