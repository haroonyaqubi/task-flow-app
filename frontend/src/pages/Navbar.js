import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            TaskFlow
          </Link>

          <div className="navbar-menu">
            <Link to="/" className="navbar-item">
              Home
            </Link>
            <Link to="/tasks" className="navbar-item">
              My Tasks
            </Link>
            <Link to="/create" className="navbar-item">
              Create Task
            </Link>
            <Link to="/profile" className="navbar-item">
              Profile
            </Link>
          </div>

          <div className="navbar-auth">
            <button className="btn btn-login">Login</button>
            <button className="btn btn-signup">Sign Up</button>
          </div>
        </div>
      </nav>
  );
}

export default Navbar;