import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getProfile } from "../services/userService";

function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const data = await getProfile();

      if (data.ok && data.user?.role === "admin") {
        setIsAdmin(true);
      }

      setLoading(false);
    }

    checkAdmin();
  }, []);

  if (loading) {
    return <h2 style={{ padding: "30px" }}>טוען...</h2>;
  }

  if (!isAdmin) {
    return <Navigate to="/classes" replace />;
  }

  return children;
}

export default AdminRoute;