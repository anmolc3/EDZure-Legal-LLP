import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Breadcrumb from '../common/Breadcrumb';
import './About.css';

const About = () => {
  const statsRef = useRef(null);

  /* Simple count-up animation for stat numbers */
  useEffect(() => {
    const counters = document.querySelectorAll('.stat-num');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = Math.ceil(target / 55);
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + suffix;
            if (current >= target) clearInterval(timer);
          }, 28);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const values = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: 'Integrity',
      desc: 'We uphold the highest ethical standards in every engagement, ensuring transparent counsel you can trust unconditionally.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
      title: 'Precision',
      desc: 'Meticulous attention to detail defines our work. Every document, argument, and strategy is crafted with exact care.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'Client Focus',
      desc: 'Your objectives are our mandate. We structure every solution around your unique circumstances and long-term interests.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      title: 'Innovation',
      desc: 'We combine deep legal tradition with forward-thinking technology to deliver smarter, faster, and more effective outcomes.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ),
      title: 'Global Reach',
      desc: 'With continental expertise and international connections, we advise clients across borders with local insight.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: 'Excellence',
      desc: 'Recognised for consistently delivering superior results, we set the benchmark for professional legal practice.',
    },
  ];

  const team = [
    { initials: 'AO', name: 'Adaeze Okonkwo', role: 'Managing Partner', area: 'Corporate & Commercial Law' },
    { initials: 'EB', name: 'Emmanuel Briggs', role: 'Senior Partner',   area: 'Litigation & Dispute Resolution' },
    { initials: 'FN', name: 'Fatima Nwosu',   role: 'Partner',           area: 'Real Estate & Property Law' },
    { initials: 'KA', name: 'Kofi Asante',    role: 'Associate Partner', area: 'Finance & Risk Management' },
  ];

  const practices = [
    'Corporate & Commercial Law',
    'Litigation & Dispute Resolution',
    'Real Estate & Conveyancing',
    'Finance & Banking Law',
    'Employment & Labour Law',
    'Intellectual Property',
    'Energy & Natural Resources',
    'Public & Administrative Law',
  ];

  return (
    <>
      <Helmet>
        <title>About Us – EdZure Legal LLP</title>
        <meta name="description" content="EdZure Legal LLP — 15 years of trusted legal expertise across corporate, commercial, and advisory practice in Africa and beyond." />
      </Helmet>

      <Breadcrumb />

      <div className="about-page">

        {/* ═══════════════════════════════════════
            HERO
        ═══════════════════════════════════════ */}
        <section className="about-hero">
          <div className="about-hero-bg" />
          <div className="about-hero-content">
            <span className="about-overline">Our Story</span>
            <h1 className="about-hero-title">
              Trusted Legal<br />
              <em>Counsel &amp; Excellence</em>
            </h1>
            <p className="about-hero-sub">
              For 15 years, EdZure Legal LLP has delivered trusted legal insights
              and professional solutions with integrity, precision, and an unwavering
              commitment to our clients' success.
            </p>
            <div className="about-hero-cta">
              <Link to="/insights" className="btn-gold">Explore Our Insights</Link>
              <Link to="/contact"  className="btn-outline">Contact Us</Link>
            </div>
          </div>

          {/* Decorative scale of justice SVG */}
          <div className="about-hero-deco" aria-hidden="true">
            <svg viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="110" y1="20" x2="110" y2="240" stroke="rgba(197,160,89,0.25)" strokeWidth="2"/>
              <line x1="30"  y1="70" x2="190" y2="70" stroke="rgba(197,160,89,0.25)" strokeWidth="2"/>
              <circle cx="110" cy="20" r="6" fill="rgba(197,160,89,0.4)"/>
              {/* Left pan */}
              <path d="M30 70 Q10 95 30 105 Q50 115 70 105 Q90 95 70 70Z" stroke="rgba(197,160,89,0.3)" strokeWidth="1.5" fill="rgba(197,160,89,0.04)"/>
              {/* Right pan */}
              <path d="M150 70 Q130 95 150 105 Q170 115 190 105 Q210 95 190 70Z" stroke="rgba(197,160,89,0.3)" strokeWidth="1.5" fill="rgba(197,160,89,0.04)"/>
              <line x1="30"  y1="70" x2="110" y2="70" stroke="rgba(197,160,89,0.2)" strokeWidth="1.5"/>
              <line x1="190" y1="70" x2="110" y2="70" stroke="rgba(197,160,89,0.2)" strokeWidth="1.5"/>
              <rect x="100" y="230" width="20" height="10" rx="2" fill="rgba(197,160,89,0.15)" stroke="rgba(197,160,89,0.3)" strokeWidth="1"/>
            </svg>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            STATS ROW
        ═══════════════════════════════════════ */}
        <section className="about-stats" ref={statsRef}>
          <div className="about-container">
            <div className="stats-row">
              {[
                { target: 15,   suffix: '+', label: 'Years of Excellence' },
                { target: 500,  suffix: '+', label: 'Cases Successfully Handled' },
                { target: 98,   suffix: '%', label: 'Client Satisfaction Rate' },
                { target: 12,   suffix: '',  label: 'Practice Areas' },
              ].map((s, i) => (
                <div className="about-stat" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                  <span
                    className="stat-num"
                    data-target={s.target}
                    data-suffix={s.suffix}
                  >0{s.suffix}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            MISSION / WHO WE ARE
        ═══════════════════════════════════════ */}
        <section className="about-mission">
          <div className="about-container split-layout">

            <div className="mission-text">
              <span className="section-overline">Who We Are</span>
              <h2>A Firm Built on <span className="gold-text">Principle &amp; Performance</span></h2>
              <p>
                EdZure Legal LLP is a full-service law firm dedicated to delivering
                professional, reliable, and innovative legal solutions. Founded on the
                belief that every client deserves exceptional counsel, we have grown
                over <strong>15 years</strong> into one of the most respected legal
                practices in the region.
              </p>
              <p>
                Our multidisciplinary team of advocates, solicitors, and legal consultants
                brings deep sector expertise across corporate transactions, dispute
                resolution, property law, and regulatory advisory — offering clients a
                truly comprehensive legal partner.
              </p>
            </div>

            <div className="mission-visual">
              <div className="mission-card-stack">
                <div className="mc mc1">
                  <div className="mc-icon">⚖️</div>
                  <strong>Full-Service Practice</strong>
                  <p>End-to-end legal support across all major disciplines</p>
                </div>
                <div className="mc mc2">
                  <div className="mc-icon">💡</div>
                  <strong>Tech-Enabled Delivery</strong>
                  <p>Proprietary systems for faster, smarter legal solutions</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════
            PRACTICE AREAS
        ═══════════════════════════════════════ */}
        <section className="about-practices">
          <div className="about-container">
            <div className="section-header">
              <span className="section-overline">What We Do</span>
              <h2>Our Practice Areas</h2>
              <p>Comprehensive legal expertise across every area that matters to your business and personal affairs.</p>
            </div>
            <div className="practices-grid">
              {practices.map((p, i) => (
                <div className="practice-pill" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                  <span className="pill-dot" />
                  {p}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            VALUES
        ═══════════════════════════════════════ */}
        <section className="about-values">
          <div className="about-container">
            <div className="section-header">
              <span className="section-overline">What Drives Us</span>
              <h2>Our Core Values</h2>
              <p>Six principles that shape every brief, every argument, and every relationship we build.</p>
            </div>
            <div className="values-grid">
              {values.map((v, i) => (
                <div className="value-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="value-icon">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            TEAM
        ═══════════════════════════════════════ */}
        <section className="about-team">
          <div className="about-container">
            <div className="section-header">
              <span className="section-overline">The People Behind the Practice</span>
              <h2>Leadership Team</h2>
              <p>Experienced legal minds united by a shared commitment to exceptional client service.</p>
            </div>
            <div className="team-grid">
              {team.map((m, i) => (
                <div className="team-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="team-avatar">{m.initials}</div>
                  <div className="team-info">
                    <strong className="team-name">{m.name}</strong>
                    <span className="team-role">{m.role}</span>
                    <span className="team-area">{m.area}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            CTA BANNER
        ═══════════════════════════════════════ */}
        <section className="about-cta">
          <div className="about-container">
            <div className="cta-card">
              <div className="cta-text">
                <h2>Ready to Work With Us?</h2>
                <p>Let our team of seasoned legal professionals help you navigate complexity with confidence.</p>
              </div>
              <div className="cta-actions">
                <Link to="/contact" className="btn-gold">Get in Touch</Link>
                <Link to="/insights" className="btn-outline">Read Our Insights</Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default About;
