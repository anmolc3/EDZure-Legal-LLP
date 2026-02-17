import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { insightsAPI } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInsights: 0,
    totalViews: 0,
    publishedCount: 0,
    draftCount: 0
  });
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Insights Data for Stats
      const response = await insightsAPI.getAll({ limit: 1000 });
      if (response.data.success) {
        const insights = response.data.insights;
        const totalViews = insights.reduce((acc, curr) => acc + (curr.views || 0), 0);
        const published = insights.filter(i => i.status === 'published').length;
        const drafts = insights.filter(i => i.status === 'draft').length;

        setStats({
          totalInsights: insights.length,
          totalViews,
          publishedCount: published,
          draftCount: drafts
        });
      }

      // 2. Fetch Recent Visitors (Mock Data - Replace with API call)
      // const visitorsRes = await api.get('/visitors/recent');
      setRecentVisitors([
        { id: 1, ip: '192.168.1.42', location: 'Mumbai, IN', page: '/insights/corporate-law', time: '2 mins ago' },
        { id: 2, ip: '10.0.0.15', location: 'Delhi, IN', page: '/about', time: '12 mins ago' },
        { id: 3, ip: '172.16.0.8', location: 'Bangalore, IN', page: '/insights/tax-reforms', time: '45 mins ago' },
        { id: 4, ip: '192.168.1.10', location: 'Chennai, IN', page: '/', time: '1 hour ago' },
        { id: 5, ip: '10.0.0.5', location: 'Hyderabad, IN', page: '/contact', time: '2 hours ago' },
      ]);

      // 3. Fetch Recent Contacts (Mock Data - Replace with API call)
      // const contactsRes = await api.get('/contacts/recent');
      setRecentContacts([
        { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', subject: 'Legal Consultation Request', date: 'Today, 10:30 AM' },
        { id: 2, name: 'Priya Verma', email: 'priya.v@test.com', subject: 'Partnership Inquiry', date: 'Yesterday, 4:15 PM' },
        { id: 3, name: 'Amit Singh', email: 'amit.singh@corp.com', subject: 'Retainer Agreement', date: 'Oct 24, 2023' },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <Helmet>
        <title>Admin Dashboard — EdZure Legal LLP</title>
      </Helmet>

      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.username || 'Admin'}</h1>
          <p>Here's what's happening with your platform today.</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/add-insight" className="btn-primary">+ New Insight</Link>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon insights-icon">📝</div>
          <div className="stat-info">
            <h3>{stats.totalInsights}</h3>
            <span>Total Insights</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon views-icon">👁️</div>
          <div className="stat-info">
            <h3>{stats.totalViews}</h3>
            <span>Total Views</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon published-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.publishedCount}</h3>
            <span>Published</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon draft-icon">✏️</div>
          <div className="stat-info">
            <h3>{stats.draftCount}</h3>
            <span>Drafts</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="dashboard-content-grid">

        {/* Recent Visitors */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2>Recent Visitors</h2>
          </div>
          <div className="panel-body">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Location / IP</th>
                  <th>Page</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentVisitors.map(visitor => (
                  <tr key={visitor.id}>
                    <td>
                      <div className="visitor-location">
                        <span className="location-dot"></span>
                        {visitor.location}
                      </div>
                      <span className="visitor-ip">{visitor.ip}</span>
                    </td>
                    <td className="visitor-page">{visitor.page}</td>
                    <td className="visitor-time">{visitor.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2>Recent Contacts</h2>
          </div>
          <div className="panel-body">
            <div className="contacts-list">
              {recentContacts.map(contact => (
                <div key={contact.id} className="contact-item">
                  <div className="contact-avatar">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="contact-details">
                    <h4>{contact.name}</h4>
                    <p>{contact.subject}</p>
                  </div>
                  <div className="contact-meta">
                    <span>{contact.date}</span>
                    <a href={`mailto:${contact.email}`} className="btn-xs">Reply</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;