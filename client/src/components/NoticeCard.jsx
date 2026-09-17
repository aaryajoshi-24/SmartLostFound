import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Tag } from 'lucide-react';

const NoticeCard = ({ item }) => {
  const isLost = item.type === 'lost';

  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getStatusClass = (status) => {
    if (status === 'Active') return 'status-active';
    if (status === 'Claimed') return 'status-claimed';
    return 'status-resolved';
  };

  return (
    <div
      className="clean-card clean-card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Optional Photo */}
      {item.image && (
        <div style={{ width: '100%', height: '170px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
          <img
            src={item.image}
            alt={item.title}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Header Tags */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
          }}
        >
          <span className={isLost ? 'tag-lost' : 'tag-found'}>
            {isLost ? 'Lost' : 'Found'}
          </span>

          <span
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '0.15rem 0.5rem',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <Tag size={11} /> {item.category}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: '600',
            lineHeight: 1.3,
            marginBottom: '0.45rem',
            color: '#0f172a',
          }}
        >
          <Link
            to={`/items/${item._id}`}
            style={{
              color: 'inherit',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#2563eb')}
            onMouseLeave={(e) => (e.target.style.color = 'inherit')}
          >
            {item.title}
          </Link>
        </h3>

        {/* Description Snippet */}
        <p
          style={{
            fontSize: '0.88rem',
            lineHeight: 1.5,
            color: '#64748b',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.description}
        </p>

        {/* Metadata Details */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            fontSize: '0.82rem',
            color: '#64748b',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.location}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <span>{isLost ? 'Lost on ' : 'Found on '}{formattedDate}</span>
          </div>
        </div>

        {/* Footer: Status Pill & View Details Button */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.25rem',
          }}
        >
          <span className={`status-pill ${getStatusClass(item.status)}`}>
            {item.status}
          </span>

          <Link
            to={`/items/${item._id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.88rem',
              fontWeight: '600',
              color: '#2563eb',
              textDecoration: 'none',
            }}
          >
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoticeCard;
