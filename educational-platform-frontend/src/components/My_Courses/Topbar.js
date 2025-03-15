import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./topbar.css"; // Import the custom CSS

const Topbar = () => {
  return (
    <nav className="custom-topbar">
      <span className="custom-brand">My Learning Platform</span>
      <button className="custom-logout-btn">Logout</button>
    </nav>
  );
};

export default Topbar;
