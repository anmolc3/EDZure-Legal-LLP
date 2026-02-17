import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LegalDisclaimerModal from './components/common/LegalDisclaimerModal';
import ShareButton from './components/common/ShareButton';

// Public Pages
import Home from './components/pages/Home';
import About from './components/pages/About';
import AreaOfPractice from './components/pages/AreaOfPractice';
import LKS from './components/pages/LKS';
import FARMER from './components/pages/FARMER';
import CMS from './components/pages/CMS';
import LegalDisclaimer from './components/pages/LegalDisclaimer';

// Insight Pages
import InsightList from './components/insights/InsightList';
import InsightDetail from './components/insights/InsightDetail';

// Admin Pages
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AddInsight from './components/admin/AddInsight';
import EditInsight from './components/admin/EditInsight';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <LegalDisclaimerModal />
            <Navbar />
            
            <main className="main-content">
              <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/area-of-practice" element={<AreaOfPractice />} />
                <Route path="/lks" element={<LKS />} />
                <Route path="/farmer" element={<FARMER />} />
                <Route path="/cms" element={<CMS />} />
                <Route path="/legal-disclaimer" element={<LegalDisclaimer />} />
                
                <Route path="/insights" element={<InsightList />} />
                <Route path="/insights/:slug" element={<InsightDetail />} />
                
                {/* --- Admin Routes --- */}
                
                {/* 1. Redirect /admin -> /admin/login */}
                <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                
                {/* 2. Login Page */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* 3. Protected Dashboard Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/insights/add"
                  element={
                    <ProtectedRoute>
                      <AddInsight />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/insights/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditInsight />
                    </ProtectedRoute>
                  }
                />

                {/* --- 404 Catch-All --- */}
                {/* This must be the LAST route. It redirects unknown pages to Home */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>

            {/* Global Floating Share Button */}
            <ShareButton />
            
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;