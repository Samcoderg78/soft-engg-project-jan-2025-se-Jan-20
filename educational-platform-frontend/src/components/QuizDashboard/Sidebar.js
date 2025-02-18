import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Sidebar() {
  const menuItems = [
    { to: '/quiz-scores', icon: '📚', text: 'Review Quiz scores', active: false },
    { to: '/quiz-performance', icon: '📅', text: 'Review Quiz Performance', active: true },
    { to: '/weeky-performance', icon: '🎯', text: 'Weekly Perforamce', active: false },
    { to: '/ai-instructor', icon: '🤖', text: 'AI Assistance', active: false },
  ];

  return (
    <div className="d-flex flex-column bg-light p-3 vh-100">
      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.to}
          className={({ isActive }) => 
            `d-flex align-items-center p-3 rounded mb-2 ${
              isActive ? 'bg-primary text-white' : 'bg-white'
            } ${item.highlight ? 'bg-success text-white' : ''}`
          }
        >
          <span className="me-3 fs-4">{item.icon}</span>
          <span className="fw-medium">{item.text}</span>
        </NavLink>
      ))}
    </div>
  );
}

export default Sidebar;
