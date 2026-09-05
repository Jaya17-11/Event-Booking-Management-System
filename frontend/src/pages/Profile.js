import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users/profile')
      .then(({ data }) => setProfile(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">My Profile</h2>
      <div className="card shadow border-0" style={{ maxWidth: '500px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div className="profile-avatar mx-auto mb-3">
              <i className="bi bi-person-fill"></i>
            </div>
            <h4 className="fw-bold">{profile?.name}</h4>
            <span className="badge bg-primary">{profile?.role}</span>
          </div>
          <hr />
          <div className="mb-3">
            <label className="text-muted small">Email</label>
            <div className="fw-medium">{profile?.email}</div>
          </div>
          <div className="mb-3">
            <label className="text-muted small">Phone</label>
            <div className="fw-medium">{profile?.phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
