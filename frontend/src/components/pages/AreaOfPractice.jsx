import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../common/Breadcrumb';
import './AreaOfPractice.css';

const practices = [
  {
    title: 'Corporate & Commercial Litigation',
    description: 'Resolving disputes arising out of business and commercial relationships. We represent companies, directors, shareholders, and business entities in contractual disputes, shareholder conflicts, commercial recovery suits, and regulatory litigation before Commercial Courts, NCLT/NCLAT, and High Courts.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    title: 'Intellectual Property Rights (IPR)',
    description: 'Protecting and enforcing intellectual assets — trademarks, copyrights, patents, and designs. From registration to enforcement, we advise startups, creators, and corporations on brand protection, IP commercialization, and dispute resolution before IP authorities and courts.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Criminal Litigation',
    description: 'Comprehensive criminal law services from pre-litigation advisory to appellate representation. Our work covers bail, white-collar crimes, economic offences, cybercrime, and NDPS matters before Magistrate Courts, Sessions Courts, High Courts, and the Supreme Court of India.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    title: 'Family & Matrimonial Law',
    description: 'Sensitive personal disputes handled with confidentiality and care. We advise on divorce, maintenance, child custody, guardianship, domestic violence, and matrimonial disputes under personal and secular laws — encouraging mediation and amicable settlements wherever possible.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Environmental Law',
    description: 'Assisting corporates, institutions, and individuals in regulatory compliance and litigation. We handle environmental clearances, pollution control matters, and National Green Tribunal proceedings, advising on compliance with the Environment Protection Act and related legislation.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  },
  {
    title: 'Civil Litigation',
    description: 'A wide range of civil disputes involving property, contracts, recovery, injunctions, and declaratory reliefs. Our civil litigation practice emphasizes strategic planning, evidence management, and timely resolution before District Courts and High Courts.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: 'Arbitration & ADR',
    description: 'Representation in domestic and commercial arbitration, mediation, and conciliation. We assist in arbitration proceedings, enforcement and challenge of arbitral awards, and dispute resolution under the Arbitration and Conciliation Act, 1996 — a cost-effective alternative to litigation.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
      </svg>
    ),
  },
  {
    title: 'Real Estate & RERA',
    description: 'Advising homebuyers, developers, and real estate companies on disputes and regulatory compliance under RERA. Services include builder-buyer disputes, possession delays, refund claims, and proceedings before RERA Authorities and Appellate Tribunals.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: 'Consumer Protection Law',
    description: 'Disputes related to deficiency of services, unfair trade practices, medical negligence, and e-commerce issues. We represent consumers and service providers before District Consumer Forums, State Commissions, and the NCDRC under the Consumer Protection Act, 2019.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: 'Labour & Employment Law',
    description: 'Advisory and litigation services in employment matters for employers and employees. Covering employment contracts, termination disputes, industrial relations, PoSH compliance, and representation before Labour Courts, Industrial Tribunals, and statutory authorities.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: 'Banking, Finance & Debt Recovery',
    description: 'Disputes involving banks, financial institutions, NBFCs, and borrowers. We handle SARFAESI proceedings, loan recovery cases, DRT and DRAT litigation, and banking documentation, helping clients manage regulatory and compliance risks in financial transactions.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: 'Service & Administrative Law',
    description: 'Representing government employees, PSUs, and institutions in service-related disputes before CAT and High Courts — promotions, transfers, disciplinary actions, pension benefits, and service conditions, ensuring protection of statutory and constitutional rights.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: 'Startup, MSME & Business Advisory',
    description: 'End-to-end legal support for startups and MSMEs — incorporation, structuring, licensing, compliance, contract management, and legal risk assessment. We act as a long-term legal partner offering retainership services and preventive legal advice to support business growth.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: 'Legal Documentation & Drafting',
    description: 'Drafting, vetting, and reviewing legal documents for clarity, enforceability, and compliance. Agreements, MoUs, deeds, legal notices, replies, legal opinions, and due diligence reports — helping clients make informed and legally sound decisions.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
];

const AreaOfPractice = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.12 }
    );
    cardRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Breadcrumb />

      <div className="aop-page">

        {/* ── HERO ── */}
        <section className="aop-hero">
          <div className="aop-hero-grid-overlay" />
          <div className="aop-hero-glow aop-hero-glow--left" />
          <div className="aop-hero-glow aop-hero-glow--right" />
          <div className="aop-hero-inner">
            <span className="aop-overline">Legal Expertise</span>
            <h1 className="aop-hero-title">Areas of Practice</h1>
            <div className="aop-hero-divider">
              <span className="aop-divider-line" />
              <span className="aop-divider-icon">⚖</span>
              <span className="aop-divider-line" />
            </div>
            <p className="aop-hero-desc">
              Comprehensive legal strategies tailored to protect your interests across
              a multitude of disciplines — from corporate boardrooms to individual rights.
            </p>
            <div className="aop-hero-stats">
              <div className="aop-stat"><span className="aop-stat-num">14+</span><span className="aop-stat-label">Practice Areas</span></div>
              <div className="aop-stat-sep" />
              <div className="aop-stat"><span className="aop-stat-num">15+</span><span className="aop-stat-label">Years Experience</span></div>
              <div className="aop-stat-sep" />
              <div className="aop-stat"><span className="aop-stat-num">500+</span><span className="aop-stat-label">Cases Resolved</span></div>
            </div>
          </div>
        </section>

        {/* ── GRID ── */}
        <section className="aop-grid-section">
          <div className="aop-grid-inner">
            <div className="aop-cards-grid">
              {practices.map((practice, index) => (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  data-index={index}
                  className={`aop-card ${activeIndex === index ? 'aop-card--active' : ''} ${visibleCards.has(index) ? 'aop-card--visible' : ''}`}
                  style={{ '--delay': `${(index % 3) * 0.1}s` }}
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                >
                  {/* Gold top strip */}
                  <div className="aop-card-strip" />

                  {/* Number */}
                  <span className="aop-card-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div className="aop-card-icon">{practice.icon}</div>

                  {/* Title */}
                  <h3 className="aop-card-title">{practice.title}</h3>

                  {/* Expand indicator */}
                  <div className="aop-card-expand">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18" height="18"
                      viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      className="aop-expand-icon"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>

                  {/* Description drawer */}
                  <div className="aop-card-desc">
                    <p>{practice.description}</p>
                  </div>

                  {/* Hover glow */}
                  <div className="aop-card-glow" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <section className="aop-cta">
          <div className="aop-cta-inner">
            <span className="aop-overline">Ready to Proceed?</span>
            <h2 className="aop-cta-title">Speak With Our Experts</h2>
            <p className="aop-cta-desc">
              Every case is unique. Let us understand your situation and chart the right legal path forward.
            </p>
            <a href="/#contact" className="aop-cta-btn">
              Schedule a Consultation
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </section>

      </div>
    </>
  );
};

export default AreaOfPractice;