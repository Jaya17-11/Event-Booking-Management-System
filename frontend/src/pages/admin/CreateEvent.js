import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const CreateEvent = () => {
  const [form, setForm] = useState({
    eventName: '', category: '', location: '',
    eventDate: '', totalSeats: '', ticketPrice: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/admin/events', {
        ...form,
        totalSeats: parseInt(form.totalSeats),
        ticketPrice: parseFloat(form.ticketPrice),
      });
      toast.success('Event created successfully');
      navigate('/admin/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Create Event</h2>
      <div className="card shadow border-0" style={{ maxWidth: '600px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Event Name</label>
              <input type="text" className="form-control" name="eventName" value={form.eventName}
                onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input type="text" className="form-control" name="category" value={form.category}
                onChange={handleChange} required placeholder="Concert, Sports, Conference..." />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input type="text" className="form-control" name="location" value={form.location}
                onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Event Date & Time</label>
              <input type="datetime-local" className="form-control" name="eventDate" value={form.eventDate}
                onChange={handleChange} required />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Total Seats</label>
                <input type="number" className="form-control" name="totalSeats" value={form.totalSeats}
                  onChange={handleChange} required min="1" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Ticket Price (₹)</label>
                <input type="number" className="form-control" name="ticketPrice" value={form.ticketPrice}
                  onChange={handleChange} required min="0" step="0.01" />
              </div>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Event'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/events')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
