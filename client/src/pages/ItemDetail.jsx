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
  Trash2,
  Edit3,
  ShieldCheck,
  AlertCircle,
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
      setFeedback({ type: 'error', text: 'Please provide proof or details in your claim message.' });
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
        text: 'Your claim request has been sent to the finder for review.',
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
    if (window.confirm('Are you sure you want to delete this notice?')) {
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

  const getStatusClass = (status) => {
    if (status === 'Active') return 'status-active';
    if (status === 'Claimed') return 'status-claimed';
    return 'status-resolved';
  };

  if (loading) {
    return (
      <div className="app-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: '#64748b' }}>Loading notice details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="app-container" style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <div className="clean-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#b91c1c', marginBottom: '0.75rem' }}>
            Notice Not Found
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error || 'This notice does not exist or has been deleted.'}</p>
          <Link to="/" className="btn-primary">
            <ArrowLeft size={16} /> Return to Notices
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
    <div className="app-container" style={{ maxWidth: '900px' }}>
      {/* Back Button */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#475569',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Notices
        </button>
      </div>

      {feedback.text && (
        <div
          className={`alert-box ${feedback.type === 'error' ? 'alert-error' : 'alert-success'}`}
          style={{ marginBottom: '1.5rem' }}
        >
          {feedback.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Notice Details Card */}
      <div className="clean-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        {/* Top Header Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className={isLost ? 'tag-lost' : 'tag-found'} style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
              {isLost ? 'Lost Item' : 'Found Item'}
            </span>

            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: '600',
                color: '#64748b',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Tag size={13} /> {item.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={`status-pill ${getStatusClass(item.status)}`} style={{ fontSize: '0.82rem', padding: '0.25rem 0.75rem' }}>
              {item.status}
            </span>

            {/* Reporter Edit/Delete Actions */}
            {isReporter && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/items/${item._id}/edit`} className="btn-secondary btn-sm">
                  <Edit3 size={13} /> Edit
                </Link>
                <button
                  type="button"
                  onClick={handleDeleteItem}
                  className="btn-danger btn-sm"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: item.image ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* Photo */}
          {item.image && (
            <div
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
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
                }}
              />
            </div>
          )}

          {/* Details */}
          <div>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#0f172a',
                lineHeight: 1.25,
                marginBottom: '1rem',
              }}
            >
              {item.title}
            </h2>

            {/* Metadata Badges */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                backgroundColor: '#f8fafc',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                marginBottom: '1.25rem',
                fontSize: '0.88rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                <MapPin size={15} style={{ color: '#64748b' }} />
                <span style={{ fontWeight: '600' }}>Location:</span>
                <span>{item.location}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                <Calendar size={15} style={{ color: '#64748b' }} />
                <span style={{ fontWeight: '600' }}>{isLost ? 'Date Lost:' : 'Date Found:'}</span>
                <span>{formattedDate}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                <User size={15} style={{ color: '#64748b' }} />
                <span style={{ fontWeight: '600' }}>Reported by:</span>
                <span>{item.reportedBy?.name || 'User'} ({item.reportedBy?.email})</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
                Description & Details
              </h4>
              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  color: '#475569',
                  whiteSpace: 'pre-line',
                }}
              >
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CLAIM SECTION */}
      {/* 1. For found items & user is NOT reporter */}
      {!isLost && !isReporter && (
        <div className="clean-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <ShieldCheck size={22} color="#059669" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a' }}>
              Is this your item? File an Ownership Claim
            </h3>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            The finder will review your proof message (e.g. unique scratches, serial numbers, exact contents) before releasing the item.
          </p>

          {!isAuthenticated ? (
            <div
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '1rem',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <strong style={{ color: '#1e40af', fontSize: '0.92rem' }}>Sign in to submit an ownership claim.</strong>
                <p style={{ fontSize: '0.82rem', color: '#3b82f6', marginTop: '0.15rem' }}>
                  Logging in allows the finder to verify and reply directly to your claim.
                </p>
              </div>
              <Link to="/login" className="btn-primary btn-sm">
                Sign In Now
              </Link>
            </div>
          ) : myClaim ? (
            <div
              style={{
                backgroundColor:
                  myClaim.status === 'Approved'
                    ? '#ecfdf5'
                    : myClaim.status === 'Rejected'
                    ? '#fef2f2'
                    : '#fffbeb',
                border: `1px solid ${
                  myClaim.status === 'Approved'
                    ? '#a7f3d0'
                    : myClaim.status === 'Rejected'
                    ? '#fecdd3'
                    : '#fde68a'
                }`,
                borderRadius: '8px',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                {myClaim.status === 'Approved' && <CheckCircle size={20} color="#059669" />}
                {myClaim.status === 'Rejected' && <XCircle size={20} color="#dc2626" />}
                {myClaim.status === 'Pending' && <Clock size={20} color="#b45309" />}
                <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#0f172a' }}>
                  Your Claim Status: <span style={{ textTransform: 'capitalize' }}>{myClaim.status}</span>
                </h4>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '0.5rem' }}>
                <strong>Your proof description:</strong> "{myClaim.message}"
              </p>
              {myClaim.status === 'Approved' && (
                <div style={{ color: '#047857', fontSize: '0.88rem', fontWeight: '500' }}>
                  The finder has approved your claim! Reach out to {item.reportedBy?.email} to arrange item collection.
                </div>
              )}
              {myClaim.status === 'Pending' && (
                <div style={{ color: '#b45309', fontSize: '0.88rem' }}>
                  Your claim is pending review by the finder.
                </div>
              )}
              {myClaim.status === 'Rejected' && (
                <div style={{ color: '#b91c1c', fontSize: '0.88rem' }}>
                  The finder did not verify this claim as matching the item details.
                </div>
              )}
            </div>
          ) : item.status === 'Claimed' || item.status === 'Resolved' ? (
            <div className="alert-box" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
              This item has already been marked as <strong>{item.status}</strong> and is no longer accepting new claims.
            </div>
          ) : (
            <form onSubmit={handleSubmitClaim}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    color: '#334155',
                    marginBottom: '0.35rem',
                  }}
                >
                  Describe Your Proof of Ownership:
                </label>
                <textarea
                  rows={4}
                  className="clean-input"
                  placeholder="Mention unique identifying features: wallpapers, serial digits, internal contents, scratches, or stickers..."
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={claimLoading}
                className="btn-primary"
                style={{ backgroundColor: '#059669', borderColor: '#059669' }}
              >
                <Send size={16} />
                {claimLoading ? 'Submitting...' : 'Submit Claim Request'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* 2. CLAIMS RECEIVED LIST (For Reporter on Found items) */}
      {isReporter && !isLost && (
        <div className="clean-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '0.75rem',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={22} color="#2563eb" />
              Incoming Claims ({claimsData.claims.length})
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Only you as the finder can review these
            </span>
          </div>

          {claimsData.claims.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              No claims have been submitted for this found item yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {claimsData.claims.map((c) => (
                <div
                  key={c._id}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1.25rem',
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
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                        {c.claimantId?.name || 'Student'}
                      </strong>{' '}
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                        ({c.claimantId?.email})
                      </span>
                    </div>

                    <span className={`status-pill ${getStatusClass(c.status)}`}>
                      {c.status}
                    </span>
                  </div>

                  <p
                    style={{
                      backgroundColor: '#ffffff',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.9rem',
                      color: '#334155',
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
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Received: {new Date(c.createdAt).toLocaleString()}
                    </span>

                    {c.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => handleApproveClaim(c._id)}
                          disabled={actionLoadingId === c._id}
                          className="btn-primary btn-sm"
                          style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                        >
                          <CheckCircle size={14} /> Approve & Mark Claimed
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectClaim(c._id)}
                          disabled={actionLoadingId === c._id}
                          className="btn-danger btn-sm"
                        >
                          <XCircle size={14} /> Reject
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
