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
            width="260"
            height="60"
            viewBox="0 0 260 60"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="EdZure Legal Logo"
            className="footer-logo"
          >
            <defs>
              <linearGradient id="goldShimmerFooter" x1="-100%" y1="0%" x2="200%" y2="0%">
                <stop offset="0%" stopColor="#9e7d43"/>
                <stop offset="40%" stopColor="#c5a059"/>
                <stop offset="50%" stopColor="#f5e3b0"/>
                <stop offset="60%" stopColor="#c5a059"/>
                <stop offset="100%" stopColor="#9e7d43">
                  <animate
                    attributeName="offset"
                    from="0"
                    to="1"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
            </defs>

            <text
              x="0"
              y="42"
              fontFamily="Playfair Display, serif"
              fontSize="36"
              fontWeight="700"
              fill="#ffffff"
            >
              EdZure
            </text>

            <text
              x="135"
              y="42"
              fontFamily="Playfair Display, serif"
              fontSize="36"
              fontWeight="700"
              fill="url(#goldShimmerFooter)"
            >
              Legal
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