import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  AlertTriangle,
  Trash2,
  Edit3,
  ShieldCheck,
} from 'lucide-react';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [claimsData, setClaimsData] = useState({ isReporter: false, claims: [] });
  const [claimMessage, setClaimMessage] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const fetchItemAndClaims = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/items/${id}`);
      setItem(res.data);

      if (isAuthenticated) {
        try {
          const claimsRes = await api.get(`/claims/item/${id}`);
          setClaimsData(claimsRes.data);
        } catch (claimsErr) {
          console.warn('Could not fetch claims:', claimsErr);
        }
      }
    } catch (err) {
      console.error('Error fetching item:', err);
      setError(err.response?.data?.message || 'Notice could not be found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemAndClaims();
  }, [id, isAuthenticated]);

  const isReporter =
    isAuthenticated &&
    user &&
    item &&
    item.reportedBy &&
    (user._id === item.reportedBy._id || user._id === item.reportedBy);

  // Check if current user already submitted a claim
  const myClaim =
    !isReporter &&
    claimsData.claims.find(
      (c) =>
        c.claimantId?._id === user?._id ||
        c.claimantId === user?._id
    );

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!claimMessage.trim()) {
      setFeedback({ type: 'error', text: 'Please provide proof or description in your claim message.' });
      return;
    }

    try {
      setClaimLoading(true);
      setFeedback({ type: '', text: '' });
      await api.post('/claims', {
        itemId: item._id,
        message: claimMessage.trim(),
      });
      setFeedback({
        type: 'success',
        text: 'Your claim request has been posted to the finder for verification!',
      });
      setClaimMessage('');
      fetchItemAndClaims();
    } catch (err) {
      console.error('Error submitting claim:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit claim request. Please try again.',
      });
    } finally {
      setClaimLoading(false);
    }
  };

  const handleApproveClaim = async (claimId) => {
    try {
      setActionLoadingId(claimId);
      const res = await api.patch(`/claims/${claimId}/approve`);
      setFeedback({
        type: 'success',
        text: res.data.message || 'Claim approved! Item marked as Claimed.',
      });
      fetchItemAndClaims();
    } catch (err) {
      console.error('Error approving claim:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to approve claim.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectClaim = async (claimId) => {
    try {
      setActionLoadingId(claimId);
      const res = await api.patch(`/claims/${claimId}/reject`);
      setFeedback({
        type: 'success',
        text: res.data.message || 'Claim was rejected.',
      });
      fetchItemAndClaims();
    } catch (err) {
      console.error('Error rejecting claim:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to reject claim.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteItem = async () => {
    if (window.confirm('Are you sure you want to remove this notice from the board?')) {
      try {
        await api.delete(`/items/${item._id}`);
        navigate('/my-reports');
      } catch (err) {
        console.error('Error deleting item:', err);
        setFeedback({
          type: 'error',
          text: err.response?.data?.message || 'Failed to delete notice.',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="noticeboard-frame" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="pin-card" style={{ display: 'inline-block', padding: '2rem 3rem' }}>
          <div className="pushpin"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>
          <p style={{ fontFamily: 'var(--font-marker)', fontSize: '1.4rem' }}>Unpinning notice details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="noticeboard-frame" style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <div className="pin-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="pushpin"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>
          <h2 style={{ fontFamily: 'var(--font-marker)', fontSize: '1.8rem', color: '#991b1b', marginBottom: '1rem' }}>
            Notice Not Found
          </h2>
          <p style={{ marginBottom: '1.5rem', color: '#5e5751' }}>{error || 'This flyer may have been taken down or removed.'}</p>
          <Link to="/" className="btn-cork-primary">
            <ArrowLeft size={16} /> Return to Corkboard
          </Link>
        </div>
      </div>
    );
  }

  const isLost = item.type === 'lost';
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="noticeboard-frame" style={{ maxWidth: '960px' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#3e240f',
            fontFamily: 'var(--font-marker)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <ArrowLeft size={18} /> Back to Corkboard
        </button>
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

      {/* Main Notice Flyer Container */}
      <div
        className="pin-card"
        style={{
          background: isLost ? 'var(--paper-lost)' : 'var(--paper-found)',
          border: `2px solid ${isLost ? 'var(--lost-border)' : 'var(--found-border)'}`,
          padding: '2rem',
          marginBottom: '2rem',
        }}
      >
        <div className={`pushpin ${isLost ? '' : 'pushpin-green'}`}>
          <div className="pushpin-head"></div>
          <div className="pushpin-point"></div>
        </div>

        {/* Top Tag & Status Stamp Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            borderBottom: '2px dashed rgba(0,0,0,0.15)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              className={isLost ? 'badge-lost' : 'badge-found'}
              style={{
                fontSize: '1.25rem',
                padding: '0.35rem 0.9rem',
                borderRadius: '4px',
              }}
            >
              {isLost ? '⚠ OFFICIAL LOST NOTICE' : '✦ OFFICIAL FOUND NOTICE'}
            </span>
            <span
              style={{
                background: '#fff',
                border: '1px solid #d6c7b2',
                borderRadius: '20px',
                padding: '0.3rem 0.8rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--ink-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Tag size={13} /> {item.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              className={`stamp ${
                item.status === 'Active'
                  ? 'stamp-active'
                  : item.status === 'Claimed'
                  ? 'stamp-claimed'
                  : 'stamp-resolved'
              }`}
              style={{ fontSize: '1.15rem', padding: '0.35rem 0.85rem' }}
            >
              {item.status}
            </span>

            {/* If owner, show edit / delete buttons */}
            {isReporter && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to={`/items/${item._id}/edit`}
                  style={{
                    background: '#fef3c7',
                    border: '1px solid #d97706',
                    color: '#92400e',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Edit3 size={14} /> Edit
                </Link>
                <button
                  type="button"
                  onClick={handleDeleteItem}
                  style={{
                    background: '#fee2e2',
                    border: '1px solid #dc2626',
                    color: '#991b1b',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Layout (Photo + Details) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: item.image ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* Polaroid Photo Frame */}
          {item.image && (
            <div
              className="polaroid-frame"
              style={{
                textAlign: 'center',
                margin: '0 auto',
                maxWidth: '400px',
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
                  maxHeight: '320px',
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: '2px',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-marker)',
                  color: '#78350f',
                  fontSize: '1rem',
                  marginTop: '0.65rem',
                }}
              >
                Attached Photograph / Evidence
              </p>
            </div>
          )}

          {/* Details & Description */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-marker)',
                fontSize: '2.2rem',
                lineHeight: 1.15,
                color: 'var(--ink-primary)',
                marginBottom: '1rem',
              }}
            >
              {item.title}
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                background: 'rgba(255,255,255,0.7)',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid rgba(0,0,0,0.08)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#78350f' }}>
                <MapPin size={16} />
                <span style={{ fontWeight: 600 }}>Location:</span>
                <span>{item.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#57534e' }}>
                <Calendar size={16} />
                <span style={{ fontWeight: 600 }}>{isLost ? 'Date Lost:' : 'Date Found:'}</span>
                <span>{formattedDate}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#57534e' }}>
                <User size={16} />
                <span style={{ fontWeight: 600 }}>Pinned by:</span>
                <span>{item.reportedBy?.name || 'Anonymous Student'} ({item.reportedBy?.email})</span>
              </div>
            </div>

            <h4
              style={{
                fontFamily: 'var(--font-marker)',
                fontSize: '1.25rem',
                color: '#5c3817',
                marginBottom: '0.4rem',
              }}
            >
              Description & Identifying Marks:
            </h4>
            <div
              style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: 'var(--ink-primary)',
                whiteSpace: 'pre-line',
                background: '#fff',
                padding: '1rem',
                borderRadius: '4px',
                border: '1px solid #e7d8c5',
              }}
            >
              {item.description}
            </div>
          </div>
        </div>
      </div>

      {/* CLAIM WORKFLOW SECTION */}
      {/* 1. If it's a found item and viewer is NOT the reporter */}
      {!isLost && !isReporter && (
        <div
          className="ruled-paper"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={26} style={{ color: '#059669' }} />
            <h3 style={{ fontFamily: 'var(--font-marker)', fontSize: '1.85rem', color: '#065f46' }}>
              Is this your item? File a Claim
            </h3>
          </div>
          <p style={{ color: '#57534e', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
            To protect student belongings, the finder will inspect your claim message and verify proof (e.g. distinctive scratches, lock screen image, serial digits, contents).
          </p>

          {/* If user not logged in */}
          {!isAuthenticated ? (
            <div
              style={{
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                padding: '1rem',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <strong style={{ color: '#92400e' }}>Sign in to submit a claim request.</strong>
                <p style={{ fontSize: '0.85rem', color: '#b45309' }}>
                  Logging in connects you directly with the finder to reclaim your item.
                </p>
              </div>
              <Link to="/login" className="btn-cork-primary" style={{ fontSize: '1rem' }}>
                Sign In Now
              </Link>
            </div>
          ) : myClaim ? (
            /* User already has a claim on this item */
            <div
              style={{
                background:
                  myClaim.status === 'Approved'
                    ? '#ecfdf5'
                    : myClaim.status === 'Rejected'
                    ? '#fef2f2'
                    : '#fffbeb',
                border: `2px solid ${
                  myClaim.status === 'Approved'
                    ? '#10b981'
                    : myClaim.status === 'Rejected'
                    ? '#ef4444'
                    : '#f59e0b'
                }`,
                borderRadius: '6px',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {myClaim.status === 'Approved' && <CheckCircle size={22} color="#059669" />}
                {myClaim.status === 'Rejected' && <XCircle size={22} color="#dc2626" />}
                {myClaim.status === 'Pending' && <Clock size={22} color="#d97706" />}
                <h4 style={{ fontFamily: 'var(--font-marker)', fontSize: '1.4rem', color: 'var(--ink-primary)' }}>
                  Your Claim Status: <span style={{ textTransform: 'uppercase' }}>{myClaim.status}</span>
                </h4>
              </div>
              <p style={{ fontSize: '0.92rem', color: '#444', marginBottom: '0.5rem' }}>
                <strong>Your proof message:</strong> "{myClaim.message}"
              </p>
              {myClaim.status === 'Approved' && (
                <div style={{ color: '#065f46', fontSize: '0.9rem', fontWeight: 600 }}>
                  🎉 Great news! The finder approved your claim. You can contact them at {item.reportedBy?.email} to coordinate pickup.
                </div>
              )}
              {myClaim.status === 'Pending' && (
                <div style={{ color: '#92400e', fontSize: '0.88rem' }}>
                  ⏳ Your claim has been sent. The finder will review it shortly.
                </div>
              )}
              {myClaim.status === 'Rejected' && (
                <div style={{ color: '#991b1b', fontSize: '0.88rem' }}>
                  The finder indicated this claim did not match the item's identifying details.
                </div>
              )}
            </div>
          ) : item.status === 'Claimed' || item.status === 'Resolved' ? (
            <div className="notice-alert" style={{ background: '#f1f5f9', borderLeftColor: '#64748b' }}>
              This item has already been marked as <strong>{item.status}</strong> and is no longer accepting new claims.
            </div>
          ) : (
            /* Claim Submission Form */
            <form onSubmit={handleSubmitClaim}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-marker)',
                    fontSize: '1.15rem',
                    color: '#5c3817',
                    marginBottom: '0.35rem',
                  }}
                >
                  Describe Your Proof of Ownership:
                </label>
                <textarea
                  rows={4}
                  className="paper-input"
                  placeholder="Provide identifying features only the real owner would know: wallpaper/lockscreen, specific stickers, hidden marks, exact contents, serial number, etc."
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={claimLoading}
                className="btn-tag-found"
                style={{ fontSize: '1.1rem' }}
              >
                <Send size={16} />
                {claimLoading ? 'Filing Claim...' : 'Submit Claim Request to Finder'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* 2. CLAIMS RECEIVED LIST (Visible to Reporter on Found Items) */}
      {isReporter && !isLost && (
        <div
          className="ruled-paper"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              borderBottom: '2px dashed #d6c7b2',
              paddingBottom: '0.75rem',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-marker)',
                fontSize: '1.75rem',
                color: '#442812',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <ShieldCheck size={24} color="#b45309" />
              Incoming Claim Requests ({claimsData.claims.length})
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#78350f', fontWeight: 600 }}>
              Only you (the finder) can review these
            </span>
          </div>

          {claimsData.claims.length === 0 ? (
            <p style={{ color: '#78716c', fontStyle: 'italic', padding: '1rem 0' }}>
              No claims have been submitted for this found item yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {claimsData.claims.map((c) => (
                <div
                  key={c._id}
                  style={{
                    background: '#fff',
                    border: '1px solid #e7d8c5',
                    borderRadius: '6px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--ink-primary)' }}>
                        {c.claimantId?.name || 'Student'}
                      </strong>{' '}
                      <span style={{ color: '#78716c', fontSize: '0.85rem' }}>
                        ({c.claimantId?.email})
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        className={`stamp ${
                          c.status === 'Approved'
                            ? 'stamp-active'
                            : c.status === 'Rejected'
                            ? 'stamp-resolved'
                            : 'stamp-claimed'
                        }`}
                        style={{ fontSize: '0.85rem', padding: '0.15rem 0.5rem' }}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>

                  <p
                    style={{
                      background: '#fffdf5',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      borderLeft: '3px solid #b45309',
                      fontSize: '0.92rem',
                      color: 'var(--ink-primary)',
                      marginBottom: '0.85rem',
                    }}
                  >
                    "{c.message}"
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', color: '#a8a29e' }}>
                      Received: {new Date(c.createdAt).toLocaleString()}
                    </span>

                    {/* Action buttons if Pending */}
                    {c.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => handleApproveClaim(c._id)}
                          disabled={actionLoadingId === c._id}
                          style={{
                            background: '#16a34a',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.35rem 0.85rem',
                            fontFamily: 'var(--font-marker)',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <CheckCircle size={15} /> Approve & Mark Claimed
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectClaim(c._id)}
                          disabled={actionLoadingId === c._id}
                          style={{
                            background: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.35rem 0.85rem',
                            fontFamily: 'var(--font-marker)',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <XCircle size={15} /> Reject
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
};

export default ItemDetail;
