import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const statusLabel = (event) => event.status === 'EXPIRED' ? 'Expired' : event.status === 'SOLD_OUT' ? 'Sold out' : 'Available';
const statusClass = (event) => event.status === 'EXPIRED' ? 'status-expired' : event.status === 'SOLD_OUT' ? 'status-sold' : 'status-live';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  useEffect(() => {
    API.get('/events').then(({ data }) => setEvents(data)).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ['ALL', ...new Set(events.map(e => e.category))], [events]);
  const filtered = events.filter(e => {
    const term = search.toLowerCase().trim();
    const matchesSearch = !term || [e.eventName, e.category, e.location].some(value => value.toLowerCase().includes(term));
    const matchesCategory = category === 'ALL' || e.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page-shell">
      <div className="container py-4 py-md-5">
        <div className="section-heading mb-4">
          <div>
            <p className="eyebrow">FIND YOUR NEXT EXPERIENCE</p>
            <h1>Events worth showing up for.</h1>
            <p className="section-subtitle">Discover something you’ll actually look forward to.</p>
          </div>
          <span className="result-count">{filtered.length} {filtered.length === 1 ? 'event' : 'events'}</span>
        </div>

        <div className="filter-bar mb-4">
          <input className="form-control form-control-lg" type="search" placeholder="Search by event, category or place…" value={search} onChange={e => setSearch(e.target.value)} />
          <select className="form-select form-select-lg" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(item => <option key={item} value={item}>{item === 'ALL' ? 'All categories' : item}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">◌</div><h3>Nothing matches that search</h3><p>Try another event name, category or location.</p></div>
        ) : (
          <div className="row g-4">
            {filtered.map(event => {
              const bookingOpen = event.status !== 'EXPIRED' && event.status !== 'SOLD_OUT' && new Date(event.eventDate).getTime() - Date.now() > 60 * 60 * 1000;
              return <div key={event.id} className="col-md-6 col-xl-4">
                <article className="event-card h-100">
                  <div className="event-card-top"><span className="category-pill">{event.category}</span><span className={`status-pill ${statusClass(event)}`}>{statusLabel(event)}</span></div>
                  <h2>{event.eventName}</h2>
                  <p className="event-meta">{new Date(event.eventDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  <p className="event-meta">{event.location}</p>
                  <div className="event-card-bottom"><div><small>Tickets from</small><strong>₹{Number(event.ticketPrice).toFixed(2)}</strong></div><div className="text-end"><small>Available</small><strong>{event.availableSeats}</strong></div></div>
                  <Link className="btn btn-primary w-100 mt-3" to={`/events/${event.id}`}>{bookingOpen ? 'View & Book' : 'View Details'}</Link>
                </article>
              </div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
