import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/bookings/my')
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  const active = bookings.filter(b => b.status === 'BOOKED').length;

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Welcome, {user?.name}!</h2>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm stat-card">
            <div className="card-body">
              <div className="text-muted small">Total Bookings</div>
              <div className="fs-2 fw-bold">{bookings.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm stat-card">
            <div className="card-body">
              <div className="text-muted small">Active Bookings</div>
              <div className="fs-2 fw-bold text-success">{active}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm stat-card">
            <div className="card-body">
              <div className="text-muted small">Cancelled</div>
              <div className="fs-2 fw-bold text-secondary">{bookings.length - active}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex gap-2 flex-wrap">
        <Link to="/events" className="btn btn-primary"><i className="bi bi-calendar-event me-1"></i>Browse Events</Link>
        <Link to="/my-bookings" className="btn btn-outline-primary"><i className="bi bi-ticket me-1"></i>My Bookings</Link>
        <Link to="/profile" className="btn btn-outline-secondary"><i className="bi bi-person me-1"></i>Profile</Link>
      </div>
    </div>
  );
};

export default UserDashboard;
