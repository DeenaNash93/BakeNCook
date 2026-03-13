import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isAdmin = false, logoSrc = "", userName = "" }) {
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
      <div className="navbar-right">
        {logoSrc && <img src={logoSrc} alt="BakeNCook" className="logo" />}
      </div>

      <div className="nav-links">
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            דשבורד מנהל
          </NavLink>
        )}

        <NavLink
          to="/classes"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          סדנאות
        </NavLink>

        {!isAdmin && (
          <NavLink
            to="/my-classes"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            הסדנאות שלי
          </NavLink>
        )}

        <NavLink
          to="/recipes"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          מתכונים
        </NavLink>
      </div>

      <div className="navbar-left">
        {userName && <span className="welcome-text">שלום, {userName}</span>}

        <button className="logout-btn" onClick={handleLogout}>
          התנתקות
        </button>
      </div>
    </nav>
  );
}

export default Navbar;