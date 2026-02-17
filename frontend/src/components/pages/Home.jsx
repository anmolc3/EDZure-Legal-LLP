import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { insightsAPI, getImageUrl } from '../../services/api';
import { formatDate, truncateText } from '../../utils/helpers';
import './Home.css';
import '../insights/InsightList.css';

const Home = () => {
  const [recentInsights, setRecentInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // --- SLIDER STATE ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoSlideTimeout = useRef(null);
  const bgRef = useRef(null);

  // Initial Fetch, Scroll Blur & Hash Scrolling
  useEffect(() => {
    fetchRecentInsights();

    const handleScroll = () => {
      if (bgRef.current) {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        if (scrollY >= heroHeight) {
          // Completely hide the fixed background once hero is fully scrolled past
          bgRef.current.style.opacity = '0';
          bgRef.current.style.pointerEvents = 'none';
        } else {
          // Blur increases as user scrolls, capped at 20px at bottom of hero
          const blurValue = Math.min(scrollY / 50, 20);
          bgRef.current.style.opacity = '1';
          bgRef.current.style.filter = `blur(${blurValue}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Auto-scroll to section if navigating from another page with a #contact hash
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        const element = document.getElementById('contact');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Watch for hash changes while already on the page
  useEffect(() => {
    if (location.hash === '#contact') {
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        setTimeout(() => {
          contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  // Auto Slide Logic
  useEffect(() => {
    if (recentInsights.length > 1) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
  }, [recentInsights.length, currentIndex, isAnimating]);

  const fetchRecentInsights = async () => {
    try {
      const response = await insightsAPI.getRecent(4);
      if (response.data.success) {
        setRecentInsights(response.data.insights);
      }
    } catch (error) {
      console.error('Error fetching recent insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideTimeout.current = setTimeout(() => {
      if (!isAnimating) {
        const nextIndex = currentIndex >= recentInsights.length - 1 ? 0 : currentIndex + 1;
        changeSlide(nextIndex);
      }
    }, 6000);
  };

  const stopAutoSlide = () => {
    if (autoSlideTimeout.current) clearTimeout(autoSlideTimeout.current);
  };

  const changeSlide = (newIndex) => {
    if (isAnimating || newIndex === currentIndex) return;

    setIsAnimating(true);
    setCurrentIndex(newIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : recentInsights.length - 1;
    changeSlide(prevIndex);
  };

  const handleNext = () => {
    if (isAnimating) return;
    const nextIndex = currentIndex < recentInsights.length - 1 ? currentIndex + 1 : 0;
    changeSlide(nextIndex);
  };

  // --- EXACT FIRST 6 PRACTICE AREAS ---
  const practiceAreasData = [
    {
      title: 'Corporate & Commercial Litigation',
      description: 'Resolving disputes arising out of business and commercial relationships, representing companies in contractual disputes and regulatory litigation.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      )
    },
    {
      title: 'Intellectual Property Rights (IPR)',
      description: 'Protecting and enforcing intellectual assets such as trademarks, copyrights, patents, and designs from registration to enforcement.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    },
    {
      title: 'Criminal Litigation',
      description: 'Comprehensive criminal law services ranging from pre-litigation advisory to trial, including white-collar crimes and economic offences.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    {
      title: 'Family & Matrimonial Law',
      description: 'Strategic handling of sensitive personal disputes including divorce, maintenance, child custody, and domestic violence cases.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      title: 'Environmental Law',
      description: 'Assisting corporates, institutions, and individuals in regulatory compliance, clearances, and litigation before the National Green Tribunal.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
        </svg>
      )
    },
    {
      title: 'Civil Litigation',
      description: 'Handling a wide range of civil disputes involving property, contracts, recovery, injunctions, and declaratory reliefs across courts.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>EdZure Legal LLP - Professional Legal Services</title>
      </Helmet>

      {/* FIXED BACKGROUND ELEMENT */}
      <div className="fixed-background" ref={bgRef}></div>

      <div className="home">

        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <div className="hero-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Professional Legal Excellence</span>
              </div>

              <h1 className="hero-title">EdZure Legal LLP</h1>

              <div className="hero-divider">
                <span className="hero-divider-line"></span>
                <span className="hero-divider-icon">⚖</span>
                <span className="hero-divider-line"></span>
              </div>

              <p className="hero-subtitle">
                Delivering trusted legal insights with integrity, precision, and professional excellence.
              </p>

              <div className="hero-stats">
                <div className="hero-stat-item">
                  <div className="hero-stat-number">15+</div>
                  <div className="hero-stat-label">Years Experience</div>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat-item">
                  <div className="hero-stat-number">500+</div>
                  <div className="hero-stat-label">Cases Resolved</div>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat-item">
                  <div className="hero-stat-number">98%</div>
                  <div className="hero-stat-label">Success Rate</div>
                </div>
              </div>

              <div className="hero-buttons">
                <Link to="/insights" className="hero-btn hero-btn-primary">
                  <span>Explore Legal Insights</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>

                {/* RESTORED SCHEDULE CONSULTATION BUTTON */}
                <a
                  href="#contact"
                  className="hero-btn hero-btn-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  <span>Schedule Consultation</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3D PARALLAX SLIDESHOW */}
        <section className="featured-slideshow-section">
          <div className="slideshow-container-wrapper">
            {loading ? (
              <div className="loading">Loading insights...</div>
            ) : recentInsights.length > 0 ? (

              <div className="slider-container">
                <div
                  className={`slider-control left ${currentIndex === 0 ? 'inactive' : ''}`}
                  onClick={handlePrev}
                />
                <div
                  className={`slider-control right ${currentIndex === recentInsights.length - 1 ? 'inactive' : ''}`}
                  onClick={handleNext}
                />

                <ul className="slider-pagi">
                  {recentInsights.map((_, i) => (
                    <li
                      key={i}
                      className={`slider-pagi__elem ${currentIndex === i ? 'active' : ''}`}
                      onClick={() => changeSlide(i)}
                    />
                  ))}
                </ul>

                <div
                  className={`slider ${isAnimating ? 'animating' : ''}`}
                  style={{ transform: `translate3d(-${currentIndex * 100}%, 0, 0)` }}
                >
                  {recentInsights.map((insight, index) => (
                    <div
                      key={insight.id}
                      className={`slide slide-${index} ${currentIndex === index ? 'active' : ''}`}
                      style={{ left: `${index * 100}%` }}
                    >
                      <div
                        className="slide__bg"
                        style={{
                          left: `-${index * 50}%`,
                          transform: `translate3d(${currentIndex * 50}%, 0, 0)`,
                          backgroundImage: `url(${getImageUrl(insight.image_url)})`
                        }}
                      />

                      <div className="slide__content">
                        <svg className="slide__overlay" viewBox="0 0 720 405" preserveAspectRatio="xMaxYMax slice">
                          <path className="slide__overlay-path" d="M0,0 150,0 500,405 0,405" />
                        </svg>

                        <div className="slide__text">
                          <span className="slide-category">{insight.category}</span>
                          <h2 className="slide__text-heading">{insight.title}</h2>
                          <p className="slide__text-desc">{truncateText(insight.excerpt || '', 120)}</p>
                          <Link to={`/insights/${insight.slug}`} className="slide__text-link">
                            Read Article
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            ) : (
              <p className="no-insights">No insights available yet.</p>
            )}
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="home-about-section">
          <div className="container">
            <div className="about-grid">

              <div className="about-content">
                <span className="about-subtitle">ABOUT EDZURE LEGAL</span>
                <h2 className="about-title">A Legacy of Trust and<br />Legal Innovation</h2>
                <p className="about-text">
                  Founded on the principles of unwavering ethics and relentless advocacy, EdZure Legal has grown into a premier multi-disciplinary law firm. We represent Fortune 500 companies, startups, and individuals with the same level of intensity and precision.
                </p>
                <p className="about-text">
                  Our approach combines deep legal expertise with a thorough understanding of the commercial landscapes in which our clients operate. We don't just interpret the law; we help you navigate it.
                </p>

                <div className="about-stats">
                  <div className="stat-item">
                    <span className="stat-number">15+</span>
                    <span className="stat-label">YEARS EXPERIENCE</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">CASES WON</span>
                  </div>
                </div>

                <Link to="/about" className="about-btn">Learn More About Us</Link>
              </div>

              <div className="about-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop"
                  alt="EdZure Legal Library"
                  className="about-img"
                />
                <div className="about-quote-box">
                  <p>"The law is a profession of words; we make sure yours carry weight."</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* AREAS OF PRACTICE SECTION (Modern Cards) */}
        <section className="home-practice-areas-section">
          <div className="container">

            <div className="section-header-center">
              <span className="section-subtitle-gold">Our Expertise</span>
              <h2 className="section-title-white">Areas of Practice</h2>
              <p className="section-description-light">
                Comprehensive legal strategies tailored to protect your interests, assets, and future across a multitude of disciplines.
              </p>
            </div>

            <div className="practice-cards-grid">
              {practiceAreasData.map((practice, index) => (
                <div className="practice-modern-card" key={index}>
                  <div className="pmc-icon-wrapper">
                    {practice.icon}
                  </div>
                  <h3 className="pmc-title">{practice.title}</h3>
                  <p className="pmc-desc">{practice.description}</p>
                </div>
              ))}
            </div>

            <div className="practice-btn-wrapper">
              <Link to="/area-of-practice" className="about-btn btn-gold-outline">
                View All Practice Areas
              </Link>
            </div>

          </div>
        </section>

        {/* LATEST INSIGHTS SECTION */}
        <section className="home-insights-section">
          <div className="container">

            <div className="section-header-center">
              <span className="section-subtitle-gold">Knowledge Hub</span>
              <h2 className="section-title-dark">Latest Legal Insights</h2>
              <p className="section-description-dark">
                Stay informed with our expert analysis on emerging legal trends, landmark judgments, and regulatory updates.
              </p>
            </div>

            {loading ? (
              <div className="loading">Loading insights...</div>
            ) : recentInsights.length > 0 ? (
              <>
                <div className="insights-premium-grid">
                  {recentInsights.map((insight) => (
                    <article key={insight.id} className="insight-premium-card">
                      <Link to={`/insights/${insight.slug}`} className="insight-premium-image-wrapper">
                        {insight.image_url ? (
                          <img src={getImageUrl(insight.image_url)} alt={insight.title} className="insight-premium-image" />
                        ) : (
                          <div className="insight-premium-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                          </div>
                        )}
                        <div className="insight-premium-overlay"></div>
                      </Link>

                      <div className="insight-premium-content">
                        <div className="insight-premium-header">
                          <span className="insight-premium-category">{insight.category}</span>
                          <span className="insight-premium-date">{formatDate(insight.published_at)}</span>
                        </div>

                        <h3 className="insight-premium-title">
                          <Link to={`/insights/${insight.slug}`}>{insight.title}</Link>
                        </h3>

                        <p className="insight-premium-excerpt">{truncateText(insight.excerpt || '', 120)}</p>

                        <Link to={`/insights/${insight.slug}`} className="insight-premium-link">
                          <span>Read Full Insight</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="insights-view-all-wrapper">
                  <Link to="/insights" className="insights-view-all-btn">
                    View All Insights
                  </Link>
                </div>
              </>
            ) : (
              <p className="no-insights">No insights available yet.</p>
            )}
          </div>
        </section>

        {/* CONTACT US SECTION */}
        <section className="home-contact-section" id="contact">
          <div className="container">
            <div className="contact-grid">

              <div className="contact-info">
                <span className="section-subtitle-gold">Get In Touch</span>
                <h2 className="section-title-left">Contact Our Experts</h2>

                <div className="contact-details">

                  <div className="contact-detail-item">
                    <div className="contact-icon">
                      <svg fill="currentColor" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg>
                    </div>
                    <div className="contact-text">
                      <h4>Global Headquarters</h4>
                      <p>1200 Avenue of the Americas, Suite 100<br />New York, NY 10036</p>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <div className="contact-icon">
                      <svg fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" /></svg>
                    </div>
                    <div className="contact-text">
                      <h4>Phone</h4>
                      <p>+1 (212) 555-0198</p>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <div className="contact-icon">
                      <svg fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" /></svg>
                    </div>
                    <div className="contact-text">
                      <h4>Email</h4>
                      <p>contact@edzurelegal.com</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="contact-form-wrapper">
                <form
                  className="contact-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Thank you for contacting EdZure Legal. Our representative will get back to you within 24 hours.');
                    e.target.reset();
                  }}
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" required />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" required />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select>
                      <option>Corporate Law</option>
                      <option>Litigation</option>
                      <option>Real Estate</option>
                      <option>Other Inquiry</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea rows="4" required></textarea>
                  </div>
                  <button type="submit" className="submit-btn">Send Message</button>
                </form>
              </div>

            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;