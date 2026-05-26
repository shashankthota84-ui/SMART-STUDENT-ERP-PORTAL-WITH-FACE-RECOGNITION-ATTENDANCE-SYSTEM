/**
 * @file Login.jsx
 * @description User login page. Handles credential-based authentication (email and password)
 * before redirecting the user to the secondary face verification step.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/storageUtils';

/**
 * Login Component
 * @returns {JSX.Element} The login form UI
 */
const Login = () => {
  const navigate = useNavigate();
  
  // State for managing form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // State for displaying error messages to the user
  const [error, setError] = useState('');

  /**
   * Event handler for input field changes.
   * Dynamically updates the form state based on input name.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Event handler for form submission.
   * Attempts to authenticate the user and redirects upon success.
   * @param {React.FormEvent} e - Form submit event
   */
  const handleLogin = (e) => {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();
    setError(''); // Reset any previous errors

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    // Call storage utility to verify credentials
    const user = loginUser(formData.email, formData.password);

    if (user) {
      // Step 1 of authentication passed (credentials valid).
      // Step 2 is mandatory: route to face verification.
      navigate('/face-verification');
    } else {
      // Authentication failed
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

        {/* Display error alert if an error exists in state */}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          {/* Email input field */}
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
          
          {/* Password input field */}
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

          {/* Submit button */}
          <button type="submit" className="btn btn-primary w-full" style={{width: '100%'}}>
            Login
          </button>
          
          {/* Link to Registration page for new users */}
          <div className="mt-6 text-center text-muted">
            Don't have an account? <Link to="/register" className="gradient-text" style={{textDecoration: 'none'}}>Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
