import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Topbar = () => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <span className="navbar-brand">My Learning Platform</span>
      <button>Logout</button>
    </nav>
  );
};

export default Topbar;