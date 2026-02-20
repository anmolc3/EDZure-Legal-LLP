import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <svg
            width="210"
            height="60"
            viewBox="0 0 700 200"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="EdZure Legal Logo"
            className="footer-logo"
          >
            <defs>
              <linearGradient id="goldFooter" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f3d38b" />
                <stop offset="100%" stopColor="#b8860b" />
              </linearGradient>
            </defs>

            {/* Monogram Box */}
            <rect x="40" y="40" width="120" height="120"
              stroke="url(#goldFooter)" strokeWidth="3"
              fill="none" />

            <text x="100" y="120" textAnchor="middle"
              fontFamily="'Playfair Display', serif"
              fontSize="60" fontWeight="700"
              fill="url(#goldFooter)">
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
              fill="url(#goldFooter)">
              LEGAL
            </text>
          </svg>
          <p>Professional legal services with expertise and integrity.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/insights">Insights</Link></li>
            <li><Link to="/legal-disclaimer">Legal Disclaimer</Link></li>
            <li><Link to="/admin/login">Admin Login</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li><Link to="/area-of-practice">Areas of Practice</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li className="contact-item">Email: info@edzurelegal.com</li>
            <li className="contact-item">Phone: +1 (555) 123-4567</li>
            <li className="contact-item">Address: 123 Legal Street, City, State</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} EdZure Legal LLP. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;