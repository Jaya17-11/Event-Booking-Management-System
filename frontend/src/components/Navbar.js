import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">

        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-ticket-perforated-fill me-2"></i>
          EventTicket
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          {/* Left Side */}
          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/events">
                Events
              </Link>
            </li>

            {isAuthenticated() && !isAdmin() && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/my-bookings">
                    My Bookings
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated() && isAdmin() && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/admin/events">
                    Manage Events
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/admin/bookings">
                    All Bookings
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/admin/sales">
                    Ticket Sales
                  </Link>
                </li>
              </>
            )}

          </ul>

          {/* Right Side */}
          <ul className="navbar-nav align-items-center">

            {isAuthenticated() ? (
              <>
                <li className="nav-item me-3">
                  <span className="navbar-text text-white fw-semibold">
                    <i className="bi bi-person-circle me-2"></i>
                    {user?.name}

                    {isAdmin() && (
                      <span className="badge bg-warning text-dark ms-2">
                        Admin
                      </span>
                    )}
                  </span>
                </li>

                {!isAdmin() && (
                  <li className="nav-item me-2">
                    <Link className="btn btn-outline-light btn-sm" to="/profile">
                      Profile
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item ms-2">
                  <Link
                    className="btn btn-outline-light btn-sm"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;