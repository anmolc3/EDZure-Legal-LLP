import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ShareButton.css';

const ShareButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const url = window.location.href;
  const title = document.title;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: title, url: url });
      } catch (error) {
        console.log('Share cancelled:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2500);
      } catch (err) {
        alert('Unable to copy link.');
      }
    }
  };

  // Secure routing logic for the Contact button
  const handleContactClick = () => {
    if (location.pathname === '/') {
      // If already on Home page, just scroll down smoothly
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // If on another page, navigate to Home page with the hash
      navigate('/#contact');
    }
  };

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) {
      return null;
  }

  return (
    <div className="floating-action-container">
      <div className={`share-tooltip ${showTooltip ? 'show' : ''}`}>
        Link Copied!
      </div>
      
      <div className="floating-buttons-wrapper">
        
        {/* Contact Button (Gold) */}
        <button 
          onClick={handleContactClick} 
          className="floating-btn contact-btn" 
          aria-label="Contact Us"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </button>

        {/* Share Button (Blue) */}
        <button 
          className="floating-btn share-btn" 
          onClick={handleShare} 
          aria-label="Share this page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>

      </div>
    </div>
  );
};

export default ShareButton;