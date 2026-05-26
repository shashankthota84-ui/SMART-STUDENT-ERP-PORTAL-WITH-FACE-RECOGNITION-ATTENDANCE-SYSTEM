/**
 * @file Results.jsx
 * @description Displays the student's detailed attendance history.
 * Includes search functionality and a summary of present vs absent days.
 */

import React, { useState } from 'react';
import { getLoggedInUser, getStudentAttendanceHistory, processAbsences } from '../utils/storageUtils';

/**
 * Results Component (Attendance Log)
 * @returns {JSX.Element} The attendance history view
 */
const Results = () => {
  const user = getLoggedInUser();
  const history = getStudentAttendanceHistory(user.rollNumber);
  
  // State for the date search filter
  const [searchTerm, setSearchTerm] = useState('');
  
  // State used to force re-render if absences are updated on mount
  const [refresh, setRefresh] = useState(0);

  /**
   * Effect hook to run absence processing immediately when the page loads,
   * ensuring the displayed history is fully up-to-date.
   */
  React.useEffect(() => {
    processAbsences();
    setRefresh(prev => prev + 1);
  }, []);

  // Reverse history so the newest records appear first in the table
  const sortedHistory = [...history].reverse();

  // Filter records based on the user's search input (matching against the date string)
  const filteredHistory = sortedHistory.filter(record => 
    record.date.includes(searchTerm)
  );

  // Calculate summary statistics
  const totalDays = history.length;
  const presentDays = history.filter(r => r.status === 'Present').length;
  const absentDays = totalDays - presentDays;
  
  // Calculate attendance percentage, returning 0 instead of NaN if totalDays is 0
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title gradient-text">Attendance Results</h1>
        <p className="page-subtitle">Detailed view of your attendance history</p>
      </div>

      {/* Summary Statistics Section */}
      <div className="dashboard-grid mb-6">
        <div className="glass-card stat-card">
          <div className="stat-label">Overall Percentage</div>
          <div className="stat-value gradient-text">{attendancePercentage}%</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Total Days</div>
          <div className="stat-value">{totalDays}</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Present</div>
          <div className="stat-value text-success" style={{color: 'var(--success)'}}>{presentDays}</div>
        </div>
      </div>

      {/* Detailed History Table Section */}
      <div className="glass-card">
        <div className="flex justify-between items-center mb-4" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 className="text-xl">History Log</h2>
          <div>
            {/* Search Input for filtering by date */}
            <input 
              type="text" 
              placeholder="Search by date (DD/MM/YYYY)..." 
              className="form-input"
              style={{width: '250px', padding: '0.5rem', marginBottom: '0'}}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Render rows for each filtered attendance record */}
              {filteredHistory.length > 0 ? (
                filteredHistory.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>{record.time}</td>
                    <td>
                      {/* Dynamically assign badge color based on status (e.g., status-present) */}
                      <span className={`status-badge status-${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                // Fallback message if no records match the search
                <tr>
                  <td colSpan="3" className="text-center text-muted" style={{padding: '2rem'}}>
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Results;
