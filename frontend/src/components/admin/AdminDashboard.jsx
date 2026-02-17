import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { insightsAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import './AdminDashboard.css';

// ─── Mock data (replace with real API calls when endpoints are ready) ──────────
const MOCK_VISITORS = [
  { id: 1, page: '/insights/understanding-contract-law', ip: '102.89.23.14', country: 'Nigeria', device: 'Desktop', time: '2 min ago' },
  { id: 2, page: '/insights/property-rights-overview', ip: '41.58.120.77', country: 'Ghana', device: 'Mobile', time: '8 min ago' },
  { id: 3, page: '/lks', ip: '197.210.55.3', country: 'Nigeria', device: 'Desktop', time: '15 min ago' },
  { id: 4, page: '/', ip: '196.26.4.211', country: 'South Africa', device: 'Tablet', time: '22 min ago' },
  { id: 5, page: '/insights', ip: '154.72.149.90', country: 'Kenya', device: 'Mobile', time: '31 min ago' },
  { id: 6, page: '/farmer', ip: '41.190.3.87', country: 'Nigeria', device: 'Desktop', time: '45 min ago' },
];

const MOCK_CONTACTS = [
  { id: 1, name: 'Amara Okafor', email: 'amara.okafor@email.com', subject: 'Contract Review Query', status: 'new', time: '5 min ago' },
  { id: 2, name: 'David Mensah', email: 'd.mensah@company.com', subject: 'LKS Subscription Enquiry', status: 'new', time: '1 hr ago' },
  { id: 3, name: 'Fatima Al-Rashid', email: 'fatima.r@outlook.com', subject: 'Legal Consultation Request', status: 'read', time: '3 hrs ago' },
  { id: 4, name: 'James Thornton', email: 'j.thornton@lawfirm.co.uk', subject: 'Partnership Opportunity', status: 'read', time: '6 hrs ago' },
  { id: 5, name: 'Ngozi Adeyemi', email: 'ngozi.a@gmail.com', subject: 'Property Law Question', status: 'replied', time: 'Yesterday' },
  { id: 6, name: 'Samuel Eze', email: 'samuel.eze@corp.ng', subject: 'FARMER Programme Interest', status: 'replied', time: 'Yesterday' },
];

const DEVICE_ICONS = { Desktop: '🖥️', Mobile: '📱', Tablet: '📟' };

const AdminDashboard = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [visitors, setVisitors] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeContactFilter, setActiveContactFilter] = useState('all');
  const [visitorLoading, setVisitorLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
    loadVisitors();
    loadContacts();
  }, [filter]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (filter !== 'all') params.status = filter;
      const response = await insightsAPI.getAll(params);
      if (response.data.success) setInsights(response.data.insights);
    } catch (error) {
      console.error('Error fetching insights:', error);
      showMessage('error', 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const loadVisitors = () => {
    setVisitorLoading(true);
    setTimeout(() => { setVisitors(MOCK_VISITORS); setVisitorLoading(false); }, 600);
  };

  const loadContacts = () => {
    setContactLoading(true);
    setTimeout(() => { setContacts(MOCK_CONTACTS); setContactLoading(false); }, 800);
  };

  const handleDelete = async (id) => {
    try {
      const response = await insightsAPI.delete(id);
      if (response.data.success) {
        setInsights(insights.filter(insight => insight.id !== id));
        showMessage('success', 'Insight deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting insight:', error);
      showMessage('error', 'Failed to delete insight');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const markContactRead = (id) => {
    setContacts(prev =>
      prev.map(c => c.id === id && c.status === 'new' ? { ...c, status: 'read' } : c)
    );
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getStatusBadge = (status) =>
    status === 'published' ? 'status-published' : 'status-draft';

  const filteredContacts =
    activeContactFilter === 'all'
      ? contacts
      : contacts.filter(c => c.status === activeContactFilter);

  const stats = [
    { label: 'Total Insights', value: insights.length, icon: '📄', color: '#1e3c72' },
    { label: 'Published', value: insights.filter(i => i.status === 'published').length, icon: '✅', color: '#166534' },
    { label: 'Drafts', value: insights.filter(i => i.status === 'draft').length, icon: '📝', color: '#854d0e' },
    { label: 'New Messages', value: contacts.filter(c => c.status === 'new').length, icon: '💬', color: '#7c3aed' },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard - EdZure Legal LLP</title></Helmet>
      <div className="admin-dashboard">
        <div className="container">

          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <Link to="/admin/insights/add" className="btn btn-primary">+ Add New Insight</Link>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`}>{message.text}</div>
          )}

          {/* Stat Cards */}
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div className="stat-card" key={i} style={{ '--accent': s.color }}>
                <span className="stat-icon">{s.icon}</span>
                <div className="stat-body">
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Visitors + Contacts widgets */}
          <div className="widgets-row">

            {/* Recent Visitors */}
            <div className="widget-card">
              <div className="widget-header">
                <h2 className="widget-title">🌐 Recent Visitors</h2>
                <span className="widget-badge">{visitors.length} today</span>
              </div>
              {visitorLoading ? (
                <div className="widget-loading">Loading…</div>
              ) : (
                <div className="visitor-list">
                  {visitors.map(v => (
                    <div className="visitor-row" key={v.id}>
                      <span className="visitor-device" title={v.device}>{DEVICE_ICONS[v.device]}</span>
                      <div className="visitor-info">
                        <span className="visitor-page" title={v.page}>{v.page}</span>
                        <span className="visitor-meta">{v.ip} · {v.country}</span>
                      </div>
                      <span className="visitor-time">{v.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Contacts */}
            <div className="widget-card">
              <div className="widget-header">
                <h2 className="widget-title">💬 Recent Contacts</h2>
                <span className="widget-badge new-badge">
                  {contacts.filter(c => c.status === 'new').length} new
                </span>
              </div>

              <div className="contact-filter-tabs">
                {['all', 'new', 'read', 'replied'].map(tab => (
                  <button
                    key={tab}
                    className={`contact-tab ${activeContactFilter === tab ? 'active' : ''}`}
                    onClick={() => setActiveContactFilter(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab !== 'all' && (
                      <span className="tab-count">
                        {contacts.filter(c => c.status === tab).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {contactLoading ? (
                <div className="widget-loading">Loading…</div>
              ) : (
                <div className="contact-list">
                  {filteredContacts.length === 0 ? (
                    <p className="no-data">No {activeContactFilter === 'all' ? '' : activeContactFilter} messages.</p>
                  ) : filteredContacts.map(c => (
                    <div
                      className={`contact-row ${c.status === 'new' ? 'contact-new' : ''}`}
                      key={c.id}
                      onClick={() => markContactRead(c.id)}
                    >
                      <div className="contact-avatar">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="contact-info">
                        <div className="contact-top">
                          <span className="contact-name">{c.name}</span>
                          <span className={`contact-status-dot status-dot-${c.status}`} title={c.status} />
                        </div>
                        <span className="contact-subject">{c.subject}</span>
                        <span className="contact-email">{c.email}</span>
                      </div>
                      <span className="contact-time">{c.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Insights Table */}
          <div className="section-title-row">
            <h2 className="section-heading">📄 Manage Insights</h2>
          </div>

          <div className="dashboard-filters">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All ({insights.length})
            </button>
            <button className={`filter-btn ${filter === 'published' ? 'active' : ''}`} onClick={() => setFilter('published')}>
              Published ({insights.filter(i => i.status === 'published').length})
            </button>
            <button className={`filter-btn ${filter === 'draft' ? 'active' : ''}`} onClick={() => setFilter('draft')}>
              Drafts ({insights.filter(i => i.status === 'draft').length})
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading insights...</div>
          ) : insights.length > 0 ? (
            <div className="insights-table-container">
              <table className="insights-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Author</th>
                    <th>Views</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.map((insight) => (
                    <tr key={insight.id}>
                      <td className="title-cell"><strong>{insight.title}</strong></td>
                      <td><span className="category-badge">{insight.category}</span></td>
                      <td><span className={`status-badge ${getStatusBadge(insight.status)}`}>{insight.status}</span></td>
                      <td>{insight.author}</td>
                      <td>{insight.views}</td>
                      <td>{formatDate(insight.created_at)}</td>
                      <td className="actions-cell">
                        <Link to={`/insights/${insight.slug}`} className="action-btn view-btn" target="_blank" title="View">👁️</Link>
                        <Link to={`/admin/insights/edit/${insight.id}`} className="action-btn edit-btn" title="Edit">✏️</Link>
                        <button onClick={() => setDeleteConfirm(insight.id)} className="action-btn delete-btn" title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-insights">
              <p>No insights found.</p>
              <Link to="/admin/insights/add" className="btn btn-primary">Create Your First Insight</Link>
            </div>
          )}

        </div>
      </div>

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this insight? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteConfirm(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;