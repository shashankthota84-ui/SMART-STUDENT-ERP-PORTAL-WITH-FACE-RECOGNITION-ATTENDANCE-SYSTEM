/**
 * @file Dashboard.jsx
 * @description Main dashboard component for the student portal. 
 * Displays student profile summary, attendance statistics, daily schedule, and quick links to other modules.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { getLoggedInUser, getStudentAttendanceHistory, getDailySchedule } from '../utils/storageUtils';

/**
 * Dashboard Component
 * @returns {JSX.Element} The rendered dashboard view
 */
const Dashboard = () => {
  // Fetch current user and their specific data from local storage
  const user = getLoggedInUser();
  const schedule = getDailySchedule();
  const history = getStudentAttendanceHistory(user.rollNumber);
  
  // Calculate attendance statistics
  const totalDays = history.length;
  const presentDays = history.filter(r => r.status === 'Present').length;
  const absentDays = totalDays - presentDays;
  
  // Calculate percentage, guarding against division by zero
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  
  // Get the most recent attendance record status and date
  const latestStatus = history.length > 0 ? history[history.length - 1].status : 'No data';
  const latestDate = history.length > 0 ? history[history.length - 1].date : 'N/A';

  /**
   * Helper function to extract initials from a full name (e.g. "John Doe" -> "JD")
   * @param {string} name - Full name
   * @returns {string} Two-letter initials
   */
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div>
      {/* Page Header section */}
      <div className="page-header">
        <h1 className="page-title gradient-text">Welcome, {user.fullName}</h1>
        <p className="page-subtitle">Smart Student ERP Dashboard</p>
      </div>

      <div className="dashboard-grid">
        {/* Profile Summary Card: Spans across all columns */}
        <div className="glass-card flex items-start" style={{gridColumn: '1 / -1'}}>
          <div className="profile-avatar mr-6">
            {getInitials(user.fullName)}
          </div>
          <div>
            <h2 className="text-xl mb-2">{user.fullName}</h2>
            <div className="text-muted grid" style={{gridTemplateColumns: '1fr 1fr', gap: '0.5rem'}}>
              <p><strong>Roll No:</strong> {user.rollNumber}</p>
              <p><strong>Class:</strong> {user.branch} {user.year}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="glass-card stat-card">
          <div className="stat-label">Attendance %</div>
          <div className="stat-value gradient-text">{attendancePercentage}%</div>
        </div>
        
        <div className="glass-card stat-card">
          <div className="stat-label">Total Present</div>
          <div className="stat-value text-success" style={{color: 'var(--success)'}}>{presentDays} Days</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-label">Total Absent</div>
          <div className="stat-value text-danger" style={{color: 'var(--danger)'}}>{absentDays} Days</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-label">Latest Activity ({latestDate})</div>
          <div className="mt-2">
            {/* Dynamically style the badge based on presence status */}
            <span className={`status-badge ${latestStatus === 'Present' ? 'status-present' : 'status-absent'}`}>
              {latestStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="page-header mt-6">
        <h2 className="text-xl">Today's Schedule</h2>
      </div>

      <div className="dashboard-grid mb-6">
        {/* Render each scheduled class as a separate card */}
        {schedule.map(cls => (
          <div key={cls.id} className="glass-card flex items-center justify-between" style={{padding: '1rem'}}>
            <div>
              <h3 className="font-semibold text-lg">{cls.name}</h3>
              <p className="text-muted text-sm">{cls.time}</p>
            </div>
            <Link to="/attendance" className="btn btn-primary" style={{padding: '0.4rem 0.8rem', fontSize: '0.9rem'}}>Mark</Link>
          </div>
        ))}
      </div>

      {/* Quick Actions Navigation Section */}
      <div className="page-header mt-6">
        <h2 className="text-xl">Quick Actions</h2>
      </div>

      <div className="dashboard-grid">
         {/* Links to various modules in the ERP */}
         <Link to="/attendance" className="glass-card text-center" style={{textDecoration: 'none'}}>
            <h3 className="text-lg gradient-text mb-2">Mark Attendance</h3>
            <p className="text-muted text-sm">Use face recognition to mark today's attendance.</p>
         </Link>
         
         <Link to="/results" className="glass-card text-center" style={{textDecoration: 'none'}}>
            <h3 className="text-lg gradient-text mb-2">Attendance Log</h3>
            <p className="text-muted text-sm">Check your detailed attendance history and reports.</p>
         </Link>

         <Link to="/academics" className="glass-card text-center" style={{textDecoration: 'none'}}>
            <h3 className="text-lg gradient-text mb-2">Academics</h3>
            <p className="text-muted text-sm">View your academic grades and semester results.</p>
         </Link>

         <Link to="/exams" className="glass-card text-center" style={{textDecoration: 'none'}}>
            <h3 className="text-lg gradient-text mb-2">Exams</h3>
            <p className="text-muted text-sm">Check ongoing exams and upcoming schedules.</p>
         </Link>

         <Link to="/fees" className="glass-card text-center" style={{textDecoration: 'none'}}>
            <h3 className="text-lg gradient-text mb-2">Fee Portal</h3>
            <p className="text-muted text-sm">View fee structure and payment history.</p>
         </Link>

         <Link to="/profile" className="glass-card text-center" style={{textDecoration: 'none'}}>
            <h3 className="text-lg gradient-text mb-2">Edit Profile</h3>
            <p className="text-muted text-sm">Update your personal contact details.</p>
         </Link>
      </div>
    </div>
  );
};

export default Dashboard;
