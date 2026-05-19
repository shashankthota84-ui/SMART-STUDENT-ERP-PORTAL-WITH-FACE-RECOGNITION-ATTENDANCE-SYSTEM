// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import { getStudents, getAttendanceRecords, processAbsences } from '../utils/storageUtils';

const AdminDashboard = () => {
  const students = getStudents();
  const attendance = getAttendanceRecords();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('students'); // students or attendance
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  React.useEffect(() => {
    processAbsences();
    // Trigger a re-render to show updated records if any were created
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleNotify = (record) => {
    // Find student email
    const student = students.find(s => s.rollNumber === record.rollNumber);
    const email = student ? student.email : 'student@example.com';
    
    // Create mailto link
    const subject = `Attendance Alert: Absent for ${record.className || 'Class'}`;
    const body = `Dear ${record.name},%0D%0A%0D%0AYou were marked absent for ${record.className || 'your class'} on ${record.date}.%0D%0APlease ensure you attend the classes regularly.%0D%0A%0D%0ARegards,%0D%0AAdmin`;
    
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    alert(`Notification email sent to ${email} for missing ${record.className || 'class'}!`);
  };

  // Reverse so newest are first
  const sortedAttendance = [...attendance].reverse();

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <div className="table-container">
          {activeTab === 'students' ? (
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
