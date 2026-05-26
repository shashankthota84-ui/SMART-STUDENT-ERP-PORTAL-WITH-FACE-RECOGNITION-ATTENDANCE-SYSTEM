/**
 * @file AdminDashboard.jsx
 * @description Dashboard interface for administrators.
 * Allows admins to view all registered students, monitor attendance logs,
 * and send email notifications to absent students.
 */

import React, { useState } from 'react';
import { getStudents, getAttendanceRecords, processAbsences } from '../utils/storageUtils';

/**
 * AdminDashboard Component
 * @returns {JSX.Element} The admin interface
 */
const AdminDashboard = () => {
  // Fetch full lists of students and attendance records
  const students = getStudents();
  const attendance = getAttendanceRecords();
  
  // State for search filtering
  const [searchTerm, setSearchTerm] = useState('');
  
  // State to toggle between the 'Students' view and 'Attendance' view
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'attendance'
  
  // State used to force a re-render after background processing finishes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Effect hook to process pending absences on component mount.
   * This ensures the admin sees the most up-to-date data.
   */
  React.useEffect(() => {
    processAbsences();
    // Trigger a re-render to show updated records if any were created during processing
    setRefreshTrigger(prev => prev + 1);
  }, []);

  /**
   * Event handler for sending email notifications to absent students.
   * Uses a mailto link to open the admin's default email client.
   * @param {Object} record - The specific attendance record marking the absence
   */
  const handleNotify = (record) => {
    // Locate the student in the database to retrieve their email
    const student = students.find(s => s.rollNumber === record.rollNumber);
    const email = student ? student.email : 'student@example.com';
    
    // Construct the email subject and body text
    const subject = `Attendance Alert: Absent for ${record.className || 'Class'}`;
    const body = `Dear ${record.name},%0D%0A%0D%0AYou were marked absent for ${record.className || 'your class'} on ${record.date}.%0D%0APlease ensure you attend the classes regularly.%0D%0A%0D%0ARegards,%0D%0AAdmin`;
    
    // Trigger the mailto link
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    alert(`Notification email sent to ${email} for missing ${record.className || 'class'}!`);
  };

  // Reverse attendance array so the newest records appear at the top of the table
  const sortedAttendance = [...attendance].reverse();

  // Filter the students list based on the search term (checks name and roll number)
  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter the attendance list based on the search term (checks name, roll number, and date)
  const filteredAttendance = sortedAttendance.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.date.includes(searchTerm)
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title gradient-text">Admin Dashboard (Demo)</h1>
        <p className="page-subtitle">View all registered students and attendance records</p>
      </div>

      {/* Summary Statistics Section */}
      <div className="dashboard-grid mb-6">
        <div className="glass-card stat-card">
          <div className="stat-label">Total Registered Students</div>
          <div className="stat-value gradient-text">{students.length}</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Total Attendance Records</div>
          <div className="stat-value">{attendance.length}</div>
        </div>
      </div>

      <div className="glass-card">
        {/* Tab Navigation and Search Bar Container */}
        <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', gap: '1rem'}}>
            <button 
              className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('students')}
            >
              Students Database
            </button>
            <button 
              className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance Logs
            </button>
          </div>
          
          <div>
            <input 
              type="text" 
              placeholder={`Search by ${activeTab === 'students' ? 'name/roll...' : 'name/date...'}`} 
              className="form-input"
              style={{width: '250px', padding: '0.5rem', marginBottom: '0'}}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conditional Table Rendering based on active tab */}
        <div className="table-container">
          {activeTab === 'students' ? (
            // --- Students Table ---
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class/Year</th>
                  <th>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={index}>
                      <td><strong>{student.rollNumber}</strong></td>
                      <td>{student.fullName}</td>
                      <td>{student.email}</td>
                      <td>{student.branch} {student.year}</td>
                      <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted" style={{padding: '2rem'}}>
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            // --- Attendance Records Table ---
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Class</th>
                  <th>Time</th>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td>{record.className || '--'}</td>
                      <td>{record.time}</td>
                      <td><strong>{record.rollNumber}</strong></td>
                      <td>{record.name}</td>
                      <td>
                        <span className={`status-badge status-${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>
                        {/* Only show notify button for absent records */}
                        {record.status === 'Absent' && (
                          <button 
                            className="btn btn-outline" 
                            style={{padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: 'var(--primary)', borderColor: 'var(--primary)'}}
                            onClick={() => handleNotify(record)}
                          >
                            Notify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted" style={{padding: '2rem'}}>
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
