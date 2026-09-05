import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const TicketSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/events/sales')
      .then(({ data }) => setSales(data))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + parseFloat(s.revenue), 0);
  const totalTickets = sales.reduce((sum, s) => sum + s.ticketsSold, 0);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Ticket Sales & Revenue</h2>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm stat-card">
            <div className="card-body">
              <div className="text-muted small">Total Tickets Sold</div>
              <div className="fs-2 fw-bold">{totalTickets}</div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm stat-card">
            <div className="card-body">
              <div className="text-muted small">Total Revenue</div>
              <div className="fs-2 fw-bold text-primary">₹{totalRevenue.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Event</th>
              <th>Tickets Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.eventId}>
                <td className="fw-medium">{s.eventName}</td>
                <td>{s.ticketsSold}</td>
                <td className="text-primary fw-bold">₹{parseFloat(s.revenue).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sales.length === 0 && (
          <div className="text-center py-4 text-muted">No sales data available.</div>
        )}
      </div>
    </div>
  );
};

export default TicketSales;
