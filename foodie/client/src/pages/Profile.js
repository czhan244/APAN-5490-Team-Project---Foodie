import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteError('');

    try {
      const token = localStorage.getItem('token');
      await axios.delete('/api/auth/delete-account', {
        headers: { Authorization: `Bearer ${token}` },
        data: { password: deletePassword }
      });

      // Clear local storage and redirect to home
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

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

        <div className="profile-actions">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-danger"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete Account</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="warning-text">
                ⚠️ This action cannot be undone. All your recipes, comments, and data will be permanently deleted.
              </p>
              <form onSubmit={handleDeleteAccount}>
                <div className="form-group">
                  <label htmlFor="deletePassword">Enter your password to confirm:</label>
                  <input
                    type="password"
                    id="deletePassword"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                </div>
                {deleteError && (
                  <div className="error-message">{deleteError}</div>
                )}
                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={() => setShowDeleteModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-danger"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 