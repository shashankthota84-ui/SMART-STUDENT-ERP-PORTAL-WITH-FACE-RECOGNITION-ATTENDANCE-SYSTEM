// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/storageUtils';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    const user = loginUser(formData.email, formData.password);

    if (user) {
      // Successfully logged in via password, now verify face
      navigate('/face-verification');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <div className="text-center mb-6">
          <h1 className="page-title gradient-text">Welcome Back</h1>
          <p className="page-subtitle">Login to Smart ERP Portal</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
              placeholder="student@example.com"
            />
          </div>
          
          <div className="form-group mb-6">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-input" 
              value={formData.password} 
              onChange={handleInputChange} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{width: '100%'}}>
            Login
          </button>
          
          <div className="mt-6 text-center text-muted">
            Don't have an account? <Link to="/register" className="gradient-text" style={{textDecoration: 'none'}}>Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
