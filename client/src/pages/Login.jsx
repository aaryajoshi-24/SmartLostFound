import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      if (!err.response) {
        setError('Cannot connect to backend server. Please ensure the backend server is running on port 5000.');
      } else {
        setError(err.response.data?.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="noticeboard-frame" style={{ maxWidth: '480px', margin: '3rem auto' }}>
      <div
        className="pin-card ruled-paper"
        style={{
          background: 'var(--paper-cream)',
          border: '2px solid #c29b68',
          padding: '2.5rem 2rem',
        }}
      >
        <div className="pushpin"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem', borderBottom: '2px dashed #d6c7b2', paddingBottom: '1rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-marker)',
              fontSize: '2.4rem',
              color: '#442812',
            }}
          >
            Sign In to Noticeboard
          </h2>
          <p style={{ color: '#78350f', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Enter your credentials to post notices and submit claims.
          </p>
        </div>

        {error && (
          <div className="notice-alert notice-alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'var(--font-marker)',
                fontSize: '1.15rem',
                color: '#5c3817',
                marginBottom: '0.3rem',
              }}
            >
              <Mail size={16} /> Campus Email
            </label>
            <input
              type="email"
              placeholder="e.g. student@campus.edu"
              className="paper-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'var(--font-marker)',
                fontSize: '1.15rem',
                color: '#5c3817',
                marginBottom: '0.3rem',
              }}
            >
              <Lock size={16} /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="paper-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-cork-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              fontSize: '1.25rem',
              padding: '0.7rem',
              marginTop: '0.5rem',
            }}
          >
            <LogIn size={18} /> {loading ? 'Checking Notice Pass...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts Quick-fill */}
        <div
          style={{
            marginTop: '1.75rem',
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '6px',
            padding: '0.85rem',
            border: '1px dashed #d6c7b2',
          }}
        >
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#8b572a',
              marginBottom: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Sparkles size={13} color="#d97706" /> Quick Demo Accounts (password: password123):
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('alice@campus.edu')}
              style={{
                background: '#fef3c7',
                border: '1px solid #d97706',
                color: '#92400e',
                borderRadius: '4px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Alice (Reporter)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('bob@campus.edu')}
              style={{
                background: '#dcfce7',
                border: '1px solid #16a34a',
                color: '#166534',
                borderRadius: '4px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Bob (Claimant)
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6e5a48' }}>
          Don't have an account yet?{' '}
          <Link
            to="/register"
            style={{
              color: '#92400e',
              fontFamily: 'var(--font-marker)',
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
