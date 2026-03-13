import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.png";
import { getProfile } from "../services/userService";

function MainLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const data = await getProfile();

      if (data.ok && data.user) {
        if (data.user.role === "admin") {
          setIsAdmin(true);
        }

        setUserName(data.user.full_name || "");
      }
    }

    loadProfile();
  }, []);

  return (
    <div>
      <Navbar logoSrc={logo} isAdmin={isAdmin} userName={userName} />
      <Outlet />
    </div>
  );
}

export default MainLayout;