import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [seatsModal, setSeatsModal] = useState(null);
  const [additionalSeats, setAdditionalSeats] = useState(10);

  const fetchEvents = () => {
    API.get('/events')
      .then(({ data }) => setEvents(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async () => {
    try {
      await API.delete(`/admin/events/${deleteId}`);
      toast.success('Event deleted');
      setDeleteId(null);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleIncreaseSeats = async () => {
    try {
      await API.patch(`/admin/events/${seatsModal}/seats`, { additionalSeats: parseInt(additionalSeats) });
      toast.success('Seats increased successfully');
      setSeatsModal(null);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to increase seats');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Manage Events</h2>
        <Link to="/admin/events/new" className="btn btn-primary">
          <i className="bi bi-plus-circle me-1"></i>Add Event
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Date</th>
              <th>Status</th>
              <th>Seats Available</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id}>
                <td className="fw-medium">{e.eventName}</td>
                <td><span className="badge bg-primary">{e.category}</span></td>
                <td>{e.location}</td>
                <td>{new Date(e.eventDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                <td><span className={`status-pill ${e.status === 'EXPIRED' ? 'status-expired' : e.status === 'SOLD_OUT' ? 'status-sold' : 'status-live'}`}>{e.status === 'EXPIRED' ? 'Expired' : e.status === 'SOLD_OUT' ? 'Sold out' : 'Upcoming'}</span></td>
                <td>{e.availableSeats}/{e.totalSeats}</td>
                <td>₹{e.ticketPrice}</td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <Link to={`/admin/events/${e.id}/edit`} className="btn btn-outline-primary">Edit</Link>
                    <button className="btn btn-outline-success" onClick={() => setSeatsModal(e.id)}>+Seats</button>
                    <button className="btn btn-outline-danger" onClick={() => setDeleteId(e.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        show={!!deleteId}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Delete"
      />

      {seatsModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Increase Seats</h5>
                <button type="button" className="btn-close" onClick={() => setSeatsModal(null)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Additional Seats</label>
                <input type="number" className="form-control" min="1" value={additionalSeats}
                  onChange={(e) => setAdditionalSeats(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSeatsModal(null)}>Cancel</button>
                <button className="btn btn-success" onClick={handleIncreaseSeats}>Add Seats</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
