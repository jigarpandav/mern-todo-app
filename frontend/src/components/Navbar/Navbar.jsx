import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaCheckCircle } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <nav className="nav-container">
      <div className="nav-header">
        <div className="nav-logo">
          <div className="nav-icon">
            <FaCheckCircle />
          </div>

          <div className="nav-brand">
            <span>To Do</span>
            <small>Task Manager</small>
          </div>
        </div>

        <div className="nav-right">
          <div className="nav-user" aria-label="Current user">
            <FaUser />
            <span>User</span>
          </div>

          <button type="button" className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;