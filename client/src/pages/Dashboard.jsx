import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  BarChart3,
  RefreshCw,
  Tag,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Could not retrieve tally stats from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="noticeboard-frame" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="pin-card" style={{ display: 'inline-block', padding: '2rem 3rem' }}>
          <div className="pushpin"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>
          <p style={{ fontFamily: 'var(--font-marker)', fontSize: '1.4rem' }}>Tallying up community counts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="noticeboard-frame" style={{ maxWidth: '1080px' }}>
      {/* Header */}
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
              color: '#442812',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <BarChart3 size={32} color="#78350f" /> Community Tally Board
          </h1>
          <p style={{ color: '#5c3817', fontSize: '0.95rem' }}>
            Live campus tally counters updated directly from MongoDB.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          className="btn-cork-primary"
          style={{ fontSize: '1rem' }}
        >
          <RefreshCw size={15} /> Refresh Tally
        </button>
      </div>

      {error && (
        <div className="notice-alert notice-alert-error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* Main Tally Blackboard */}
          <div
            className="chalk-board"
            style={{
              padding: '2.25rem 2rem',
              marginBottom: '2.5rem',
            }}
          >
            <div
              style={{
                borderBottom: '2px dashed rgba(255,255,255,0.2)',
                paddingBottom: '1rem',
                marginBottom: '1.75rem',
                textAlign: 'center',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-marker)',
                  fontSize: '2.4rem',
                  letterSpacing: '0.05em',
                  color: '#fef08a',
                  textShadow: '0 0 8px rgba(254, 240, 138, 0.4)',
                }}
              >
                CAMPUS DISPATCH TALLY SHEET
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: '1.25rem',
                  color: '#cbd5e1',
                }}
              >
                Official count of lost, found, and resolved articles
              </span>
            </div>

            {/* 4 Primary Stamped Counters */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                textAlign: 'center',
              }}
            >
              {/* Lost Items */}
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '2px solid #ef4444',
                  borderRadius: '6px',
                  padding: '1.25rem 1rem',
                  boxShadow: 'inset 0 0 10px rgba(239, 68, 68, 0.2)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-marker)',
                    fontSize: '1.2rem',
                    color: '#fca5a5',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem',
                  }}
                >
                  ⚠ Total Lost
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-marker)',
                    fontSize: '4.2rem',
                    lineHeight: 1,
                    color: '#fee2e2',
                    textShadow: '0 0 12px rgba(239, 68, 68, 0.6)',
                  }}
                >
                  {stats.totalLost}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '0.4rem' }}>
                  Reported Missing
                </div>
              </div>

              {/* Found Items */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '2px solid #10b981',
                  borderRadius: '6px',
                  padding: '1.25rem 1rem',
                  boxShadow: 'inset 0 0 10px rgba(16, 185, 129, 0.2)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-marker)',
                    fontSize: '1.2rem',
                    color: '#86efac',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem',
                  }}
                >
                  ✦ Total Found
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-marker)',
                    fontSize: '4.2rem',
                    lineHeight: 1,
                    color: '#dcfce7',
                    textShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
                  }}
                >
                  {stats.totalFound}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: '0.4rem' }}>
                  Handed In by Finders
                </div>
              </div>

              {/* Active Reports */}
              <div
                style={{
                  background: 'rgba(234, 179, 8, 0.12)',
                  border: '2px solid #eab308',
                  borderRadius: '6px',
                  padding: '1.25rem 1rem',
                  boxShadow: 'inset 0 0 10px rgba(234, 179, 8, 0.2)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-marker)',
                    fontSize: '1.2rem',
                    color: '#fde047',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem',
                  }}
                >
                  📋 Active Notices
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-marker)',
                    fontSize: '4.2rem',
                    lineHeight: 1,
                    color: '#fef08a',
                    textShadow: '0 0 12px rgba(234, 179, 8, 0.6)',
                  }}
                >
                  {stats.activeReports}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#facc15', marginTop: '0.4rem' }}>
                  Currently Pending Resolution
                </div>
              </div>

              {/* Resolved / Claimed */}
              <div
                style={{
                  background: 'rgba(96, 165, 250, 0.12)',
                  border: '2px solid #60a5fa',
                  borderRadius: '6px',
                  padding: '1.25rem 1rem',
                  boxShadow: 'inset 0 0 10px rgba(96, 165, 250, 0.2)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-marker)',
                    fontSize: '1.2rem',
                    color: '#bfdbfe',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem',
                  }}
                >
                  🎉 Reunited / Claimed
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-marker)',
                    fontSize: '4.2rem',
                    lineHeight: 1,
                    color: '#dbeafe',
                    textShadow: '0 0 12px rgba(96, 165, 250, 0.6)',
                  }}
                >
                  {stats.resolvedOrClaimed}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#93c5fd', marginTop: '0.4rem' }}>
                  Successfully Returned
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Category Breakdown & Recent Notice Activity */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Category Breakdown Tag Card */}
            <div
              className="pin-card"
              style={{
                background: '#fffdf5',
                padding: '1.75rem',
                border: '2px solid #d4b996',
              }}
            >
              <div className="pushpin pushpin-brass"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>

              <h3
                style={{
                  fontFamily: 'var(--font-marker)',
                  fontSize: '1.75rem',
                  color: '#442812',
                  marginBottom: '1rem',
                  borderBottom: '2px dashed #e2d2ba',
                  paddingBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Tag size={20} color="#b45309" /> Notices by Category
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {Object.entries(stats.categoryBreakdown || {}).map(([cat, count]) => {
                  const total = stats.totalLost + stats.totalFound || 1;
                  const pct = Math.round((count / total) * 100);

                  return (
                    <div key={cat}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          marginBottom: '0.25rem',
                          color: '#5c3817',
                        }}
                      >
                        <span>{cat}</span>
                        <span>{count} items ({pct}%)</span>
                      </div>
                      <div
                        style={{
                          height: '10px',
                          background: '#f1e6d4',
                          borderRadius: '5px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: 'linear-gradient(90deg, #d97706, #b45309)',
                            borderRadius: '5px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Notices Activity */}
            <div
              className="pin-card"
              style={{
                background: '#fffdf5',
                padding: '1.75rem',
                border: '2px solid #d4b996',
              }}
            >
              <div className="pushpin"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>

              <h3
                style={{
                  fontFamily: 'var(--font-marker)',
                  fontSize: '1.75rem',
                  color: '#442812',
                  marginBottom: '1rem',
                  borderBottom: '2px dashed #e2d2ba',
                  paddingBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Clock size={20} color="#b45309" /> Recent Board Activity
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.recentItems && stats.recentItems.length > 0 ? (
                  stats.recentItems.map((item) => (
                    <Link
                      key={item._id}
                      to={`/items/${item._id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.75rem',
                        background: item.type === 'lost' ? 'var(--paper-lost)' : 'var(--paper-found)',
                        border: `1px solid ${item.type === 'lost' ? '#fecdd3' : '#a7f3d0'}`,
                        borderRadius: '4px',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'transform 0.15s',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              color: item.type === 'lost' ? '#b91c1c' : '#047857',
                            }}
                          >
                            {item.type === 'lost' ? 'Lost' : 'Found'}
                          </span>
                          <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#272320' }}>
                            {item.title}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#78716c', marginTop: '0.2rem' }}>
                          {item.location} • {new Date(item.date).toLocaleDateString()}
                        </div>
                      </div>
                      <ArrowRight size={14} color="#78350f" />
                    </Link>
                  ))
                ) : (
                  <p style={{ color: '#78716c', fontStyle: 'italic' }}>No recent activity yet.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
