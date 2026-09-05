import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import UserDashboard from './pages/UserDashboard';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateEvent from './pages/admin/CreateEvent';
import EditEvent from './pages/admin/EditEvent';
import ManageEvents from './pages/admin/ManageEvents';
import AllBookings from './pages/admin/AllBookings';
import TicketSales from './pages/admin/TicketSales';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetails />} />

            <Route path="/dashboard" element={
              <ProtectedRoute><UserDashboard /></ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute><MyBookings /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="/admin/events" element={
              <AdminRoute><ManageEvents /></AdminRoute>
            } />
            <Route path="/admin/events/new" element={
              <AdminRoute><CreateEvent /></AdminRoute>
            } />
            <Route path="/admin/events/:id/edit" element={
              <AdminRoute><EditEvent /></AdminRoute>
            } />
            <Route path="/admin/bookings" element={
              <AdminRoute><AllBookings /></AdminRoute>
            } />
            <Route path="/admin/sales" element={
              <AdminRoute><TicketSales /></AdminRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
