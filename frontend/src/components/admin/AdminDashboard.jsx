import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { insightsAPI } from '../../services/api';
import './AdminDashboard.css';

/* ── SVG Icons ── */
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const RefreshIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalInsights: 0, totalViews: 0, publishedCount: 0, draftCount: 0 });
  const [insights, setInsights] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [contactTab, setContactTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);

  /* insights list state */
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await insightsAPI.getAll({ limit: 1000 });
      if (response.data.success) {
        const data = response.data.insights;
        setInsights(data);
        const totalViews = data.reduce((acc, cur) => acc + (cur.views || 0), 0);
        const publishedCount = data.filter(i => i.status === 'published').length;
        const draftCount = data.filter(i => i.status === 'draft').length;
        setStats({ totalInsights: data.length, totalViews, publishedCount, draftCount });
      }

      setRecentVisitors([
        { id: 1, location: 'Mumbai, IN', ip: '192.168.1.42', page: '/insights/corporate-law', time: '2 mins ago', device: '💻' },
        { id: 2, location: 'Delhi, IN', ip: '10.0.0.15', page: '/about', time: '12 mins ago', device: '📱' },
        { id: 3, location: 'Bangalore, IN', ip: '172.16.0.8', page: '/insights/tax-reforms', time: '45 mins ago', device: '💻' },
        { id: 4, location: 'Chennai, IN', ip: '192.168.1.10', page: '/', time: '1 hour ago', device: '📱' },
        { id: 5, location: 'Hyderabad, IN', ip: '10.0.0.5', page: '/contact', time: '2 hours ago', device: '💻' },
      ]);
      setRecentContacts([
        { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', subject: 'Legal Consultation Request', date: 'Today, 10:30 AM', status: 'new' },
        { id: 2, name: 'Priya Verma', email: 'priya.v@test.com', subject: 'Partnership Inquiry', date: 'Yesterday, 4:15 PM', status: 'read' },
        { id: 3, name: 'Amit Singh', email: 'amit.singh@corp.com', subject: 'Retainer Agreement', date: 'Oct 24, 2023', status: 'replied' },
      ]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await insightsAPI.delete(deleteTarget.id);
      setInsights(prev => prev.filter(i => i.id !== deleteTarget.id));
      setStats(prev => ({
        ...prev,
        totalInsights: prev.totalInsights - 1,
        publishedCount: deleteTarget.status === 'published' ? prev.publishedCount - 1 : prev.publishedCount,
        draftCount: deleteTarget.status === 'draft' ? prev.draftCount - 1 : prev.draftCount,
      }));
      setSuccessMsg(`"${deleteTarget.title}" deleted successfully.`);
      setTimeout(() => setSuccessMsg(''), 3500);
      setDeleteTarget(null);
    } catch {
      console.error('Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  /* Filtered insights */
  const filteredInsights = insights.filter(i => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (filterCategory !== 'all' && i.category !== filterCategory) return false;
    if (searchQuery && !i.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(i.author || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredContacts = contactTab === 'all'
    ? recentContacts
    : recentContacts.filter(c => c.status === contactTab);

  const statusDotClass = { new: 'status-dot-new', read: 'status-dot-read', replied: 'status-dot-replied' };

  const statCards = [
    { value: stats.totalInsights, label: 'Total Insights', color: '#14b8a6', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    )},
    { value: stats.totalViews, label: 'Total Views', color: '#6366f1', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    )},
    { value: stats.publishedCount, label: 'Published', color: '#4ade80', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    )},
    { value: stats.draftCount, label: 'Drafts', color: '#fbbf24', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    )},
  ];

  if (loading) return (
    <div className="admin-dashboard">
      <div className="loading">
        <div className="loading-spinner" />
        Loading Dashboard…
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dash-wrap">
      <Helmet><title>Admin Dashboard — EdZure Legal LLP</title></Helmet>

      {/* ── Header ── */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-greeting">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},</div>
          <h1>{user?.username || 'Admin'} <span className="wave">👋</span></h1>
          <p>Here's what's happening with your platform today.</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/insights/add" className="btn btn-primary">
            <PlusIcon /> New Insight
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            <LogoutIcon /> Logout
          </button>
        </div>
      </div>

      {/* ── Success alert ── */}
      {successMsg && (
        <div className="alert alert-success">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {successMsg}
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div className="stat-card" key={i} style={{ '--accent': card.color }}>
            <div className="stat-icon-wrap" style={{ background: `${card.color}14`, borderColor: `${card.color}22`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-body">
              <span className="stat-value">{card.value.toLocaleString()}</span>
              <span className="stat-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Widgets Row ── */}
      <div className="widgets-row">
        {/* Recent Visitors */}
        <div className="widget-card">
          <div className="widget-header">
            <h3 className="widget-title">Recent Visitors</h3>
            <span className="widget-badge">{recentVisitors.length} today</span>
          </div>
          <div className="visitor-list">
            {recentVisitors.map(v => (
              <div className="visitor-row" key={v.id}>
                <span className="visitor-device">{v.device}</span>
                <div className="visitor-info">
                  <span className="visitor-page">{v.page}</span>
                  <span className="visitor-meta">{v.location} · {v.ip}</span>
                </div>
                <span className="visitor-time">{v.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="widget-card">
          <div className="widget-header">
            <h3 className="widget-title">Recent Contacts</h3>
            <span className="widget-badge new-badge">
              {recentContacts.filter(c => c.status === 'new').length} new
            </span>
          </div>
          <div className="contact-filter-tabs">
            {['all', 'new', 'read', 'replied'].map(tab => (
              <button key={tab} className={`contact-tab ${contactTab === tab ? 'active' : ''}`} onClick={() => setContactTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="tab-count">
                  {tab === 'all' ? recentContacts.length : recentContacts.filter(c => c.status === tab).length}
                </span>
              </button>
            ))}
          </div>
          <div className="contact-list">
            {filteredContacts.length === 0 ? (
              <div className="no-data">No contacts in this category</div>
            ) : filteredContacts.map(c => (
              <div key={c.id} className={`contact-row ${c.status === 'new' ? 'contact-new' : ''}`}>
                <div className="contact-avatar">{c.name.charAt(0)}</div>
                <div className="contact-info">
                  <div className="contact-top">
                    <span className="contact-name">{c.name}</span>
                    <span className={`contact-status-dot ${statusDotClass[c.status]}`} title={c.status} />
                  </div>
                  <span className="contact-subject">{c.subject}</span>
                  <span className="contact-email">{c.email}</span>
                </div>
                <span className="contact-time">{c.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Insights List ── */}
      <div className="insights-section">
        <div className="insights-section-header">
          <div className="section-title-row">
            <h2 className="section-heading">All Insights</h2>
            <span className="section-count">{filteredInsights.length} of {insights.length}</span>
          </div>
          <div className="insights-controls">
            <div className="search-wrap">
              <SearchIcon />
              <input
                type="text"
                className="search-input"
                placeholder="Search by title or author…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-pills">
              {['all', 'published', 'draft'].map(s => (
                <button key={s} className={`filter-pill ${filterStatus === s ? 'active' : ''}`}
                  onClick={() => setFilterStatus(s)}>
                  {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div className="filter-pills">
              {['all', 'blog', 'news'].map(c => (
                <button key={c} className={`filter-pill cat ${filterCategory === c ? 'active-cat' : ''}`}
                  onClick={() => setFilterCategory(c)}>
                  {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
            <button className="btn btn-icon" onClick={fetchDashboardData} title="Refresh">
              <RefreshIcon />
            </button>
          </div>
        </div>

        {filteredInsights.length === 0 ? (
          <div className="no-insights">
            {searchQuery || filterStatus !== 'all' || filterCategory !== 'all' ? (
              <>
                <div className="no-insights-icon">🔍</div>
                <p>No insights match your filters.</p>
                <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterCategory('all'); }}>
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <div className="no-insights-icon">✍️</div>
                <p>No insights yet. Create your first one!</p>
                <Link to="/admin/insights/add" className="btn btn-primary"><PlusIcon /> New Insight</Link>
              </>
            )}
          </div>
        ) : (
          <div className="insights-table-container">
            <table className="insights-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInsights.map(insight => (
                  <tr key={insight.id}>
                    <td className="title-cell">
                      <strong className="insight-title">{insight.title}</strong>
                      {insight.excerpt && (
                        <span className="insight-excerpt">{insight.excerpt.substring(0, 60)}{insight.excerpt.length > 60 ? '…' : ''}</span>
                      )}
                    </td>
                    <td>
                      <span className={`category-badge cat-${insight.category}`}>{insight.category}</span>
                    </td>
                    <td className="author-cell">{insight.author || '—'}</td>
                    <td>
                      <span className={`status-badge status-${insight.status}`}>
                        {insight.status}
                      </span>
                    </td>
                    <td className="views-cell">{(insight.views || 0).toLocaleString()}</td>
                    <td className="date-cell">
                      {insight.created_at
                        ? new Date(insight.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <Link to={`/insights/${insight.slug || insight.id}`}
                          target="_blank" className="action-btn view-btn" title="View">
                          <EyeIcon />
                        </Link>
                        <Link to={`/admin/insights/edit/${insight.id}`}
                          className="action-btn edit-btn" title="Edit">
                          <EditIcon />
                        </Link>
                        <button className="action-btn delete-btn" title="Delete"
                          onClick={() => setDeleteTarget(insight)}>
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="modal-content">
            <div className="modal-icon"><AlertIcon /></div>
            <h3>Delete Insight?</h3>
            <p>
              <strong>"{deleteTarget.title}"</strong> will be permanently removed.
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
