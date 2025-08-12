import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token');
  
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.username || 'Profile';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleHomeClick = (e) => {
    // If we're already on the home page, scroll to top
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo(0, 0);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={handleHomeClick}>
            🍽️ Foodie
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link" onClick={handleHomeClick}>Home</Link>
            <Link to="/food-recalls" className="nav-link">Food Safety</Link>
            <Link to="/nutrition-benchmarks" className="nav-link">Nutrition</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            {isAuthenticated ? (
              <>
                <Link to="/create-recipe" className="nav-link">Share Recipe</Link>
                <Link to="/profile" className="nav-link user-profile">
                  👤 {username}
                </Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link">Login</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 