import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import NoticeCard from '../components/NoticeCard';
import FilterBar from '../components/FilterBar';
import { Plus, AlertCircle, SearchX } from 'lucide-react';

const NoticeBoard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    q: '',
    type: '',
    category: '',
    location: '',
    status: '',
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (filters.q) params.append('q', filters.q);
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.status) params.append('status', filters.status);

      const res = await api.get(`/items?${params.toString()}`);
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.response?.data?.message || 'Could not load notices from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 250);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      q: '',
      type: '',
      category: '',
      location: '',
      status: '',
    });
  };

  return (
    <div className="app-container">
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#0f172a',
              letterSpacing: '-0.02em',
              marginBottom: '0.25rem',
            }}
          >
            Campus Noticeboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Search, report, and manage lost and found items across the campus community.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/report-lost"
            className="btn-primary"
            style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}
          >
            <Plus size={16} /> Report Lost Item
          </Link>
          <Link
            to="/report-found"
            className="btn-primary"
            style={{ backgroundColor: '#059669', borderColor: '#059669' }}
          >
            <Plus size={16} /> Report Found Item
          </Link>
        </div>
      </div>

      {/* Filter Component */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Error state */}
      {error && (
        <div className="alert-box alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div
            className="clean-card"
            style={{
              display: 'inline-block',
              padding: '2rem 3rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid #e2e8f0',
                borderTopColor: '#2563eb',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem',
              }}
            />
            <p style={{ fontSize: '0.95rem', fontWeight: '500', color: '#475569' }}>
              Loading campus notices...
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div
          className="clean-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            maxWidth: '520px',
            margin: '2rem auto',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <SearchX size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem' }}>
            No matching notices found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            We couldn't find any items matching your selected criteria. Try adjusting your filters or post a new notice.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary btn-sm"
            >
              Reset Filters
            </button>
            <Link to="/report-lost" className="btn-primary btn-sm">
              Post Lost Notice
            </Link>
          </div>
        </div>
      ) : (
        /* Card Grid */
        <div>
          <div
            style={{
              fontSize: '0.88rem',
              fontWeight: '500',
              color: '#64748b',
              marginBottom: '1rem',
            }}
          >
            Showing {items.length} {items.length === 1 ? 'notice' : 'notices'}
          </div>
          <div className="items-grid">
            {items.map((item) => (
              <NoticeCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
