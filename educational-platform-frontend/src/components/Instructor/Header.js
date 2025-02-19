import React from "react";
// import "./../../styles/header.css"; // Importing the correct header styles
import "./../../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      {/* Left: Logo & Title */}
      <div className="header-left">
        <div className="logo-placeholder"></div> {/* Placeholder */}
        <h1 className="header-title">Instructor Dashboard</h1>
      </div>

      {/* Right: Email */}
      <div className="header-email">22f100338@iitm.study.ac.in</div>
    </header>
  );
};

export default Header;
