import React, { useEffect, useState } from "react";
import "./../../styles/header.css"; // Importing the correct header styles
import { logout } from "../../utils/auth";

const Header = () => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.email) {
      setUserEmail(user.email);
    }
  }, []);

  return (
    <header className="header">
      {/* Left: Logo & Title */}
      <div className="header-left">
        <div className="logo-placeholder"></div> {/* Placeholder */}
        <h1 className="header-title">Student Dashboard</h1>
      </div>

      {/* Right: Email and Logout */}
      <div className="header-right">
        <span className="header-email me-3">{userEmail}</span>
        <button 
          onClick={logout}
          className="btn btn-outline-danger btn-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
