import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]); const [loading, setLoading] = useState(true); const [cancelId, setCancelId] = useState(null);
  const fetchBookings = () => API.get('/bookings/my').then(({ data }) => setBookings(data)).catch(() => toast.error('Failed to load bookings')).finally(() => setLoading(false));
  useEffect(() => { fetchBookings(); }, []);
  const selected = bookings.find(b => b.id === cancelId);
  const handleCancel = async () => { try { await API.put(`/bookings/${cancelId}/cancel`); toast.success('Booking cancelled. Your tickets are available again.'); setCancelId(null); fetchBookings(); } catch (err) { toast.error(err.response?.data?.message || 'Cancellation failed'); } };
  if (loading) return <LoadingSpinner fullPage />;
  return <div className="page-shell"><div className="container py-4 py-md-5"><div className="section-heading mb-4"><div><p className="eyebrow">YOUR TICKETS</p><h1>My bookings</h1><p className="section-subtitle">Everything you've reserved, in one place.</p></div><Link to="/events" className="btn btn-primary">Find another event</Link></div>
    {bookings.length === 0 ? <div className="empty-state"><div className="empty-icon">◇</div><h3>No bookings yet</h3><p>Find an event you love and your tickets will appear here.</p><Link to="/events" className="btn btn-primary">Browse events</Link></div> : <div className="booking-list">{bookings.map(b => <article className="booking-item" key={b.id}><div><span className={`status-pill ${b.status === 'BOOKED' ? 'status-live' : 'status-expired'}`}>{b.status === 'BOOKED' ? 'Confirmed' : 'Cancelled'}</span><h3>{b.eventName}</h3><p>{b.ticketsBooked} {b.ticketsBooked === 1 ? 'ticket' : 'tickets'} · {new Date(b.bookingDate).toLocaleDateString()}</p><code>{b.bookingReference}</code></div><div className="booking-side"><strong>₹{Number(b.totalAmount).toFixed(2)}</strong>{b.status === 'BOOKED' && <button className="btn btn-outline-danger btn-sm" onClick={() => setCancelId(b.id)}>Cancel booking</button>}</div></article>)}</div>}
    <ConfirmDialog show={!!cancelId} title="Cancel this booking?" message={`You can cancel only until 1 hour before the event. ${selected ? `${selected.ticketsBooked} ticket(s) will be returned to availability.` : ''}`} onConfirm={handleCancel} onCancel={() => setCancelId(null)} confirmText="Yes, cancel" />
  </div></div>;
};
export default MyBookings;
