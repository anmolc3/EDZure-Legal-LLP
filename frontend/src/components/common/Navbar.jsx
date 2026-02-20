import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout, admin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef(null);
  const hamburgerRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Areas of Practice', path: '/area-of-practice' },
    { label: 'Insights', path: '/insights' },
    { label: 'Legal Disclaimer', path: '/legal-disclaimer' },
  ];

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Close drawer on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen &&
        drawerRef.current && !drawerRef.current.contains(e.target) &&
        hamburgerRef.current && !hamburgerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header className="top-navbar">
        <div className="top-navbar__inner">

          {/* ── Logo ── */}
          <Link to="/" className="top-navbar__logo">
            <svg
              width="140" height="40"
              viewBox="0 0 700 200"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="EdZure Legal Logo"
            >
              <defs>
                <linearGradient id="goldNavbar" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f3d38b" />
                  <stop offset="100%" stopColor="#b8860b" />
                </linearGradient>
              </defs>

              {/* Monogram Box */}
              <rect x="40" y="40" width="120" height="120"
                stroke="url(#goldNavbar)" strokeWidth="3"
                fill="none" />

              <text x="100" y="120" textAnchor="middle"
                fontFamily="'Playfair Display', serif"
                fontSize="60" fontWeight="700"
                fill="url(#goldNavbar)">
                EL
              </text>

              <text x="220" y="105"
                fontFamily="'Playfair Display', serif"
                fontSize="70" fontWeight="700"
                fill="#ffffff">
                EDZURE
              </text>

              <text x="220" y="150"
                fontFamily="'Playfair Display', serif"
                fontSize="30" letterSpacing="8"
                fill="url(#goldNavbar)">
                LEGAL
              </text>
            </svg>
          </Link>

          {/* ── Desktop nav links ── */}
          <nav className="top-navbar__links">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`top-navbar__link${isActive(path) ? ' active' : ''}`}
              >
                {label}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`top-navbar__link${isActive('/admin/dashboard') ? ' active' : ''}`}
                >
                  Dashboard
                </Link>
                <button
                  className="top-navbar__link top-navbar__logout"
                  onClick={logout}
                >
                  Logout ({admin?.username})
                </button>
              </>
            )}
          </nav>

          {/* ── Hamburger button (mobile only) ── */}
          <button
            ref={hamburgerRef}
            className={`top-navbar__hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="top-navbar__bar" />
            <span className="top-navbar__bar" />
            <span className="top-navbar__bar" />
          </button>

        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        ref={drawerRef}
        className={`top-navbar__drawer${menuOpen ? ' open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="top-navbar__drawer-inner">

          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`top-navbar__drawer-link${isActive(path) ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          {isAuthenticated && (
            <>
              <div className="top-navbar__drawer-divider" />
              <Link
                to="/admin/dashboard"
                className={`top-navbar__drawer-link${isActive('/admin/dashboard') ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                className="top-navbar__drawer-link top-navbar__drawer-logout"
                onClick={() => { logout(); setMenuOpen(false); }}
              >
                Logout ({admin?.username})
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default Navbar;