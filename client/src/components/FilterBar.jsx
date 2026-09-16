import React from 'react';
import { Search, Filter, RotateCcw, MapPin } from 'lucide-react';

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
  return (
    <div
      style={{
        background: '#fffdf8',
        border: '3px solid #8b572a',
        borderRadius: '6px',
        padding: '1.25rem',
        boxShadow: '0 8px 16px rgba(0,0,0,0.22), inset 0 0 10px rgba(139, 87, 42, 0.08)',
        marginBottom: '2rem',
        position: 'relative',
      }}
    >
      {/* Visual Tape Accent */}
      <div className="tape-top" />

      {/* Top row: Type Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: '2px dashed #e2d2ba',
          paddingBottom: '0.9rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-marker)',
              fontSize: '1.25rem',
              color: '#5c3817',
              marginRight: '0.4rem',
            }}
          >
            Board Section:
          </span>

          <button
            type="button"
            className={`sticky-tab ${filters.type === '' ? 'active' : ''}`}
            onClick={() => onFilterChange('type', '')}
          >
            📋 All Notices
          </button>
          <button
            type="button"
            className={`sticky-tab ${filters.type === 'lost' ? 'active' : ''}`}
            style={
              filters.type === 'lost'
                ? { background: '#fecaca', color: '#991b1b' }
                : { background: '#fee2e2', color: '#991b1b' }
            }
            onClick={() => onFilterChange('type', 'lost')}
          >
            ⚠ Lost Items
          </button>
          <button
            type="button"
            className={`sticky-tab ${filters.type === 'found' ? 'active' : ''}`}
            style={
              filters.type === 'found'
                ? { background: '#bbf7d0', color: '#166534' }
                : { background: '#dcfce7', color: '#166534' }
            }
            onClick={() => onFilterChange('type', 'found')}
          >
            ✦ Found Items
          </button>
        </div>

        {/* Reset button */}
        <button
          type="button"
          onClick={onReset}
          style={{
            background: 'transparent',
            border: '1px solid #c29b68',
            color: '#78350f',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            fontWeight: 600,
            padding: '0.35rem 0.75rem',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.target.style.background = '#fef3c7')}
          onMouseLeave={(e) => (e.target.style.background = 'transparent')}
        >
          <RotateCcw size={13} /> Reset Filters
        </button>
      </div>

      {/* Main Filter Controls Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'end',
        }}
      >
        {/* Keyword Search */}
        <div style={{ position: 'relative' }}>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-marker)',
              fontSize: '1.05rem',
              color: '#5c3817',
              marginBottom: '0.3rem',
            }}
          >
            Search Item or Notes:
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="e.g. Wallet, AirPods, keys..."
              className="paper-input"
              value={filters.q}
              onChange={(e) => onFilterChange('q', e.target.value)}
              style={{ paddingLeft: '2.3rem' }}
            />
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#a89a8b',
              }}
            />
          </div>
        </div>

        {/* Category Selector */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-marker)',
              fontSize: '1.05rem',
              color: '#5c3817',
              marginBottom: '0.3rem',
            }}
          >
            Category:
          </label>
          <select
            className="paper-input"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat === 'All' ? '' : cat}>
                {cat === 'All' ? '📂 All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-marker)',
              fontSize: '1.05rem',
              color: '#5c3817',
              marginBottom: '0.3rem',
            }}
          >
            Campus Location:
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="e.g. Library, CS Lab..."
              className="paper-input"
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
                color: '#a89a8b',
              }}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-marker)',
              fontSize: '1.05rem',
              color: '#5c3817',
              marginBottom: '0.3rem',
            }}
          >
            Report Status:
          </label>
          <select
            className="paper-input"
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
