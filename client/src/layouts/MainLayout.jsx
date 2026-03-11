
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.png";

function MainLayout() {
  const isAdmin = true; // זמני לבדיקה

  return (
    <div>
      <Navbar logoSrc={logo} isAdmin={isAdmin} />
      <Outlet />
    </div>
  );
}

export default MainLayout;