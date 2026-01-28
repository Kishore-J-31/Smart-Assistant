import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import ChatInterface from './components/ChatInterface.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import Login from './components/Login.jsx';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const savedDocs = localStorage.getItem('smart_support_docs');
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    }
  }, []);

  const handleRefresh = () => {
    const savedDocs = localStorage.getItem('smart_support_docs');
    setDocuments(savedDocs ? JSON.parse(savedDocs) : []);
  };

  const handleLogin = (success) => {
    if (success) setIsAuthenticated(true);
  };

  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Router>
      <div className="d-flex flex-column vh-100">
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 sticky-top shadow-sm">
          <div className="container">
            <Link to="/" className="navbar-brand fw-bold text-primary d-flex align-items-center">
              <i className="fas fa-robot me-2 fs-4"></i>
              <span>SmartSupport <span className="text-secondary opacity-75">AI</span></span>
            </Link>
            <div className="ms-auto d-flex align-items-center gap-3">
              <Link to="/" className="nav-link fw-medium">Chat</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/admin" className="nav-link fw-medium">Admin</Link>
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">Logout</button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm rounded-pill px-3">Admin Access</Link>
              )}
            </div>
          </div>
        </nav>

        <main className="flex-grow-1 d-flex flex-column overflow-hidden">
          <Routes>
            <Route path="/" element={<ChatInterface documents={documents} />} />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/admin" 
              element={
                isAuthenticated ? (
                  <AdminDashboard 
                    documents={documents} 
                    onRefresh={handleRefresh}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;