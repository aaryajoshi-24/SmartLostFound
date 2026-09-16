import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import NoticeCard from '../components/NoticeCard';
import FilterBar from '../components/FilterBar';
import { Pin, Plus, AlertCircle, Sparkles } from 'lucide-react';

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
      setError(err.response?.data?.message || 'Could not load notices from the board. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search/filter query
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
    <div className="noticeboard-frame">
      {/* Pinned Board Header Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-marker)',
              fontSize: '2.5rem',
              lineHeight: 1.1,
              color: '#442812',
              textShadow: '1px 2px 2px rgba(255,255,255,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <Pin size={32} style={{ color: '#dc2626' }} />
            The Campus Corkboard
          </h1>
          <p
            style={{
              color: '#5c3817',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              marginTop: '0.25rem',
            }}
          >
            Lost something on campus? Or found an item waiting for its owner? Pin a notice below!
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/report-lost" className="btn-tag-lost">
            <Plus size={18} /> Pin Lost Notice
          </Link>
          <Link to="/report-found" className="btn-tag-found">
            <Plus size={18} /> Pin Found Notice
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
        <div className="notice-alert notice-alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div
          style={{
            padding: '4rem 1rem',
            textAlign: 'center',
          }}
        >
          <div
            className="pin-card"
            style={{
              display: 'inline-block',
              padding: '2.5rem 3rem',
              textAlign: 'center',
            }}
          >
            <div className="pushpin"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>
            <p style={{ fontFamily: 'var(--font-marker)', fontSize: '1.6rem', color: '#5c3817' }}>
              Scanning the noticeboard...
            </p>
            <p style={{ fontSize: '0.9rem', color: '#8c6b44', marginTop: '0.5rem' }}>
              Retrieving community notices from MongoDB
            </p>
          </div>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div
          style={{
            padding: '4rem 1rem',
            textAlign: 'center',
          }}
        >
          <div
            className="pin-card"
            style={{
              maxWidth: '520px',
              margin: '0 auto',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              background: '#fffdf5',
              border: '2px dashed #b89872',
            }}
          >
            <div className="pushpin pushpin-brass"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>
            <Sparkles size={38} style={{ color: '#d97706', margin: '0 auto 0.75rem' }} />
            <h3
              style={{
                fontFamily: 'var(--font-marker)',
                fontSize: '1.85rem',
                color: '#442812',
                marginBottom: '0.5rem',
              }}
            >
              No Notices Found on This Board
            </h3>
            <p
              style={{
                color: '#6e5a48',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                marginBottom: '1.5rem',
              }}
            >
              We couldn't find any notices matching your current search or filters. Try clearing your filters or be the first to post a notice!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleReset}
                className="btn-cork-primary"
                style={{ fontSize: '1rem' }}
              >
                Clear All Filters
              </button>
              <Link to="/report-lost" className="btn-tag-lost" style={{ fontSize: '1rem' }}>
                Post Lost Notice
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Pinboard Masonry Grid */
        <div>
          <div
            style={{
              fontFamily: 'var(--font-marker)',
              fontSize: '1.15rem',
              color: '#341e0c',
              marginBottom: '0.75rem',
              paddingLeft: '0.25rem',
            }}
          >
            Showing {items.length} {items.length === 1 ? 'Notice' : 'Notices'} Pinned on Board
          </div>
          <div className="pinboard-grid">
            {items.map((item, index) => (
              <NoticeCard key={item._id} item={item} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
