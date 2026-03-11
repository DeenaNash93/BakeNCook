import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isAdmin = false, logoSrc = "" }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    navigate("/");
  };

  return (
    <nav className="navbar">
      {logoSrc && <img src={logoSrc} alt="BakeNCook" className="logo" />}

      <div className="nav-links">
        <NavLink
          to="/classes"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          סדנאות
        </NavLink>

        <NavLink
          to="/my-classes"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          הסדנאות שלי
        </NavLink>

        <NavLink
          to="/recipes"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          מתכונים
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            דשבורד מנהל
          </NavLink>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          התנתקות
        </button>
      </div>
    </nav>
  );
}

export default Navbar;