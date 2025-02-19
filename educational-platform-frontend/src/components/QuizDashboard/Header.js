import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  return (
    <header className="d-flex justify-content-between align-items-center p-3 shadow bg-white w-100 position-fixed top-0">
      {/* Logo Placeholder */}
      <div className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
        {/* You can place an actual logo here */}
      </div>

      {/* Title */}
      <h2 className="m-0 flex-grow-1 text-center">Review Quiz Performance</h2>

      {/* Native Bootstrap Dropdown */}
      {/* <div className="dropdown">
        <button className="btn btn-link text-primary fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Select Quiz
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href="#/quiz1">Quiz 1</a></li>
          <li><a className="dropdown-item" href="#/quiz2">Quiz 2</a></li>
          <li><a className="dropdown-item" href="#/quiz3">Quiz 3</a></li>
        </ul>
      </div> */}
    </header>
  );
}

export default Header;
