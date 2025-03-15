import React from "react";
import { NavLink } from "react-router-dom";
import "./../../styles/sidebar.css"; // Import sidebar styles

const Sidebar = () => {
  return (
    <aside className="sidebar">
      {/* <h2 className="sidebar-title">Dashboard</h2> */}
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/student-dashboard"
            className={({ isActive }) => (isActive ? "sidebar-item active" : "sidebar-item")}
          >
            My Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/student-courses"
            className={({ isActive }) => (isActive ? "sidebar-item active" : "sidebar-item")}
          >
            My Courses
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/deadlines-reminders"
            className={({ isActive }) => (isActive ? "sidebar-item active" : "sidebar-item")}
          >
            Deadlines & Reminders
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/activity-tracker"
            className={({ isActive }) => (isActive ? "sidebar-item active" : "sidebar-item")}
          >
            Activity Streak & Progress Tracker
          </NavLink>
        </li> */}
        <li>
          <NavLink
            to="/ai-assistance"
            className={({ isActive }) => (isActive ? "sidebar-item active sidebar-highlight" : "sidebar-item sidebar-highlight")}
          >
            AI Assistance
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
