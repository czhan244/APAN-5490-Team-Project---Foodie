import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchUserProfile();
  }, [fetchUserProfile, navigate]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center">Failed to load user profile</div>;
  }

  return (
    <div className="profile">
      <h1>My Account</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
          </div>
          <div className="user-info">
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            {user.bio && <p className="bio">{user.bio}</p>}
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-item">
            <span className="label">Register Date:</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <span className="label">User Type:</span>
            <span>{user.isAdmin ? 'Admin' : 'Regular'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 