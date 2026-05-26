/**
 * @file AcademicResults.jsx
 * @description Displays the student's academic performance, including CGPA, credits,
 * and a detailed breakdown of their latest semester grades.
 */

import React from 'react';
import { getLoggedInUser } from '../utils/storageUtils';

/**
 * AcademicResults Component
 * @returns {JSX.Element} The academic results view
 */
const AcademicResults = () => {
  // Fetch current logged in user (could be used to fetch actual data from backend)
  const user = getLoggedInUser();

  // Dummy academic data for demonstration purposes
  const cgpa = "8.75";
  const completedCredits = 96;
  const currentSemester = "Semester 6";

  // List of courses and their respective grades for the current semester
  const currentResults = [
    { code: "CS301", subject: "Database Management Systems", credits: 4, grade: "A+" },
    { code: "CS302", subject: "Operating Systems", credits: 4, grade: "A" },
    { code: "CS303", subject: "Computer Networks", credits: 4, grade: "A" },
    { code: "CS304", subject: "Software Engineering", credits: 3, grade: "B+" },
    { code: "CS305", subject: "Web Technologies", credits: 3, grade: "A+" },
    { code: "CS306", subject: "OS Lab", credits: 2, grade: "O" },
    { code: "CS307", subject: "Networks Lab", credits: 2, grade: "O" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title gradient-text">Academic Results</h1>
        <p className="page-subtitle">Your academic performance and grades</p>
      </div>

      {/* Summary Statistics Cards */}
      <div className="dashboard-grid mb-6">
        <div className="glass-card stat-card">
          <div className="stat-label">Overall CGPA</div>
          <div className="stat-value gradient-text">{cgpa}</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Current Semester</div>
          <div className="stat-value">{currentSemester}</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Completed Credits</div>
          <div className="stat-value text-success" style={{color: 'var(--success)'}}>{completedCredits}</div>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div className="glass-card">
        <div className="flex justify-between items-center mb-4" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 className="text-xl">Latest Semester Results ({currentSemester})</h2>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Subject</th>
                <th>Credits</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {/* Map through the results array to render table rows */}
              {currentResults.map((record, index) => (
                <tr key={index}>
                  <td>{record.code}</td>
                  <td>{record.subject}</td>
                  <td>{record.credits}</td>
                  <td>
                    {/* Display grade in a styled badge */}
                    <span className={`status-badge status-present`}>
                      {record.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AcademicResults;
