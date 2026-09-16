import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  ClipboardList,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const MyReports = () => {
  const [items, setItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('reported'); // 'reported' or 'myClaims'
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [itemClaimsMap, setItemClaimsMap] = useState({});

  const fetchMyData = async () => {
    try {
      setLoading(true);
      setError('');

      const [itemsRes, claimsRes] = await Promise.all([
        api.get('/items/user/my-items'),
        api.get('/claims/my-claims'),
      ]);

      setItems(itemsRes.data);
      setMyClaims(claimsRes.data);
    } catch (err) {
      console.error('Error loading my reports:', err);
      setError(err.response?.data?.message || 'Could not load your reported notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const res = await api.patch(`/items/${itemId}/status`, { status: newStatus });
      setFeedback({ type: 'success', text: `Item status updated to ${newStatus}` });
      setItems((prev) =>
        prev.map((it) => (it._id === itemId ? { ...it, status: newStatus } : it))
      );
    } catch (err) {
      console.error('Error changing status:', err);
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to update status' });
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to permanently delete this notice?')) {
      try {
        await api.delete(`/items/${itemId}`);
        setFeedback({ type: 'success', text: 'Notice removed from the board.' });
        setItems((prev) => prev.filter((it) => it._id !== itemId));
      } catch (err) {
        console.error('Error deleting item:', err);
        setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to delete notice' });
      }
    }
  };

  const toggleItemClaims = async (itemId) => {
    if (expandedItemId === itemId) {
      setExpandedItemId(null);
      return;
    }

    setExpandedItemId(itemId);
    if (!itemClaimsMap[itemId]) {
      try {
        const res = await api.get(`/claims/item/${itemId}`);
        setItemClaimsMap((prev) => ({ ...prev, [itemId]: res.data.claims }));
      } catch (err) {
        console.error('Failed to load claims for item:', err);
      }
    }
  };

  const handleApproveClaim = async (claimId, itemId) => {
    try {
      const res = await api.patch(`/claims/${claimId}/approve`);
      setFeedback({ type: 'success', text: 'Claim approved! Item marked as Claimed.' });
      // Refresh claims for this item
      const updatedClaimsRes = await api.get(`/claims/item/${itemId}`);
      setItemClaimsMap((prev) => ({ ...prev, [itemId]: updatedClaimsRes.data.claims }));
      // Update item in local list
      setItems((prev) =>
        prev.map((it) => (it._id === itemId ? { ...it, status: 'Claimed' } : it))
      );
    } catch (err) {
      console.error('Error approving claim:', err);
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to approve claim' });
    }
  };

  const handleRejectClaim = async (claimId, itemId) => {
    try {
      const res = await api.patch(`/claims/${claimId}/reject`);
      setFeedback({ type: 'success', text: 'Claim rejected.' });
      const updatedClaimsRes = await api.get(`/claims/item/${itemId}`);
      setItemClaimsMap((prev) => ({ ...prev, [itemId]: updatedClaimsRes.data.claims }));
    } catch (err) {
      console.error('Error rejecting claim:', err);
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to reject claim' });
    }
  };

  return (
    <div className="noticeboard-frame" style={{ maxWidth: '1080px' }}>
      {/* Page Title */}
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
            <ClipboardList size={32} color="#b45309" /> My Notice Folder
          </h1>
          <p style={{ color: '#5c3817', fontSize: '0.95rem' }}>
            Manage the notices you have pinned to the board and track incoming ownership claims.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/report-lost" className="btn-tag-lost">
            <Plus size={16} /> Report Lost
          </Link>
          <Link to="/report-found" className="btn-tag-found">
            <Plus size={16} /> Report Found
          </Link>
        </div>
      </div>

      {feedback.text && (
        <div
          className={`notice-alert ${
            feedback.type === 'error' ? 'notice-alert-error' : 'notice-alert-success'
          }`}
          style={{ marginBottom: '1.5rem' }}
        >
          {feedback.text}
        </div>
      )}

      {error && (
        <div className="notice-alert notice-alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          className={`sticky-tab ${activeTab === 'reported' ? 'active' : ''}`}
          onClick={() => setActiveTab('reported')}
          style={{ fontSize: '1.15rem' }}
        >
          📌 Notices I Reported ({items.length})
        </button>
        <button
          type="button"
          className={`sticky-tab ${activeTab === 'myClaims' ? 'active' : ''}`}
          onClick={() => setActiveTab('myClaims')}
          style={{ fontSize: '1.15rem' }}
        >
          🔍 Claims I Submitted ({myClaims.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="pin-card" style={{ display: 'inline-block', padding: '2rem 3rem' }}>
            <div className="pushpin"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>
            <p style={{ fontFamily: 'var(--font-marker)', fontSize: '1.4rem' }}>Opening your folder...</p>
          </div>
        </div>
      ) : activeTab === 'reported' ? (
        /* REPORTED ITEMS LIST */
        items.length === 0 ? (
          <div className="pin-card" style={{ padding: '3rem', textAlign: 'center', background: '#fffdf5' }}>
            <div className="pushpin"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>
            <h3 style={{ fontFamily: 'var(--font-marker)', fontSize: '1.8rem', color: '#5c3817', marginBottom: '0.75rem' }}>
              You haven't posted any notices yet
            </h3>
            <p style={{ color: '#78716c', marginBottom: '1.5rem' }}>
              Report a lost item to get community help or report something you found to return it.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/report-lost" className="btn-tag-lost">Post Lost Item</Link>
              <Link to="/report-found" className="btn-tag-found">Post Found Item</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {items.map((item) => {
              const isLost = item.type === 'lost';
              const claims = itemClaimsMap[item._id] || [];

              return (
                <div
                  key={item._id}
                  className="pin-card"
                  style={{
                    background: isLost ? 'var(--paper-lost)' : 'var(--paper-found)',
                    border: `2px solid ${isLost ? 'var(--lost-border)' : 'var(--found-border)'}`,
                    padding: '1.5rem',
                    transform: 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                    }}
                  >
                    {/* Item Summary */}
                    <div style={{ flex: 1, minWidth: '260px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                        <span className={isLost ? 'badge-lost' : 'badge-found'} style={{ padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                          {isLost ? '⚠ LOST' : '✦ FOUND'}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5e5751' }}>
                          {item.category}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#888' }}>
                          • {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 style={{ fontFamily: 'var(--font-marker)', fontSize: '1.65rem', color: 'var(--ink-primary)', marginBottom: '0.3rem' }}>
                        <Link to={`/items/${item._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {item.title}
                        </Link>
                      </h3>

                      <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', marginBottom: '0.75rem' }}>
                        {item.description}
                      </p>

                      <div style={{ fontSize: '0.82rem', color: '#78350f' }}>
                        <strong>Location:</strong> {item.location}
                      </div>
                    </div>

                    {/* Controls Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                      {/* Status select */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#5c3817' }}>Status:</span>
                        <select
                          className="paper-input"
                          value={item.status}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
                        >
                          <option value="Active">Active</option>
                          <option value="Claimed">Claimed</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          to={`/items/${item._id}`}
                          style={{
                            background: '#fff',
                            border: '1px solid #d6c7b2',
                            color: '#5c3817',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <ExternalLink size={13} /> View Flyer
                        </Link>
                        <Link
                          to={`/items/${item._id}/edit`}
                          style={{
                            background: '#fef3c7',
                            border: '1px solid #d97706',
                            color: '#92400e',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <Edit3 size={13} /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item._id)}
                          style={{
                            background: '#fee2e2',
                            border: '1px solid #dc2626',
                            color: '#991b1b',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '4px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>

                      {/* Toggle Claims button for found items */}
                      {!isLost && (
                        <button
                          type="button"
                          onClick={() => toggleItemClaims(item._id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#065f46',
                            fontFamily: 'var(--font-marker)',
                            fontSize: '1.05rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <ShieldCheck size={16} />
                          {expandedItemId === item._id ? 'Hide Claims' : 'Inspect Received Claims'}
                          {expandedItemId === item._id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Claims Section */}
                  {expandedItemId === item._id && (
                    <div
                      style={{
                        marginTop: '1.25rem',
                        borderTop: '2px dashed rgba(0,0,0,0.15)',
                        paddingTop: '1rem',
                        background: 'rgba(255,255,255,0.7)',
                        borderRadius: '4px',
                        padding: '1rem',
                      }}
                    >
                      <h4 style={{ fontFamily: 'var(--font-marker)', fontSize: '1.3rem', color: '#065f46', marginBottom: '0.75rem' }}>
                        Received Claim Requests for this Item:
                      </h4>

                      {claims.length === 0 ? (
                        <p style={{ color: '#78716c', fontStyle: 'italic', fontSize: '0.9rem' }}>
                          No one has submitted a claim for this found item yet.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {claims.map((c) => (
                            <div
                              key={c._id}
                              style={{
                                background: '#fff',
                                border: '1px solid #d6c7b2',
                                borderRadius: '4px',
                                padding: '0.85rem',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                                  {c.claimantId?.name} ({c.claimantId?.email})
                                </span>
                                <span
                                  className={`stamp ${
                                    c.status === 'Approved'
                                      ? 'stamp-active'
                                      : c.status === 'Rejected'
                                      ? 'stamp-resolved'
                                      : 'stamp-claimed'
                                  }`}
                                  style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}
                                >
                                  {c.status}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.88rem', color: '#444', marginBottom: '0.6rem' }}>
                                "{c.message}"
                              </p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#888' }}>
                                  {new Date(c.createdAt).toLocaleString()}
                                </span>

                                {c.status === 'Pending' && (
                                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleApproveClaim(c._id, item._id)}
                                      style={{
                                        background: '#16a34a',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '3px',
                                        fontSize: '0.82rem',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRejectClaim(c._id, item._id)}
                                      style={{
                                        background: '#dc2626',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '3px',
                                        fontSize: '0.82rem',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* MY SUBMITTED CLAIMS */
        myClaims.length === 0 ? (
          <div className="pin-card" style={{ padding: '3rem', textAlign: 'center', background: '#fffdf5' }}>
            <div className="pushpin"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>
            <h3 style={{ fontFamily: 'var(--font-marker)', fontSize: '1.8rem', color: '#5c3817', marginBottom: '0.75rem' }}>
              No Claims Filed Yet
            </h3>
            <p style={{ color: '#78716c', marginBottom: '1.5rem' }}>
              See a found item on the board that belongs to you? Submit a claim with proof from the notice page.
            </p>
            <Link to="/" className="btn-cork-primary">Browse Corkboard</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myClaims.map((claim) => (
              <div
                key={claim._id}
                className="pin-card"
                style={{
                  background: '#fffdf8',
                  padding: '1.5rem',
                  border: '1px solid #d6c7b2',
                  transform: 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontFamily: 'var(--font-marker)', fontSize: '1.45rem', color: '#442812' }}>
                    Claim on: {claim.itemId?.title || 'Notice'}
                  </h4>
                  <span
                    className={`stamp ${
                      claim.status === 'Approved'
                        ? 'stamp-active'
                        : claim.status === 'Rejected'
                        ? 'stamp-resolved'
                        : 'stamp-claimed'
                    }`}
                    style={{ fontSize: '0.85rem' }}
                  >
                    {claim.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.92rem', color: '#444', marginBottom: '0.6rem' }}>
                  <strong>Your Proof Message:</strong> "{claim.message}"
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #eee', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#888' }}>
                    Submitted on: {new Date(claim.createdAt).toLocaleDateString()}
                  </span>
                  {claim.itemId && (
                    <Link
                      to={`/items/${claim.itemId._id || claim.itemId}`}
                      style={{
                        fontFamily: 'var(--font-marker)',
                        color: '#78350f',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                      }}
                    >
                      <ExternalLink size={14} /> View Found Item
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MyReports;
