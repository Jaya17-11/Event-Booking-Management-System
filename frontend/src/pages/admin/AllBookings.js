import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/bookings')
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">All Bookings</h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Reference</th>
              <th>User</th>
              <th>Event</th>
              <th>Tickets</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td><code>{b.bookingReference}</code></td>
                <td>{b.userName}<br /><small className="text-muted">{b.userEmail}</small></td>
                <td>{b.eventName}</td>
                <td>{b.ticketsBooked}</td>
                <td>₹{b.totalAmount}</td>
                <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${b.status === 'BOOKED' ? 'bg-success' : 'bg-secondary'}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="text-center py-4 text-muted">No bookings found.</div>
        )}
      </div>
    </div>
  );
};

export default AllBookings;
