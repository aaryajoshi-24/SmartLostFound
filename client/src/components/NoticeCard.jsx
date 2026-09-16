import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, User, Tag, ArrowRight } from 'lucide-react';

const NoticeCard = ({ item, index = 0 }) => {
  // Rotate variations
  const tilts = ['tilt-left-1', 'tilt-right-1', 'tilt-left-2', 'tilt-right-2'];
  const tiltClass = tilts[index % tilts.length];

  const isLost = item.type === 'lost';
  const pinClass = isLost ? '' : 'pushpin-green';

  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`pin-card ${tiltClass}`}
      style={{
        background: isLost ? 'var(--paper-lost)' : 'var(--paper-found)',
        border: `1px solid ${isLost ? 'var(--lost-border)' : 'var(--found-border)'}`,
        padding: '1.25rem 1.15rem 1.15rem 1.15rem',
      }}
    >
      {/* Pushpin Anchor */}
      <div className={`pushpin ${pinClass}`}>
        <div className="pushpin-head"></div>
        <div className="pushpin-point"></div>
      </div>

      {/* Card Header: Type Badge & Category */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <span
          className={isLost ? 'badge-lost' : 'badge-found'}
          style={{
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            textTransform: 'uppercase',
          }}
        >
          {isLost ? '⚠ LOST' : '✦ FOUND'}
        </span>

        <span
          style={{
            background: 'rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            padding: '0.15rem 0.5rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--ink-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <Tag size={11} />
          {item.category}
        </span>
      </div>

      {/* Optional Photo Preview */}
      {item.image && (
        <div
          className="polaroid-frame"
          style={{
            marginBottom: '0.85rem',
            alignSelf: 'center',
            width: '100%',
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            style={{
              width: '100%',
              height: '160px',
              objectFit: 'cover',
              display: 'block',
              borderRadius: '2px',
            }}
          />
        </div>
      )}

      {/* Item Title */}
      <h3
        style={{
          fontFamily: 'var(--font-marker)',
          fontSize: '1.45rem',
          lineHeight: '1.2',
          marginBottom: '0.45rem',
          color: 'var(--ink-primary)',
        }}
      >
        <Link
          to={`/items/${item._id}`}
          style={{
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          {item.title}
        </Link>
      </h3>

      {/* Description Snippet */}
      <p
        style={{
          fontSize: '0.88rem',
          lineHeight: '1.45',
          color: 'var(--ink-muted)',
          marginBottom: '0.85rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {item.description}
      </p>

      {/* Meta Information (Location & Date) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem',
          fontSize: '0.82rem',
          color: 'var(--ink-light)',
          borderTop: '1px dashed rgba(0,0,0,0.12)',
          paddingTop: '0.65rem',
          marginBottom: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin size={13} style={{ color: '#b45309', flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.location}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={13} style={{ color: '#78350f', flexShrink: 0 }} />
          <span>{isLost ? 'Lost on: ' : 'Found on: '}{formattedDate}</span>
        </div>
        {item.reportedBy && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <User size={13} style={{ color: '#57534e', flexShrink: 0 }} />
            <span>Pinned by: {item.reportedBy.name}</span>
          </div>
        )}
      </div>

      {/* Footer: Stamp Status & Inspect Link */}
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.4rem',
        }}
      >
        {/* Rubber Stamp */}
        <span
          className={`stamp ${
            item.status === 'Active'
              ? 'stamp-active'
              : item.status === 'Claimed'
              ? 'stamp-claimed'
              : 'stamp-resolved'
          }`}
        >
          {item.status}
        </span>

        {/* View flyer button */}
        <Link
          to={`/items/${item._id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            fontFamily: 'var(--font-marker)',
            fontSize: '1.05rem',
            color: '#78350f',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Inspect <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default NoticeCard;
