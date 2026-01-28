
import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ user: '', pass: '' });
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.user === 'admin' && credentials.pass === 'admin123') {
      onLogin(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="container d-flex flex-grow-1 align-items-center justify-content-center py-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="bg-primary p-4 text-center text-white">
          <i className="fas fa-user-shield fs-1 mb-3"></i>
          <h4 className="fw-bold m-0">Admin Access</h4>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleLogin}>
            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                Invalid credentials. Please try again.
              </div>
            )}
            <div className="mb-3">
              <label className="form-label small fw-bold">Username</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="admin"
                value={credentials.user}
                onChange={e => setCredentials({...credentials, user: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold">Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="admin123"
                value={credentials.pass}
                onChange={e => setCredentials({...credentials, pass: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
              Sign In
            </button>
          </form>
        </div>
        <div className="card-footer text-center bg-light border-0 py-3">
          <p className="text-muted m-0" style={{ fontSize: '0.75rem' }}>
            Demo: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
