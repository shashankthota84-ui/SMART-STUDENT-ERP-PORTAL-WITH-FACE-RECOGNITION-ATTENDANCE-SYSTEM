// src/pages/AcademicResults.jsx
import React from 'react';
import { getLoggedInUser } from '../utils/storageUtils';

const AcademicResults = () => {
  const user = getLoggedInUser();

  // Dummy academic data
  const cgpa = "8.75";
  const completedCredits = 96;
  const currentSemester = "Semester 6";

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
              {currentResults.map((record, index) => (
                <tr key={index}>
                  <td>{record.code}</td>
                  <td>{record.subject}</td>
                  <td>{record.credits}</td>
                  <td>
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
