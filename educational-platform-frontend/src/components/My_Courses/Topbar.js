import React from 'react';

const Topbar = ({ courseName }) => {
  return (
    <div className="top-bar">
      <h1>{courseName}</h1>
      <div className="user-info">
        <span>Welcome, User</span>
        <button>Logout</button>
      </div>
    </div>
  );
};

export default Topbar;