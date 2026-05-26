/**
 * @file Navbar.jsx
 * @description Navigation bar component that provides links to different sections of the application.
 * Highlights the active link and handles user logout.
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser, getLoggedInUser } from '../utils/storageUtils';

/**
 * Navbar Component
 * @returns {JSX.Element|null} Navigation UI or null if no user is logged in
 */
const Navbar = () => {
  // Hook to navigate programmatically
  const navigate = useNavigate();
  
  // Retrieve the currently logged-in user from storage
  const user = getLoggedInUser();

  /**
   * Handles the logout process
   * Clears user session and redirects to the login page
   */
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Do not render the navbar if the user is not authenticated
  if (!user) return null;

  return (
    <nav className="navbar">
      {/* Brand logo/name */}
      <div className="nav-brand gradient-text">Smart ERP</div>
      
      {/* Navigation links container */}
      <div className="nav-links">
        {/* NavLink automatically applies 'active' class when the route matches */}
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/attendance" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Mark Attendance
        </NavLink>
        
        <NavLink 
          to="/results" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Attendance
        </NavLink>

        <NavLink 
          to="/academics" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Academics
        </NavLink>

        <NavLink 
          to="/exams" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Exams
        </NavLink>

        <NavLink 
          to="/fees" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Fees
        </NavLink>

        <NavLink 
          to="/syllabus" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Syllabus
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Profile
        </NavLink>

        <NavLink 
          to="/admin" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Admin Demo
        </NavLink>

        {/* Logout button */}
        <div className="nav-item nav-logout" onClick={handleLogout}>
          Logout
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
