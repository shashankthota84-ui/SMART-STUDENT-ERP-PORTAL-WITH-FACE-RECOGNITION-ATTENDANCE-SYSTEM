/**
 * @file Profile.jsx
 * @description User profile page where students can view their details and update
 * specific non-critical information like phone number and branch/year.
 */

import React, { useState } from 'react';
import { getLoggedInUser, updateStudent } from '../utils/storageUtils';

/**
 * Profile Component
 * @returns {JSX.Element} The profile view and edit form
 */
const Profile = () => {
  // Fetch current user from local storage
  const user = getLoggedInUser();
  
  // Initialize form state with existing user data
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    branch: user.branch || '',
    year: user.year || '',
    phone: user.phone || ''
  });
  
  // State for showing success/error alerts upon save
  const [status, setStatus] = useState({ type: '', message: '' });

  /**
   * Event handler for updating form state dynamically as the user types
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from an input field
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Event handler for saving updated profile details
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSave = (e) => {
    e.preventDefault();
    try {
      // Call utility to persist changes to LocalStorage
      updateStudent(user.rollNumber, formData);
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update profile.' });
    }
  };

  // Format the user's account creation date for display
  const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';

  return (
    <div className="max-w-2xl mx-auto" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="page-header">
        <h1 className="page-title gradient-text">My Profile</h1>
        <p className="page-subtitle">Manage your account details</p>
      </div>

      {/* Header Card: Profile Avatar and Status */}
      <div className="glass-card mb-6 flex items-center" style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
        {/* Generate dynamic avatar using initials */}
        <div className="profile-avatar" style={{margin: 0, width: '100px', height: '100px', fontSize: '2.5rem'}}>
          {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
        </div>
        <div>
          <h2 className="text-2xl mb-1">{user.fullName}</h2>
          <p className="text-muted">{user.email}</p>
          <div className="mt-2 flex gap-2" style={{display: 'flex', gap: '1rem', marginTop: '0.5rem'}}>
            <span className="status-badge status-present">Face Registered</span>
            <span className="text-sm text-muted">Member since {createdDate}</span>
          </div>
        </div>
      </div>

      {/* Profile Editing Form */}
      <div className="glass-card">
        <h3 className="text-xl mb-4">Edit Details</h3>
        
        {/* Alert message display */}
        {status.message && (
          <div className={`alert alert-${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="auth-grid">
            
            {/* Editable Fields */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                className="form-input" 
                value={formData.fullName} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            {/* Non-editable Fields (Disabled) */}
            <div className="form-group">
              <label className="form-label">Roll Number (Cannot be changed)</label>
              <input 
                type="text" 
                className="form-input text-muted" 
                value={user.rollNumber} 
                disabled 
                style={{cursor: 'not-allowed', opacity: 0.7}}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (Cannot be changed)</label>
              <input 
                type="email" 
                className="form-input text-muted" 
                value={user.email} 
                disabled 
                style={{cursor: 'not-allowed', opacity: 0.7}}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Class / Branch</label>
              <input 
                type="text" 
                name="branch" 
                className="form-input" 
                value={formData.branch} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <input 
                type="text" 
                name="year" 
                className="form-input" 
                value={formData.year} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                className="form-input" 
                value={formData.phone} 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end" style={{display: 'flex', justifyContent: 'flex-end'}}>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
