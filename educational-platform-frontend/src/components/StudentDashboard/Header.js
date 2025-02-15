import React from "react";
import "./../../styles/header.css"; // Importing the correct header styles

const Header = () => {
  return (
    <header className="header">
      {/* Left: Logo & Title */}
      <div className="header-left">
        <div className="logo-placeholder"></div> {/* Placeholder */}
        <h1 className="header-title">Student Dashboard</h1>
      </div>

      {/* Right: Email */}
      <div className="header-email">22f100338@iitm.study.ac.in</div>
    </header>
  );
};

export default Header;
