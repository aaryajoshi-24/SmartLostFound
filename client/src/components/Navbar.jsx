import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Search,
  PlusCircle,
  ClipboardList,
  BarChart3,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  User,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.45rem 0.85rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.92rem',
    fontWeight: isActive ? '600' : '500',
    color: isActive ? '#2563eb' : '#475569',
    backgroundColor: isActive ? '#eff6ff' : 'transparent',
    transition: 'all 0.15s ease',
  });

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo / Brand */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MapPin size={20} />
          </div>
          <div>
            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: '700',
                color: '#0f172a',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.2,
              }}
            >
              Smart Lost & Found
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
                display: 'block',
              }}
            >
              Campus Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.35rem',
          }}
          className="desktop-nav"
        >
          <NavLink to="/" style={navLinkStyle}>
            <Search size={16} /> Browse Notices
          </NavLink>

          <NavLink to="/report-lost" style={navLinkStyle}>
            Report Lost
          </NavLink>

          <NavLink to="/report-found" style={navLinkStyle}>
            Report Found
          </NavLink>

          <NavLink to="/dashboard" style={navLinkStyle}>
            <BarChart3 size={16} /> Dashboard
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/my-reports" style={navLinkStyle}>
              <ClipboardList size={16} /> My Reports
            </NavLink>
          )}
        </nav>

        {/* Auth status buttons */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.75rem',
          }}
          className="desktop-auth"
        >
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  color: '#334155',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span>{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary btn-sm"
                style={{
                  color: '#dc2626',
                  borderColor: '#fecdd3',
                }}
                title="Sign Out"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn-secondary btn-sm">
                <LogIn size={15} /> Sign In
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                <UserPlus size={15} /> Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#334155',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'block',
          }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <NavLink to="/" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Search size={16} /> Browse Notices
          </NavLink>
          <NavLink to="/report-lost" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            Report Lost
          </NavLink>
          <NavLink to="/report-found" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            Report Found
          </NavLink>
          <NavLink to="/dashboard" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <BarChart3 size={16} /> Dashboard
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-reports" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
              <ClipboardList size={16} /> My Reports
            </NavLink>
          )}

          <div
            style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '0.75rem',
              marginTop: '0.25rem',
            }}
          >
            {isAuthenticated ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#475569' }}>
                  Signed in as: <strong>{user?.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-danger btn-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
