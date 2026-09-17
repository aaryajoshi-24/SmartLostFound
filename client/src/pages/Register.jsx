import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please provide your email address.');
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      if (!err.response) {
        setError('Cannot connect to backend server. Please ensure the backend server is running on port 5001.');
      } else {
        setError(err.response.data?.message || 'Failed to register account.');
      }
    } finally {
      setLoading(false);
    }
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
        <div className="pushpin pushpin-brass"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem', borderBottom: '2px dashed #d6c7b2', paddingBottom: '1rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-marker)',
              fontSize: '2.4rem',
              color: '#442812',
            }}
          >
            Create Notice Pass
          </h2>
          <p style={{ color: '#78350f', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Register to claim items or report lost property on campus.
          </p>
        </div>

        {error && (
          <div className="notice-alert notice-alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
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
              <User size={16} /> Full Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Jordan Lee"
              className="paper-input"
              value={formData.name}
              onChange={handleChange}
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
              <Mail size={16} /> Campus Email Address *
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. j.lee@campus.edu"
              className="paper-input"
              value={formData.email}
              onChange={handleChange}
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
              <Lock size={16} /> Password (min 6 characters) *
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="paper-input"
              value={formData.password}
              onChange={handleChange}
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
              <Lock size={16} /> Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              className="paper-input"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6e5a48' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#92400e',
              fontFamily: 'var(--font-marker)',
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
