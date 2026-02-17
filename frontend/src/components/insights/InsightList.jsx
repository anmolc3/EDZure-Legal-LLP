// EdZure Legal LLP — Insights Page Redesign
// Drop-in replacement for InsightList.jsx + InsightDetail.jsx
// Matches the site's dark-navy + gold glassmorphism theme perfectly
// NOTE: Replace mock data / api imports with your real services

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../common/Breadcrumb';
import { insightsAPI, getImageUrl } from '../../services/api';
import { formatDate, truncateText } from '../../utils/helpers';

/* ─── Inline styles (no separate CSS file needed) ─────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Lato:wght@300;400;700;900&display=swap');

  /* ── Global resets ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page shell ── */
  .il-page { background: #0a0f1e; min-height: 100vh; color: #e2e8f0; overflow-x: hidden; }

  /* ────────────────────────────────────────────
     HERO
  ──────────────────────────────────────────── */
  .il-hero {
    position: relative;
    padding: 120px 20px 90px;
    text-align: center;
    overflow: hidden;
    background: linear-gradient(170deg, #0a0f1e 0%, #0f1f3d 60%, #0a0f1e 100%);
  }
  /* Animated aurora orbs */
  .il-hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    animation: orbFloat 14s ease-in-out infinite;
  }
  .il-hero-orb-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(197,160,89,0.13) 0%, transparent 70%);
    top: -200px; left: -100px;
    animation-delay: 0s;
  }
  .il-hero-orb-2 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(28,61,122,0.25) 0%, transparent 70%);
    top: 50px; right: -120px;
    animation-delay: -7s;
  }
  .il-hero-orb-3 {
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(197,160,89,0.07) 0%, transparent 70%);
    bottom: -100px; left: 40%;
    animation-delay: -3.5s;
  }
  @keyframes orbFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-30px) scale(1.06); }
  }

  /* Subtle grid lines */
  .il-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(197,160,89,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(197,160,89,0.035) 1px, transparent 1px);
    background-size: 70px 70px;
    pointer-events: none;
  }

  .il-hero-inner { position: relative; z-index: 2; max-width: 760px; margin: 0 auto; }

  /* Overline badge */
  .il-overline {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 8px 22px;
    background: rgba(197,160,89,0.08);
    border: 1px solid rgba(197,160,89,0.3);
    border-radius: 50px;
    font-family: 'Lato', sans-serif;
    font-size: 0.73rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 2.5px;
    color: #c5a059;
    margin-bottom: 26px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    animation: fadeSlideUp 0.7s ease both;
  }
  .il-overline-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #c5a059;
    box-shadow: 0 0 8px rgba(197,160,89,0.8);
    animation: pulseGold 2s ease-in-out infinite;
  }
  @keyframes pulseGold {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.5); }
  }

  .il-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: 4rem; font-weight: 800;
    line-height: 1.1; margin-bottom: 20px;
    background: linear-gradient(135deg, #ffffff 0%, #c5a059 55%, #f3d38b 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeSlideUp 0.7s 0.1s ease both;
  }
  .il-hero p {
    font-family: 'Lato', sans-serif;
    font-size: 1.05rem; color: #64748b;
    line-height: 1.8; max-width: 540px;
    margin: 0 auto 36px;
    animation: fadeSlideUp 0.7s 0.2s ease both;
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Search */
  .il-search-wrap {
    display: flex; align-items: center; gap: 10px;
    max-width: 400px; margin: 0 auto 28px;
    padding: 13px 22px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    transition: border-color 0.3s, box-shadow 0.3s;
    animation: fadeSlideUp 0.7s 0.25s ease both;
  }
  .il-search-wrap:focus-within {
    border-color: rgba(197,160,89,0.5);
    box-shadow: 0 0 0 3px rgba(197,160,89,0.08);
  }
  .il-search-wrap svg { color: #475569; flex-shrink: 0; }
  .il-search-wrap input {
    flex: 1; background: none; border: none; outline: none;
    font-family: 'Lato', sans-serif; font-size: 0.92rem; color: #e2e8f0;
  }
  .il-search-wrap input::placeholder { color: #475569; }

  /* Filter pills */
  .il-filters {
    display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;
    animation: fadeSlideUp 0.7s 0.3s ease both;
  }
  .il-filter-btn {
    padding: 9px 26px;
    border: 1px solid rgba(197,160,89,0.2);
    background: rgba(255,255,255,0.03);
    color: #94a3b8; border-radius: 50px; cursor: pointer;
    font-family: 'Lato', sans-serif; font-weight: 700;
    font-size: 0.77rem; text-transform: uppercase; letter-spacing: 1.3px;
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    transition: all 0.25s ease;
  }
  .il-filter-btn:hover {
    border-color: rgba(197,160,89,0.5); color: #f3d38b;
    background: rgba(197,160,89,0.07);
  }
  .il-filter-btn.active {
    background: linear-gradient(135deg, #c5a059, #9e7d43);
    color: #fff; border-color: transparent;
    box-shadow: 0 4px 18px rgba(197,160,89,0.3);
  }

  /* Decorative bottom border for hero */
  .il-hero-border {
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(197,160,89,0.3) 40%, rgba(197,160,89,0.3) 60%, transparent 100%);
  }

  /* ────────────────────────────────────────────
     GRID BODY
  ──────────────────────────────────────────── */
  .il-body {
    background: #0a0f1e; padding: 72px 20px 110px;
    position: relative;
  }
  .il-body::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 45% 50% at 0% 40%, rgba(197,160,89,0.03) 0%, transparent 60%),
      radial-gradient(ellipse 45% 50% at 100% 70%, rgba(28,61,122,0.06) 0%, transparent 60%);
    pointer-events: none;
  }

  .il-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    max-width: 1180px; margin: 0 auto;
    position: relative; z-index: 1;
  }

  /* ────────────────────────────────────────────
     INSIGHT CARD
  ──────────────────────────────────────────── */
  .il-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
    display: flex; flex-direction: column;
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    box-shadow: 0 4px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05);
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease, border-color 0.4s ease;
    position: relative;
    animation: cardReveal 0.55s ease both;
  }
  .il-card:nth-child(1) { animation-delay: 0.05s; }
  .il-card:nth-child(2) { animation-delay: 0.12s; }
  .il-card:nth-child(3) { animation-delay: 0.19s; }
  .il-card:nth-child(4) { animation-delay: 0.26s; }
  .il-card:nth-child(5) { animation-delay: 0.33s; }
  .il-card:nth-child(6) { animation-delay: 0.40s; }
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Hover gold top strip */
  .il-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #c5a059, #f3d38b, #c5a059, transparent);
    transform: scaleX(0); transition: transform 0.45s ease;
    transform-origin: left; z-index: 2;
  }
  .il-card:hover::before { transform: scaleX(1); }
  .il-card:hover {
    transform: translateY(-7px);
    border-color: rgba(197,160,89,0.2);
    box-shadow: 0 16px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
  }

  /* Card image */
  .il-card-img-wrap {
    width: 100%; height: 230px; overflow: hidden;
    background: linear-gradient(135deg, #0d1d3a, #1e3c72);
    flex-shrink: 0; position: relative;
  }
  .il-card-img {
    width: 100%; height: 100%; object-fit: cover;
    filter: brightness(0.85) saturate(0.9);
    transition: transform 0.6s ease, filter 0.6s ease;
  }
  .il-card:hover .il-card-img { transform: scale(1.08); filter: brightness(0.95) saturate(1.05); }

  /* Category pill on image */
  .il-card-cat-badge {
    position: absolute; top: 14px; left: 14px;
    padding: 5px 14px;
    background: linear-gradient(135deg, #c5a059, #9e7d43);
    color: #fff; border-radius: 20px;
    font-family: 'Lato', sans-serif; font-size: 0.67rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1px;
    box-shadow: 0 4px 14px rgba(197,160,89,0.4);
    z-index: 2;
  }

  /* Read time badge */
  .il-card-readtime {
    position: absolute; top: 14px; right: 14px;
    padding: 5px 12px;
    background: rgba(10,15,30,0.7);
    border: 1px solid rgba(255,255,255,0.1);
    color: #94a3b8; border-radius: 20px;
    font-family: 'Lato', sans-serif; font-size: 0.65rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.8px;
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    z-index: 2;
  }

  /* No image placeholder */
  .il-card-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
  }

  /* Card body */
  .il-card-body {
    padding: 24px 26px 28px;
    display: flex; flex-direction: column; flex: 1;
  }

  /* Date row */
  .il-card-date {
    display: flex; align-items: center; gap: 7px;
    font-family: 'Lato', sans-serif; font-size: 0.78rem; color: #475569;
    margin-bottom: 12px;
  }
  .il-card-date svg { color: #c5a059; }

  /* Title */
  .il-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.18rem; font-weight: 700; line-height: 1.42;
    margin-bottom: 12px; color: #e2e8f0;
  }
  .il-card-title a {
    color: inherit; text-decoration: none;
    transition: color 0.3s ease;
  }
  .il-card-title a:hover { color: #c5a059; }

  /* Excerpt */
  .il-card-excerpt {
    font-family: 'Lato', sans-serif; font-size: 0.88rem;
    color: #64748b; line-height: 1.7; margin-bottom: 20px; flex: 1;
    display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3;
    -webkit-box-orient: vertical; overflow: hidden;
  }

  /* Divider */
  .il-card-divider {
    height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 18px;
  }

  /* Author row + CTA */
  .il-card-footer {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .il-card-author { display: flex; align-items: center; gap: 10px; }
  .il-card-avatar {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #1e3c72, #2a5298);
    border: 1px solid rgba(197,160,89,0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-size: 0.85rem;
    font-weight: 700; color: #fff;
    box-shadow: 0 0 12px rgba(197,160,89,0.12);
  }
  .il-card-author-info { display: flex; flex-direction: column; gap: 1px; }
  .il-card-author-name {
    font-family: 'Lato', sans-serif; font-size: 0.82rem;
    font-weight: 700; color: #cbd5e1;
  }
  .il-card-author-role {
    font-family: 'Lato', sans-serif; font-size: 0.7rem; color: #475569;
  }

  /* Read more arrow link */
  .il-card-cta {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 16px;
    background: rgba(197,160,89,0.08);
    border: 1px solid rgba(197,160,89,0.2);
    border-radius: 50px; color: #c5a059;
    font-family: 'Lato', sans-serif; font-size: 0.72rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1px;
    text-decoration: none;
    transition: all 0.3s ease; flex-shrink: 0;
  }
  .il-card-cta:hover {
    background: linear-gradient(135deg, #c5a059, #9e7d43);
    color: #fff; border-color: transparent;
    box-shadow: 0 4px 14px rgba(197,160,89,0.3);
    transform: translateX(2px);
  }
  .il-card-cta svg { transition: transform 0.3s ease; }
  .il-card-cta:hover svg { transform: translateX(3px); }

  /* ────────────────────────────────────────────
     FEATURED CARD (first item, full-width)
  ──────────────────────────────────────────── */
  .il-card-featured {
    grid-column: 1 / -1;
    flex-direction: row;
  }
  .il-card-featured .il-card-img-wrap {
    width: 46%; height: 360px; flex-shrink: 0; border-radius: 0;
  }
  .il-card-featured .il-card-body { padding: 40px 44px; }
  .il-card-featured .il-card-title {
    font-size: 1.85rem; line-height: 1.3; margin-bottom: 16px;
  }
  .il-card-featured .il-card-excerpt {
    -webkit-line-clamp: 4; line-clamp: 4; font-size: 0.95rem;
  }
  .il-featured-tag {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 16px; border-radius: 50px;
    background: rgba(197,160,89,0.1);
    border: 1px solid rgba(197,160,89,0.25);
    color: #c5a059;
    font-family: 'Lato', sans-serif; font-size: 0.68rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px;
    margin-bottom: 16px;
  }

  /* ────────────────────────────────────────────
     PAGINATION
  ──────────────────────────────────────────── */
  .il-pagination {
    display: flex; justify-content: center; margin-top: 64px;
    position: relative; z-index: 1;
  }
  .il-pagination-inner {
    display: inline-flex; align-items: center; gap: 12px;
    padding: 14px 28px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 50px;
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  }
  .il-pag-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 22px;
    background: rgba(197,160,89,0.07);
    border: 1px solid rgba(197,160,89,0.22);
    color: #c5a059; border-radius: 50px; cursor: pointer;
    font-family: 'Lato', sans-serif; font-weight: 700;
    font-size: 0.77rem; text-transform: uppercase; letter-spacing: 1px;
    transition: all 0.25s ease;
  }
  .il-pag-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #c5a059, #9e7d43);
    color: #fff; border-color: transparent;
    box-shadow: 0 4px 14px rgba(197,160,89,0.28);
    transform: translateY(-1px);
  }
  .il-pag-btn:disabled { opacity: 0.25; cursor: not-allowed; }
  .il-pag-dots { display: flex; align-items: center; gap: 7px; }
  .il-pag-dot {
    width: 8px; height: 8px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.18); background: transparent;
    cursor: pointer; transition: all 0.25s ease; padding: 0;
  }
  .il-pag-dot.active {
    background: #c5a059; border-color: #c5a059;
    box-shadow: 0 0 8px rgba(197,160,89,0.5); transform: scale(1.35);
  }

  /* ────────────────────────────────────────────
     LOADING / EMPTY
  ──────────────────────────────────────────── */
  .il-loading, .il-empty {
    text-align: center; padding: 80px 20px;
    font-family: 'Lato', sans-serif; font-size: 1rem; color: #475569;
  }
  .il-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid rgba(197,160,89,0.15);
    border-top-color: #c5a059;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ────────────────────────────────────────────
     RESPONSIVE
  ──────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .il-grid { grid-template-columns: repeat(2, 1fr); }
    .il-card-featured { flex-direction: column; }
    .il-card-featured .il-card-img-wrap { width: 100%; height: 260px; }
    .il-card-featured .il-card-body { padding: 28px 30px; }
    .il-card-featured .il-card-title { font-size: 1.5rem; }
  }
  @media (max-width: 768px) {
    .il-hero { padding: 90px 20px 72px; }
    .il-hero h1 { font-size: 2.6rem; }
    .il-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
  }
  @media (max-width: 480px) {
    .il-hero h1 { font-size: 2rem; }
    .il-filter-btn { padding: 8px 16px; font-size: 0.72rem; }
  }
`;

/* ─── Utility ───────────────────────────────────────────────────────────── */
const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'EL';

const estimateReadTime = (text = '') => {
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

/* ─── Component ─────────────────────────────────────────────────────────── */
const InsightList = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchInsights(); }, [page, filter]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 7, status: 'published' };
      if (filter !== 'all') params.category = filter;
      const response = await insightsAPI.getAll(params);
      if (response.data.success) {
        setInsights(response.data.insights);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = cat => { setFilter(cat); setPage(1); };

  const filtered = insights.filter(i =>
    !search ||
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    (i.excerpt || '').toLowerCase().includes(search.toLowerCase())
  );

  const [featured, ...rest] = filtered;

  return (
    <>
      <style>{CSS}</style>
      <Helmet>
        <title>Insights — EdZure Legal LLP</title>
        <meta name="description" content="Expert legal analysis, landmark judgments, and regulatory updates from EdZure Legal LLP." />
      </Helmet>

      <Breadcrumb />

      <div className="il-page">

        {/* ── HERO ── */}
        <div className="il-hero">
          <div className="il-hero-orb il-hero-orb-1" />
          <div className="il-hero-orb il-hero-orb-2" />
          <div className="il-hero-orb il-hero-orb-3" />

          <div className="il-hero-inner">
            <div className="il-overline">
              <span className="il-overline-dot" />
              Our Knowledge Hub
            </div>

            <h1>Resources &amp; Legal Insights</h1>

            <p>
              Expert analysis on emerging legal trends, landmark judgments,
              and regulatory updates — curated for decision-makers.
            </p>

            {/* Search */}
            <div className="il-search-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search insights…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="il-filters">
              {['all', 'blog', 'news'].map(cat => (
                <button
                  key={cat}
                  className={`il-filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => handleFilterChange(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="il-hero-border" />
        </div>

        {/* ── Grid body ── */}
        <div className="il-body">
          {loading ? (
            <div className="il-loading">
              <div className="il-spinner" />
              Loading insights…
            </div>
          ) : filtered.length === 0 ? (
            <p className="il-empty">No insights found.</p>
          ) : (
            <>
              <div className="il-grid">

                {/* Featured card (first result, full-width) */}
                {featured && (
                  <article className="il-card il-card-featured">
                    <div className="il-card-img-wrap">
                      {featured.image_url ? (
                        <img
                          src={getImageUrl(featured.image_url)}
                          alt={featured.title}
                          className="il-card-img"
                        />
                      ) : (
                        <div className="il-card-placeholder">
                          <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52"
                            viewBox="0 0 24 24" fill="none"
                            stroke="rgba(197,160,89,0.18)" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                      <span className="il-card-cat-badge">{featured.category}</span>
                    </div>

                    <div className="il-card-body">
                      <div className="il-featured-tag">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                          viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Featured Article
                      </div>

                      <div className="il-card-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDate(featured.published_at)}
                        &nbsp;&nbsp;·&nbsp;&nbsp;
                        {estimateReadTime(featured.excerpt || '')}
                      </div>

                      <h2 className="il-card-title" style={{ fontSize: '1.85rem', lineHeight: '1.28' }}>
                        <Link to={`/insights/${featured.slug}`}>{featured.title}</Link>
                      </h2>

                      <p className="il-card-excerpt">{featured.excerpt}</p>

                      <div className="il-card-divider" />

                      <div className="il-card-footer">
                        <div className="il-card-author">
                          <div className="il-card-avatar">{getInitials(featured.author)}</div>
                          <div className="il-card-author-info">
                            <span className="il-card-author-name">{featured.author}</span>
                            <span className="il-card-author-role">Legal Analyst</span>
                          </div>
                        </div>
                        <Link to={`/insights/${featured.slug}`} className="il-card-cta">
                          Read Article
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                )}

                {/* Remaining cards */}
                {rest.map(insight => (
                  <article key={insight.id} className="il-card">
                    <div className="il-card-img-wrap">
                      {insight.image_url ? (
                        <img
                          src={getImageUrl(insight.image_url)}
                          alt={insight.title}
                          className="il-card-img"
                        />
                      ) : (
                        <div className="il-card-placeholder">
                          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"
                            viewBox="0 0 24 24" fill="none"
                            stroke="rgba(197,160,89,0.18)" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                      <span className="il-card-cat-badge">{insight.category}</span>
                      <span className="il-card-readtime">
                        {estimateReadTime(insight.excerpt || '')}
                      </span>
                    </div>

                    <div className="il-card-body">
                      <div className="il-card-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDate(insight.published_at)}
                      </div>

                      <h3 className="il-card-title">
                        <Link to={`/insights/${insight.slug}`}>{insight.title}</Link>
                      </h3>

                      <p className="il-card-excerpt">
                        {truncateText(insight.excerpt || '', 130)}
                      </p>

                      <div className="il-card-divider" />

                      <div className="il-card-footer">
                        <div className="il-card-author">
                          <div className="il-card-avatar">{getInitials(insight.author)}</div>
                          <div className="il-card-author-info">
                            <span className="il-card-author-name">{insight.author}</span>
                            <span className="il-card-author-role">Legal Analyst</span>
                          </div>
                        </div>
                        <Link to={`/insights/${insight.slug}`} className="il-card-cta">
                          Read
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="il-pagination">
                  <div className="il-pagination-inner">
                    <button
                      className="il-pag-btn"
                      onClick={() => setPage(p => Math.max(p - 1, 1))}
                      disabled={page === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Prev
                    </button>
                    <div className="il-pag-dots">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          className={`il-pag-dot ${page === i + 1 ? 'active' : ''}`}
                          onClick={() => setPage(i + 1)}
                        />
                      ))}
                    </div>
                    <button
                      className="il-pag-btn"
                      onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default InsightList;