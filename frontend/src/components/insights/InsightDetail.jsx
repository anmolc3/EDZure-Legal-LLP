// EdZure Legal LLP — InsightDetail.jsx (Redesigned)
// Matches site's dark-navy + gold glassmorphism theme
// Drop-in replacement — keep all imports/props identical to original

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../common/Breadcrumb';
import ShareButton from '../common/ShareButton';
import { insightsAPI, getImageUrl } from '../../services/api';
import { formatDate } from '../../utils/helpers';

/* ─── Inline styles ─────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Lato:wght@300;400;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .id-page { background: #0a0f1e; min-height: 100vh; }

  /* ────────────────────────────────────────────
     HERO  — full-bleed cinematic
  ──────────────────────────────────────────── */
  .id-hero {
    position: relative;
    min-height: 560px;
    display: flex; align-items: flex-end; overflow: hidden;
  }
  .id-hero-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    background-color: #0f1f3d;
    transition: transform 10s ease;
  }
  .id-hero:hover .id-hero-bg { transform: scale(1.04); }

  /* Multi-layer overlay: deep vignette + upward fade */
  .id-hero::after {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 50% 0%, rgba(197,160,89,0.05) 0%, transparent 60%),
      linear-gradient(180deg,
        rgba(10,15,30,0.35) 0%,
        rgba(10,15,30,0.55) 40%,
        rgba(10,15,30,0.95) 80%,
        #0a0f1e 100%);
    z-index: 1;
  }

  /* Subtle animated grid */
  .id-hero::before {
    content: '';
    position: absolute; inset: 0; z-index: 1;
    background-image:
      linear-gradient(rgba(197,160,89,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(197,160,89,0.04) 1px, transparent 1px);
    background-size: 70px 70px;
    pointer-events: none;
    mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 100%);
  }

  .id-hero-content {
    position: relative; z-index: 2;
    width: 100%; max-width: 900px;
    margin: 0 auto;
    padding: 50px 24px 72px;
  }

  /* Back button */
  .id-back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 20px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: #94a3b8; border-radius: 50px;
    font-family: 'Lato', sans-serif; font-size: 0.78rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.2px;
    cursor: pointer; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    transition: all 0.3s ease; margin-bottom: 28px;
  }
  .id-back-btn:hover {
    background: rgba(197,160,89,0.1); border-color: rgba(197,160,89,0.4);
    color: #f3d38b; transform: translateX(-4px);
  }

  /* Category + reading time */
  .id-meta-top {
    display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
  }
  .id-category-pill {
    display: inline-block; padding: 6px 18px;
    background: linear-gradient(135deg, #c5a059, #9e7d43);
    color: #fff; border-radius: 20px;
    font-family: 'Lato', sans-serif; font-size: 0.72rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1px;
    box-shadow: 0 4px 16px rgba(197,160,89,0.4);
  }
  .id-readtime-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 16px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    color: #64748b; border-radius: 20px;
    font-family: 'Lato', sans-serif; font-size: 0.72rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 1px;
    backdrop-filter: blur(10px);
  }

  /* H1 */
  .id-hero-content h1 {
    font-family: 'Playfair Display', serif;
    font-size: 3.2rem; font-weight: 800; color: #fff;
    line-height: 1.18; margin-bottom: 26px;
    text-shadow: 0 2px 20px rgba(0,0,0,0.6);
  }

  /* Meta row */
  .id-meta-row {
    display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
  }
  .id-meta-item {
    display: flex; align-items: center; gap: 7px;
    font-family: 'Lato', sans-serif; font-size: 0.86rem; color: #64748b;
  }
  .id-meta-item svg { color: #c5a059; flex-shrink: 0; }
  .id-meta-item strong { color: #c5a059; font-weight: 600; }
  .id-meta-sep {
    width: 4px; height: 4px; border-radius: 50%;
    background: rgba(197,160,89,0.35); flex-shrink: 0;
  }

  /* ────────────────────────────────────────────
     PROGRESS BAR (reading progress)
  ──────────────────────────────────────────── */
  .id-progress-bar {
    position: fixed; top: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, #c5a059, #f3d38b);
    z-index: 999; transition: width 0.1s linear;
    box-shadow: 0 0 10px rgba(197,160,89,0.6);
  }

  /* ────────────────────────────────────────────
     ARTICLE WRAPPER
  ──────────────────────────────────────────── */
  .id-article-wrap {
    background: linear-gradient(180deg, #0a0f1e 0%, #0d1220 100%);
    padding: 60px 20px 110px; position: relative;
  }
  .id-article-wrap::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 50% 60% at 0% 30%, rgba(197,160,89,0.03) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 100% 70%, rgba(28,61,122,0.07) 0%, transparent 60%);
    pointer-events: none;
  }
  .id-article-inner {
    max-width: 900px; margin: 0 auto; position: relative; z-index: 1;
  }

  /* Share row */
  .id-actions-row {
    display: flex; justify-content: flex-end; margin-bottom: 28px;
  }

  /* ────────────────────────────────────────────
     CONTENT CARD — glassmorphism panel
  ──────────────────────────────────────────── */
  .id-content-card {
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 22px; overflow: hidden;
    backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
    box-shadow: 0 8px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06);
    position: relative;
  }

  /* Animated gold top strip */
  .id-content-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, #c5a059, #f3d38b, #c5a059, transparent);
    animation: shimmer 4s linear infinite;
  }
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  /* ── Prose styles ── */
  .id-prose {
    padding: 52px 64px;
    font-family: 'Lato', sans-serif;
    font-size: 1.06rem; line-height: 1.88; color: #94a3b8;
  }
  .id-prose h1, .id-prose h2, .id-prose h3,
  .id-prose h4, .id-prose h5, .id-prose h6 {
    font-family: 'Playfair Display', serif; color: #e2e8f0;
    margin-top: 44px; margin-bottom: 18px;
    font-weight: 700; line-height: 1.25;
  }
  .id-prose h2 {
    font-size: 1.95rem;
    border-bottom: 1px solid rgba(197,160,89,0.18); padding-bottom: 13px;
  }
  .id-prose h3 { font-size: 1.5rem; }
  .id-prose p { margin-bottom: 24px; }
  .id-prose a {
    color: #c5a059; text-decoration: underline;
    text-underline-offset: 3px; font-weight: 500; transition: color 0.3s;
  }
  .id-prose a:hover { color: #f3d38b; }
  .id-prose strong { font-weight: 700; color: #e2e8f0; }
  .id-prose ul, .id-prose ol { margin-bottom: 24px; padding-left: 28px; }
  .id-prose li { margin-bottom: 10px; line-height: 1.72; }
  .id-prose blockquote {
    border-left: 3px solid #c5a059;
    background: rgba(197,160,89,0.05);
    margin: 34px 0; padding: 22px 30px;
    border-radius: 0 14px 14px 0;
    font-style: italic; color: #64748b;
  }
  .id-prose img {
    max-width: 100%; height: auto; border-radius: 14px;
    margin: 30px 0; border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  }
  .id-prose code {
    background: rgba(197,160,89,0.08); padding: 3px 8px; border-radius: 4px;
    font-family: 'Courier New', monospace; font-size: 0.88em; color: #c5a059;
    border: 1px solid rgba(197,160,89,0.15);
  }
  .id-prose pre {
    background: rgba(0,0,0,0.4); padding: 24px; border-radius: 14px;
    overflow-x: auto; margin: 28px 0;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .id-prose pre code { background: none; padding: 0; border: none; color: #e2e8f0; }

  /* ── Author footer of card ── */
  .id-author-footer {
    display: flex; align-items: center; gap: 16px;
    padding: 26px 64px;
    border-top: 1px solid rgba(255,255,255,0.06);
    background: rgba(0,0,0,0.18);
  }
  .id-author-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, #c5a059, #9e7d43);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-family: 'Playfair Display', serif;
    font-size: 1.1rem; font-weight: 700; flex-shrink: 0;
    border: 2px solid rgba(197,160,89,0.35);
    box-shadow: 0 0 20px rgba(197,160,89,0.25);
  }
  .id-author-info { display: flex; flex-direction: column; gap: 3px; }
  .id-author-label {
    font-family: 'Lato', sans-serif; font-size: 0.7rem;
    color: #475569; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 600;
  }
  .id-author-name {
    font-family: 'Playfair Display', serif; font-size: 1.05rem;
    color: #e2e8f0; font-weight: 700;
  }
  .id-author-role {
    font-family: 'Lato', sans-serif; font-size: 0.78rem; color: #475569;
  }

  /* ────────────────────────────────────────────
     TAGS ROW
  ──────────────────────────────────────────── */
  .id-tags-row {
    display: flex; align-items: center; gap: 10px;
    margin-top: 36px; flex-wrap: wrap;
  }
  .id-tags-label {
    font-family: 'Lato', sans-serif; font-size: 0.75rem; font-weight: 700;
    color: #475569; text-transform: uppercase; letter-spacing: 1px;
  }
  .id-tag {
    padding: 5px 14px;
    border: 1px solid rgba(197,160,89,0.2); border-radius: 20px;
    font-family: 'Lato', sans-serif; font-size: 0.72rem; color: #94a3b8;
    cursor: pointer; transition: all 0.25s ease;
  }
  .id-tag:hover {
    border-color: rgba(197,160,89,0.5); color: #c5a059;
    background: rgba(197,160,89,0.06);
  }

  /* ────────────────────────────────────────────
     RELATED INSIGHTS
  ──────────────────────────────────────────── */
  .id-related { margin-top: 80px; position: relative; z-index: 1; }
  .id-related-header { text-align: center; margin-bottom: 40px; }
  .id-related-header .id-overline {
    display: block; color: #c5a059;
    font-family: 'Lato', sans-serif; font-size: 0.78rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 10px;
  }
  .id-related-header h2 {
    font-family: 'Playfair Display', serif; font-size: 2.3rem;
    color: #e2e8f0; font-weight: 700;
  }
  .id-related-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;
  }

  /* Related card */
  .id-related-card {
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; overflow: hidden;
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
    transition: all 0.4s cubic-bezier(0.4,0,0.2,1); position: relative;
  }
  .id-related-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #c5a059, transparent);
    transform: scaleX(0); transition: transform 0.4s ease;
    transform-origin: left;
  }
  .id-related-card:hover::before { transform: scaleX(1); }
  .id-related-card:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(197,160,89,0.2); transform: translateY(-5px);
    box-shadow: 0 10px 36px rgba(0,0,0,0.4);
  }

  .id-related-img-wrap {
    width: 100%; height: 170px; overflow: hidden;
    background: linear-gradient(135deg, #0d1d3a, #1e3c72); flex-shrink: 0;
  }
  .id-related-img {
    width: 100%; height: 100%; object-fit: cover;
    filter: brightness(0.82) saturate(0.9);
    transition: transform 0.55s ease, filter 0.55s ease;
  }
  .id-related-card:hover .id-related-img { transform: scale(1.08); filter: brightness(0.95) saturate(1.05); }

  .id-related-body { padding: 20px 22px 24px; }
  .id-related-cat {
    display: inline-block; padding: 4px 12px;
    background: linear-gradient(135deg, #c5a059, #9e7d43);
    color: #fff; border-radius: 20px;
    font-family: 'Lato', sans-serif; font-size: 0.65rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;
  }
  .id-related-title {
    font-family: 'Playfair Display', serif; font-size: 1rem;
    font-weight: 700; line-height: 1.44; margin-bottom: 10px; color: #cbd5e1;
  }
  .id-related-title a { color: inherit; text-decoration: none; transition: color 0.3s; }
  .id-related-title a:hover { color: #f3d38b; }
  .id-related-date {
    font-family: 'Lato', sans-serif; font-size: 0.76rem; color: #475569;
    display: flex; align-items: center; gap: 6px;
  }
  .id-related-date::before {
    content: ''; width: 4px; height: 4px; border-radius: 50%;
    background: #c5a059; flex-shrink: 0;
  }

  /* ── Loading ── */
  .id-loading {
    text-align: center; padding: 80px 20px;
    font-family: 'Lato', sans-serif; font-size: 1rem; color: #475569;
  }
  .id-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid rgba(197,160,89,0.15); border-top-color: #c5a059;
    animation: spin 0.8s linear infinite; margin: 0 auto 16px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 991px) { .id-related-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .id-hero-content h1 { font-size: 2.2rem; }
    .id-prose { padding: 32px 28px; }
    .id-author-footer { padding: 22px 28px; }
    .id-related-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
    .id-meta-sep { display: none; }
  }
  @media (max-width: 480px) {
    .id-hero-content h1 { font-size: 1.8rem; }
    .id-prose { padding: 24px 18px; }
    .id-prose h2 { font-size: 1.5rem; }
    .id-author-footer { padding: 18px 18px; }
  }
`;

/* ─── Reading-time estimate ──────────────────────────────────────────────── */
const readTime = (html = '') => {
  const words = html.replace(/<[^>]+>/g, '').split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

/* ─── Component ─────────────────────────────────────────────────────────── */
const InsightDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    fetchInsight();
    window.scrollTo(0, 0);
  }, [slug]);

  // Reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchInsight = async () => {
    try {
      setLoading(true);
      const res = await insightsAPI.getBySlug(slug);
      if (res.data.success) {
        setInsight(res.data.insight);
        fetchRelated(res.data.insight.category);
      } else navigate('/insights');
    } catch {
      navigate('/insights');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (category) => {
    try {
      const res = await insightsAPI.getAll({ category, status: 'published', limit: 4 });
      if (res.data.success)
        setRelated(res.data.insights.filter(i => i.slug !== slug).slice(0, 3));
    } catch { }
  };

  if (loading) return (
    <>
      <style>{CSS}</style>
      <div className="id-loading">
        <div className="id-spinner" />
        Loading article…
      </div>
    </>
  );
  if (!insight) return (
    <>
      <style>{CSS}</style>
      <div className="id-loading">Article not found.</div>
    </>
  );

  const initials = insight.author
    ? insight.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'EL';

  const breadcrumbs = [
    { name: 'Insights', path: '/insights' },
    { name: insight.title, path: `/insights/${insight.slug}` },
  ];

  // Mock tags derived from category (replace with real tags field when available)
  const tags = [insight.category, 'Legal Update', 'India', 'EdZure Analysis'];

  return (
    <>
      <style>{CSS}</style>
      <Helmet>
        <title>{insight.title} — EdZure Legal LLP</title>
        <meta name="description" content={insight.excerpt || insight.title} />
        <meta property="og:title" content={insight.title} />
        <meta property="og:description" content={insight.excerpt || insight.title} />
        {insight.image_url && <meta property="og:image" content={getImageUrl(insight.image_url)} />}
      </Helmet>

      {/* Reading progress bar */}
      <div className="id-progress-bar" style={{ width: `${readProgress}%` }} />

      <Breadcrumb customPaths={breadcrumbs} />

      <div className="id-page">

        {/* ─── HERO ─── */}
        <div className="id-hero">
          <div
            className="id-hero-bg"
            style={{ backgroundImage: insight.image_url ? `url(${getImageUrl(insight.image_url)})` : undefined }}
          />
          <div className="id-hero-content">
            <button className="id-back-btn" onClick={() => navigate(-1)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Insights
            </button>

            <div className="id-meta-top">
              <span className="id-category-pill">{insight.category}</span>
              <span className="id-readtime-pill">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {readTime(insight.content || '')}
              </span>
            </div>

            <h1>{insight.title}</h1>

            <div className="id-meta-row">
              <div className="id-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <strong>{insight.author}</strong>
              </div>
              <span className="id-meta-sep" />
              <div className="id-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatDate(insight.published_at)}
              </div>
              <span className="id-meta-sep" />
              <div className="id-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                {insight.views?.toLocaleString()} views
              </div>
            </div>
          </div>
        </div>

        {/* ─── ARTICLE BODY ─── */}
        <div className="id-article-wrap">
          <div className="id-article-inner">

            {/* Share */}
            <div className="id-actions-row">
              <ShareButton url={`/insights/${insight.slug}`} title={insight.title} />
            </div>

            {/* Content card */}
            <div className="id-content-card">
              <div className="id-prose" dangerouslySetInnerHTML={{ __html: insight.content }} />
              <div className="id-author-footer">
                <div className="id-author-avatar">{initials}</div>
                <div className="id-author-info">
                  <span className="id-author-label">Written by</span>
                  <span className="id-author-name">{insight.author}</span>
                  <span className="id-author-role">Legal Analyst — EdZure Legal LLP</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="id-tags-row">
              <span className="id-tags-label">Topics:</span>
              {tags.map(tag => (
                <span key={tag} className="id-tag">{tag}</span>
              ))}
            </div>

            {/* Related insights */}
            {related.length > 0 && (
              <div className="id-related">
                <div className="id-related-header">
                  <span className="id-overline">Continue Reading</span>
                  <h2>Related Articles</h2>
                </div>
                <div className="id-related-grid">
                  {related.map(r => (
                    <div key={r.id} className="id-related-card">
                      <div className="id-related-img-wrap">
                        {r.image_url
                          ? <img src={getImageUrl(r.image_url)} alt={r.title} className="id-related-img" />
                          : null}
                      </div>
                      <div className="id-related-body">
                        <span className="id-related-cat">{r.category}</span>
                        <h3 className="id-related-title">
                          <Link to={`/insights/${r.slug}`}>{r.title}</Link>
                        </h3>
                        <p className="id-related-date">{formatDate(r.published_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default InsightDetail;