import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FoodRecalls.css';

const FoodRecalls = () => {
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    limit: 10,
    state: '',
    since: ''
  });

  const fetchRecalls = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.state) params.append('state', filters.state);
      if (filters.since) params.append('since', filters.since);

      const response = await axios.get(`/api/recalls?${params.toString()}`);
      setRecalls(response.data.results || []);
    } catch (err) {
      setError('Failed to fetch recall data');
      console.error('Error fetching recalls:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRecalls();
  }, [fetchRecalls]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecalls();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US');
  };

  const getClassificationColor = (classification) => {
    switch (classification?.toLowerCase()) {
      case 'class i': return '#dc3545';
      case 'class ii': return '#ffc107';
      case 'class iii': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="food-recalls">
      <div className="recalls-header">
        <h1>Food Safety Recalls</h1>
        <p>Stay informed about food recalls and safety alerts from the FDA</p>
      </div>

      <div className="recalls-filters">
        <form onSubmit={handleSearch}>
          <div className="filter-row">
            <div className="filter-group">
              <label>Number of Results:</label>
              <select name="limit" value={filters.limit} onChange={handleFilterChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="filter-group">
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
                placeholder="e.g., CA, NY, TX"
              />
            </div>

            <div className="filter-group">
              <label>Since Date:</label>
              <input
                type="text"
                name="since"
                value={filters.since}
                onChange={handleFilterChange}
                placeholder="YYYYMMDD (e.g., 20240101)"
              />
            </div>

            <button type="submit" className="search-btn">
              {loading ? 'Loading...' : 'Search Recalls'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="recalls-list">
        {loading ? (
          <div className="loading">Loading recall data...</div>
        ) : recalls.length > 0 ? (
          recalls.map((recall, index) => (
            <div key={index} className="recall-card">
              <div className="recall-header">
                <h3>{recall.product_description || 'Product Description Not Available'}</h3>
                <span 
                  className="classification-badge"
                  style={{ backgroundColor: getClassificationColor(recall.classification) }}
                >
                  {recall.classification || 'Unknown'}
                </span>
              </div>

              <div className="recall-details">
                <div className="detail-row">
                  <strong>Recall Number:</strong> {recall.recall_number || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Company:</strong> {recall.recalling_firm || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Location:</strong> {recall.city}, {recall.state} {recall.postal_code}
                </div>
                <div className="detail-row">
                  <strong>Report Date:</strong> {formatDate(recall.report_date)}
                </div>
                <div className="detail-row">
                  <strong>Reason:</strong> {recall.reason_for_recall || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Distribution:</strong> {recall.distribution_pattern || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Status:</strong> {recall.status || 'N/A'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-recalls">
            <p>No recall data found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodRecalls;
