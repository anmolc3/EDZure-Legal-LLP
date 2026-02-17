import React from 'react';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../common/Breadcrumb';
import './LegalDisclaimer.css';

const sections = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: 'General Information',
    content: (
      <p>
        The information provided on this website is for general informational purposes only.
        While we strive to keep the information up-to-date and correct, we make no
        representations or warranties of any kind, express or implied, about the completeness,
        accuracy, reliability, suitability, or availability of the information contained herein.
      </p>
    ),
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: 'No Attorney-Client Relationship',
    content: (
      <p>
        Use of this website and communication with EdZure Legal LLP through this website
        does not establish an attorney-client relationship. An attorney-client relationship
        is established only through a signed engagement agreement. Information submitted
        through this website prior to establishment of such a relationship may not be
        treated as privileged or confidential.
      </p>
    ),
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Professional Advice Disclaimer',
    content: (
      <>
        <p>
          The content on this website should not be construed as legal advice. Every legal
          situation is unique, and you should consult with a qualified attorney for advice
          regarding your specific circumstances. Reliance on any information provided by
          EdZure Legal LLP on this website is solely at your own risk.
        </p>
        <p>
          Our legal insights, articles, and publications are intended to provide general
          guidance and background information only, and are not a substitute for proper
          legal counsel.
        </p>
      </>
    ),
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: 'External Links',
    content: (
      <p>
        This website may contain links to external websites operated by third parties.
        We have no control over the content, nature, or availability of those sites and
        are not responsible for their content, privacy policies, or practices. The inclusion
        of any links does not necessarily imply a recommendation or endorsement of the views
        expressed within them.
      </p>
    ),
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Limitation of Liability',
    content: (
      <>
        <p>
          In no event will EdZure Legal LLP be liable for any loss or damage including,
          without limitation, indirect or consequential loss or damage, or any loss or
          damage whatsoever arising from:
        </p>
        <ul>
          <li>Loss of data or profits arising out of, or in connection with, the use of this website</li>
          <li>Reliance placed on information or materials published on this website</li>
          <li>Interruption or unavailability of the website or its services</li>
          <li>Any errors, omissions, or inaccuracies in the content</li>
        </ul>
      </>
    ),
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    title: 'Contact Us',
    content: (
      <p>
        If you have any questions, concerns, or comments regarding this disclaimer or
        any aspect of our legal practice, please do not hesitate to contact us at{' '}
        <a href="mailto:info@edzurelegal.com">info@edzurelegal.com</a>. We are committed
        to responding to all enquiries in a timely and professional manner.
      </p>
    ),
  },
];

const LegalDisclaimer = () => {
  return (
    <>
      <Helmet>
        <title>Legal Disclaimer – EdZure Legal LLP</title>
        <meta name="description" content="Important legal disclaimer for EdZure Legal LLP website users." />
      </Helmet>

      <Breadcrumb />

      <div className="legal-disclaimer-page">

        {/* Hero */}
        <div className="disclaimer-hero">
          <span className="disclaimer-overline">Legal Information</span>
          <h1>Legal <em>Disclaimer</em></h1>
          <p className="disclaimer-hero-sub">
            Please read this disclaimer carefully before using the EdZure Legal LLP website
            or relying on any information contained herein.
          </p>
        </div>

        {/* Body */}
        <div className="disclaimer-body">
          <div className="disclaimer-inner">

            <div className="disclaimer-updated">Last updated: January 2026</div>

            <div className="disclaimer-intro-card">
              <p>
                EdZure Legal LLP maintains this website as a public resource for general
                information about the firm and its services. By accessing and using this website,
                you accept and agree to be bound by the terms and conditions set forth below.
                If you do not agree to these terms, please refrain from using this website.
              </p>
            </div>

            {sections.map((s, i) => (
              <div className="disclaimer-section" key={i}>
                <div className="ds-header">
                  <div className="ds-icon">{s.icon}</div>
                  <h2>{s.title}</h2>
                </div>
                {s.content}
              </div>
            ))}

            <div className="disclaimer-footer-note">
              This disclaimer was last reviewed and updated in January 2026.
              EdZure Legal LLP reserves the right to update this disclaimer at any time
              without prior notice. Continued use of this website constitutes acceptance
              of any modifications.
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default LegalDisclaimer;