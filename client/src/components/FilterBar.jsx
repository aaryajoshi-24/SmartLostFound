import React from 'react';
import { Search, MapPin, RotateCcw } from 'lucide-react';

const categories = [
  'All',
  'Electronics',
  'Documents',
  'Accessories',
  'Bags',
  'Clothing',
  'Keys',
  'Other',
];

const FilterBar = ({ filters, onFilterChange, onReset }) => {
  const getTabStyle = (typeValue) => {
    const isActive = filters.type === typeValue;
    return {
      padding: '0.45rem 1rem',
      borderRadius: '6px',
      fontSize: '0.88rem',
      fontWeight: '600',
      cursor: 'pointer',
      border: isActive ? '1px solid #2563eb' : '1px solid #e2e8f0',
      backgroundColor: isActive ? '#eff6ff' : '#ffffff',
      color: isActive ? '#2563eb' : '#475569',
      transition: 'all 0.15s ease',
    };
  };

  return (
    <div
      className="clean-card"
      style={{
        padding: '1.25rem',
        marginBottom: '2rem',
      }}
    >
      {/* Top Row: Type Segment Toggles & Reset */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            style={getTabStyle('')}
            onClick={() => onFilterChange('type', '')}
          >
            All Notices
          </button>
          <button
            type="button"
            style={getTabStyle('lost')}
            onClick={() => onFilterChange('type', 'lost')}
          >
            Lost Items
          </button>
          <button
            type="button"
            style={getTabStyle('found')}
            onClick={() => onFilterChange('type', 'found')}
          >
            Found Items
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="btn-secondary btn-sm"
          style={{ fontSize: '0.82rem' }}
        >
          <RotateCcw size={13} /> Reset Filters
        </button>
      </div>

      {/* Filter Inputs Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Search */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: '600',
              color: '#475569',
              marginBottom: '0.35rem',
            }}
          >
            Keyword Search
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="e.g. Wallet, AirPods, ID card..."
              className="clean-input"
              value={filters.q}
              onChange={(e) => onFilterChange('q', e.target.value)}
              style={{ paddingLeft: '2.2rem' }}
            />
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: '600',
              color: '#475569',
              marginBottom: '0.35rem',
            }}
          >
            Category
          </label>
          <select
            className="clean-input"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat === 'All' ? '' : cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: '600',
              color: '#475569',
              marginBottom: '0.35rem',
            }}
          >
            Campus Location
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="e.g. Library, CS Lab..."
              className="clean-input"
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
              style={{ paddingLeft: '2.2rem' }}
            />
            <MapPin
              size={15}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: '600',
              color: '#475569',
              marginBottom: '0.35rem',
            }}
          >
            Status
          </label>
          <select
            className="clean-input"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Claimed">Claimed</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
