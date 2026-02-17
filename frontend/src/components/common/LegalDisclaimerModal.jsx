import React, { useState, useEffect } from 'react';
import './LegalDisclaimerModal.css';

const SCROLL_ITEMS = [
  {
    title: 'No Attorney-Client Relationship',
    text: 'Use of this website and communication with EdZure Legal LLP does not establish an attorney-client relationship. Such a relationship is only established through a signed engagement agreement.',
  },
  {
    title: 'For Information Purposes Only',
    text: 'All content on this website is provided for general informational purposes only. We make no representations about the completeness, accuracy, or reliability of any information published here.',
  },
  {
    title: 'Not Legal Advice',
    text: 'Nothing on this website constitutes legal advice. Every legal situation is unique — please consult a qualified attorney for guidance specific to your circumstances.',
  },
  {
    title: 'Confidentiality Notice',
    text: 'Information submitted through this website prior to the establishment of an attorney-client relationship is not considered confidential or legally privileged.',
  },
  {
    title: 'Your Acceptance',
    text: 'By clicking "I Accept and Continue", you confirm that you have read, understood, and agree to be bound by this disclaimer in full.',
  },
];

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LegalDisclaimerModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('disclaimerAccepted');
    if (!hasAccepted) {
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showModal]);

  const handleAccept = () => {
    if (!checked) return;
    localStorage.setItem('disclaimerAccepted', 'true');
    setShowModal(false);
  };

  const handleCheckboxKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setChecked((prev) => !prev);
    }
  };

  if (!showModal) return null;

  return (
    <div className="disclaimer-modal-overlay">
      <div
        className="disclaimer-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
      >
        {/* Header */}
        <div className="disclaimer-modal-header">
          <div className="modal-header-icon">
            <ShieldIcon />
          </div>
          <h2 id="disclaimer-title">
            Legal <em>Disclaimer</em>
          </h2>
          <p className="modal-header-sub">
            Before you continue, please read and acknowledge the following.
          </p>
        </div>

        {/* Scrollable content */}
        <div className="disclaimer-modal-content">
          <div className="disclaimer-scroll">
            {SCROLL_ITEMS.map((item, index) => (
              <div className="scroll-item" key={index}>
                <div className="scroll-item-header">
                  <span className="scroll-item-dot" />
                  <h4>{item.title}</h4>
                </div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Acknowledgement checkbox */}
          <div
            className="disclaimer-checkbox-row"
            onClick={() => setChecked((prev) => !prev)}
            onKeyDown={handleCheckboxKeyDown}
            role="checkbox"
            aria-checked={checked}
            tabIndex={0}
          >
            <div className={`custom-checkbox${checked ? ' checked' : ''}`}>
              <CheckIcon />
            </div>
            <span className="checkbox-label">
              I have read and understood the disclaimer above, and I{' '}
              <strong>acknowledge that no attorney-client relationship</strong> is
              formed by my use of this website.
            </span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="disclaimer-modal-footer">
          <button
            className="btn-accept"
            onClick={handleAccept}
            disabled={!checked}
            aria-disabled={!checked}
          >
            I Accept and Continue
          </button>
          <p className="disclaimer-note">
            You can review the full legal disclaimer at any time via our footer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimerModal;