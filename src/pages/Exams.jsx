/**
 * @file Exams.jsx
 * @description Page component that displays the student's exam schedule.
 * Includes a section for the currently ongoing exam and a table for upcoming exams.
 */

import React from 'react';

/**
 * Exams Component
 * @returns {JSX.Element} The exam schedule view
 */
const Exams = () => {
  // Dummy data representing an exam happening right now
  const ongoingExam = {
    subject: "Database Management Systems",
    code: "CS301",
    date: new Date().toLocaleDateString('en-GB'),
    time: "10:00 AM - 01:00 PM",
    room: "Block A - Room 204",
    status: "In Progress"
  };

  // Dummy data array for future scheduled exams
  const upcomingExams = [
    { code: "CS302", subject: "Operating Systems", date: "15/05/2026", time: "10:00 AM - 01:00 PM" },
    { code: "CS303", subject: "Computer Networks", date: "18/05/2026", time: "10:00 AM - 01:00 PM" },
    { code: "CS304", subject: "Software Engineering", date: "21/05/2026", time: "02:00 PM - 05:00 PM" },
    { code: "CS305", subject: "Web Technologies", date: "25/05/2026", time: "10:00 AM - 01:00 PM" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title gradient-text">Exam Schedule</h1>
        <p className="page-subtitle">View your ongoing and upcoming examinations</p>
      </div>

      {/* Ongoing Exam Highlight Card */}
      <div className="glass-card mb-6" style={{ border: '1px solid var(--primary)' }}>
        <div className="flex justify-between items-center mb-4" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 className="text-xl text-primary" style={{color: 'var(--primary)'}}>Ongoing Exam Today</h2>
          {/* Pulsing badge to grab attention for live exams */}
          <span className="status-badge status-present animate-pulse" style={{ animation: 'pulse 2s infinite' }}>{ongoingExam.status}</span>
        </div>
        <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div>
            <p className="text-muted text-sm">Subject</p>
            <p className="text-lg font-medium">{ongoingExam.subject} ({ongoingExam.code})</p>
          </div>
          <div>
            <p className="text-muted text-sm">Date & Time</p>
            <p className="text-lg font-medium">{ongoingExam.date} | {ongoingExam.time}</p>
          </div>
          <div>
            <p className="text-muted text-sm">Venue</p>
            <p className="text-lg font-medium">{ongoingExam.room}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Exams Table Section */}
      <div className="glass-card">
        <div className="mb-4">
          <h2 className="text-xl">Upcoming Exams Schedule</h2>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Course Code</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              {/* Render rows for each upcoming exam */}
              {upcomingExams.map((exam, index) => (
                <tr key={index}>
                  <td>{exam.date}</td>
                  <td>{exam.time}</td>
                  <td>{exam.code}</td>
                  <td>{exam.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Exams;
