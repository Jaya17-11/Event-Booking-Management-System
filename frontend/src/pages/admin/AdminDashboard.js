import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import API from '../api/axios';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ events: 0, bookings: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/events'),
      API.get('/admin/bookings'),
      API.get('/admin/events/sales'),
    ]).then(([eventsRes, bookingsRes, salesRes]) => {
      const revenue = salesRes.data.reduce((sum, s) => sum + parseFloat(s.revenue), 0);
      setStats({
        events: eventsRes.data.length,
        bookings: bookingsRes.data.filter(b => b.status === 'BOOKED').length,
        revenue,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Admin Dashboard</h2>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm stat-card admin-stat">
            <div className="card-body">
              <div className="text-muted small">Total Events</div>
              <div className="fs-2 fw-bold">{stats.events}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm stat-card admin-stat">
            <div className="card-body">
              <div className="text-muted small">Active Bookings</div>
              <div className="fs-2 fw-bold text-success">{stats.bookings}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm stat-card admin-stat">
            <div className="card-body">
              <div className="text-muted small">Total Revenue</div>
              <div className="fs-2 fw-bold text-primary">₹{stats.revenue.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex gap-2 flex-wrap">
        <Link to="/admin/events/new" className="btn btn-primary"><i className="bi bi-plus-circle me-1"></i>Add Event</Link>
        <Link to="/admin/events" className="btn btn-outline-primary"><i className="bi bi-gear me-1"></i>Manage Events</Link>
        <Link to="/admin/bookings" className="btn btn-outline-secondary"><i className="bi bi-list-check me-1"></i>All Bookings</Link>
        <Link to="/admin/sales" className="btn btn-outline-success"><i className="bi bi-bar-chart me-1"></i>Ticket Sales</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
