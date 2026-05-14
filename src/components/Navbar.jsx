// src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser, getLoggedInUser } from '../utils/storageUtils';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getLoggedInUser();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand gradient-text">Smart ERP</div>
      
      <div className="nav-links">
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

        <div className="nav-item nav-logout" onClick={handleLogout}>
          Logout
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
