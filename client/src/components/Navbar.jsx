import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Pin,
  Search,
  PlusCircle,
  ClipboardList,
  BarChart3,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Compass
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
    padding: '0.45rem 0.9rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontFamily: 'var(--font-marker)',
    fontSize: '1.15rem',
    letterSpacing: '0.03em',
    color: isActive ? '#fef3c7' : '#d6c7b2',
    backgroundColor: isActive ? 'rgba(217, 119, 6, 0.35)' : 'transparent',
    border: isActive ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <header className="wood-header">
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand / Signboard */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              background: '#b91c1c',
              color: '#fff',
              padding: '0.4rem 0.6rem',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Pin size={20} fill="#fff" />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-marker)',
                fontSize: '1.5rem',
                lineHeight: 1.1,
                color: '#fef3c7',
                letterSpacing: '0.04em',
                textShadow: '1px 2px 3px rgba(0,0,0,0.6)',
              }}
            >
              CAMPUS LOST & FOUND
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: '#d4af37',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Community Noticeboard
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          className="desktop-nav"
        >
          <NavLink to="/" style={navLinkStyle}>
            <Search size={16} /> Board
          </NavLink>

          <NavLink to="/report-lost" style={navLinkStyle}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                display: 'inline-block',
              }}
            />
            Report Lost
          </NavLink>

          <NavLink to="/report-found" style={navLinkStyle}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
              }}
            />
            Report Found
          </NavLink>

          <NavLink to="/dashboard" style={navLinkStyle}>
            <BarChart3 size={16} /> Tally Board
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
            gap: '0.6rem',
          }}
          className="desktop-auth"
        >
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  background: 'rgba(254, 243, 199, 0.12)',
                  border: '1px solid rgba(254, 243, 199, 0.25)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  color: '#fef3c7',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-sans)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#22c55e',
                  }}
                />
                <span style={{ fontWeight: 600 }}>{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  color: '#fca5a5',
                  borderRadius: '4px',
                  padding: '0.35rem 0.65rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontFamily: 'var(--font-marker)',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                }}
                title="Log Out"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/login"
                style={{
                  background: 'rgba(254, 243, 199, 0.1)',
                  border: '1px solid rgba(254, 243, 199, 0.3)',
                  color: '#fef3c7',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-marker)',
                  fontSize: '1.05rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <LogIn size={15} /> Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  background: 'linear-gradient(180deg, #d97706 0%, #b45309 100%)',
                  color: '#fff',
                  border: '1px solid #f59e0b',
                  padding: '0.4rem 0.95rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-marker)',
                  fontSize: '1.05rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
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
            color: '#fef3c7',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'block',
          }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#381f0b',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <NavLink
            to="/"
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Search size={16} /> Noticeboard
          </NavLink>
          <NavLink
            to="/report-lost"
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                display: 'inline-block',
              }}
            />
            Report Lost
          </NavLink>
          <NavLink
            to="/report-found"
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
              }}
            />
            Report Found
          </NavLink>
          <NavLink
            to="/dashboard"
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            <BarChart3 size={16} /> Tally Board
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/my-reports"
              style={navLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ClipboardList size={16} /> My Reports
            </NavLink>
          )}

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.15)',
              paddingTop: '0.75rem',
              marginTop: '0.25rem',
            }}
          >
            {isAuthenticated ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fef3c7', fontSize: '0.9rem' }}>Signed in as: <strong>{user?.name}</strong></span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: '#991b1b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.4rem 0.8rem',
                    fontFamily: 'var(--font-marker)',
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fef3c7',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-marker)',
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: '#d97706',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-marker)',
                  }}
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
