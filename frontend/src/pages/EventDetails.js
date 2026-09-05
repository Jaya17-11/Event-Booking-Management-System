import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { API.get(`/events/${id}`).then(({ data }) => setEvent(data)).catch(() => toast.error('Event not found')).finally(() => setLoading(false)); }, [id]);

  const cutoff = useMemo(() => event ? new Date(event.eventDate).getTime() - 60 * 60 * 1000 : 0, [event]);
  const bookingOpen = event && event.status !== 'EXPIRED' && event.status !== 'SOLD_OUT' && Date.now() < cutoff;
  const total = event ? Number(event.ticketPrice) * Number(tickets) : 0;

  const handleBook = async () => {
    if (!isAuthenticated()) { toast.info('Please sign in before booking a ticket.'); navigate('/login'); return; }
    setBooking(true);
    try { const { data } = await API.post('/bookings', { eventId: Number(id), ticketsBooked: Number(tickets) }); toast.success(`Booking confirmed: ${data.bookingReference}`); navigate('/my-bookings'); }
    catch (err) { toast.error(err.response?.data?.message || 'Booking failed. Please try again.'); }
    finally { setBooking(false); }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!event) return <div className="container py-5"><div className="empty-state"><h3>We couldn't find that event.</h3><Link to="/events" className="btn btn-primary">Back to events</Link></div></div>;

  return <div className="page-shell"><div className="container py-4 py-md-5">
    <Link to="/events" className="back-link">← Back to events</Link>
    <div className="details-layout mt-3">
      <section className="details-main">
        <div className="event-card-top"><span className="category-pill">{event.category}</span><span className={`status-pill ${event.status === 'EXPIRED' ? 'status-expired' : event.status === 'SOLD_OUT' ? 'status-sold' : 'status-live'}`}>{event.status === 'EXPIRED' ? 'Expired' : event.status === 'SOLD_OUT' ? 'Sold out' : 'Upcoming'}</span></div>
        <h1>{event.eventName}</h1>
        <p className="lead event-lead">A simple, clear place to plan your visit and reserve your tickets.</p>
        <div className="detail-facts"><div><small>WHEN</small><strong>{new Date(event.eventDate).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</strong></div><div><small>WHERE</small><strong>{event.location}</strong></div></div>
        <div className="availability-panel"><div><small>Tickets available</small><strong>{event.availableSeats}</strong></div><div><small>Price per ticket</small><strong>₹{Number(event.ticketPrice).toFixed(2)}</strong></div><div><small>Booking closes</small><strong>{new Date(cutoff).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</strong></div></div>
      </section>
      <aside className="booking-card">
        <p className="eyebrow">RESERVE YOUR SPOT</p><h2>Book tickets</h2>
        {bookingOpen ? <>
          <label className="form-label">How many tickets?</label>
          <input type="number" className="form-control form-control-lg" min="1" max={event.availableSeats} value={tickets} onChange={e => setTickets(Math.min(event.availableSeats, Math.max(1, Number(e.target.value) || 1)))} />
          <div className="booking-total"><span>Total</span><strong>₹{total.toFixed(2)}</strong></div>
          <button className="btn btn-primary btn-lg w-100" disabled={booking} onClick={handleBook}>{booking ? 'Confirming…' : 'Confirm booking'}</button>
          <p className="help-text">Bookings close automatically 1 hour before the event starts.</p>
        </> : <div className="notice-box">{event.status === 'EXPIRED' ? 'This event has already ended.' : event.status === 'SOLD_OUT' ? 'All tickets are currently sold out.' : 'Booking is closed because the event starts in less than 1 hour.'}</div>}
      </aside>
    </div>
  </div></div>;
};
export default EventDetails;
