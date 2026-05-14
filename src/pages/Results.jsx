// src/pages/Results.jsx
import React, { useState } from 'react';
import { getLoggedInUser, getStudentAttendanceHistory, processAbsences } from '../utils/storageUtils';

const Results = () => {
  const user = getLoggedInUser();
  const history = getStudentAttendanceHistory(user.rollNumber);
  const [searchTerm, setSearchTerm] = useState('');
  const [refresh, setRefresh] = useState(0);

  React.useEffect(() => {
    processAbsences();
    setRefresh(prev => prev + 1);
  }, []);

  // Reverse history so newest is first
  const sortedHistory = [...history].reverse();

  // Filter based on date search
  const filteredHistory = sortedHistory.filter(record => 
    record.date.includes(searchTerm)
  );

  const totalDays = history.length;
  const presentDays = history.filter(r => r.status === 'Present').length;
  const absentDays = totalDays - presentDays;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title gradient-text">Attendance Results</h1>
        <p className="page-subtitle">Detailed view of your attendance history</p>
      </div>

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

      <div className="glass-card">
        <div className="flex justify-between items-center mb-4" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 className="text-xl">History Log</h2>
          <div>
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
              {filteredHistory.length > 0 ? (
                filteredHistory.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>{record.time}</td>
                    <td>
                      <span className={`status-badge status-${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
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
