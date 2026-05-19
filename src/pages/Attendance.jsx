// src/pages/Attendance.jsx
import React, { useState } from 'react';
import WebcamFaceBox from '../components/WebcamFaceBox';
import { getLoggedInUser, markAttendance, getDailySchedule } from '../utils/storageUtils';
import { matchFace } from '../utils/faceUtils';

const Attendance = () => {
  const user = getLoggedInUser();
  const schedule = getDailySchedule();
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedClass, setSelectedClass] = useState(schedule[0]?.name || '');

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    if (hours === 12) hours = 0;
    if (modifier === 'PM') hours += 12;
    return hours * 60 + minutes;
  };

  const isClassActive = (timeStr) => {
    const [startStr, endStr] = timeStr.split(' - ');
    const startMins = parseTime(startStr);
    const endMins = parseTime(endStr);
    
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    
    return currentMins >= startMins && currentMins <= endMins;
  };

  const handleMarkAttendance = async (liveDescriptor) => {
    setStatus({ type: '', message: '' });
    setIsProcessing(true);

    if (!selectedClass) {
      setStatus({ type: 'error', message: 'Please select a class first.' });
      setIsProcessing(false);
      return;
    }

    const selectedClassObj = schedule.find(c => c.name === selectedClass);
    if (selectedClassObj && !isClassActive(selectedClassObj.time)) {
      setStatus({ type: 'error', message: `Attendance can only be marked during the scheduled class time (${selectedClassObj.time}).` });
      setIsProcessing(false);
      return;
    }

    if (!liveDescriptor) {
      setStatus({ type: 'error', message: 'Face not clearly detected. Please try again.' });
      setIsProcessing(false);
      return;
    }

    try {
      const savedDescriptor = user.faceDescriptor;
      const { matched, distance } = matchFace(liveDescriptor, savedDescriptor);

      if (matched) {
        // Mark attendance in storage
        try {
            markAttendance(user, selectedClass);
            setStatus({ type: 'success', message: `Attendance marked successfully for ${selectedClass}!` });
        } catch (storageErr) {
            // Usually duplicate error
            setStatus({ type: 'info', message: storageErr.message });
        }
      } else {
        setStatus({ type: 'error', message: `Face not matched. Distance: ${distance.toFixed(2)}` });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'An error occurred during processing.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="page-header text-center">
        <h1 className="page-title gradient-text">Mark Attendance</h1>
        <p className="page-subtitle">Look at the camera to mark attendance for your class</p>
      </div>

      <div className="glass-card mb-6">
        <h3 className="text-xl mb-4">Today's Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          {schedule.map(cls => (
            <div key={cls.id} className="p-3 bg-dark-lighter rounded-md" style={{background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem'}}>
              <div className="font-semibold">{cls.name}</div>
              <div className="text-muted text-sm">{cls.time}</div>
            </div>
          ))}
        </div>
        
        <div className="form-group">
          <label>Select Class for Attendance:</label>
          <select 
            className="form-input" 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">-- Select Class --</option>
            {schedule.map(cls => (
              <option key={cls.id} value={cls.name}>{cls.name} ({cls.time})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-card">
        {status.message && (
          <div className={`alert alert-${status.type}`}>
            {status.message}
          </div>
        )}

        <WebcamFaceBox 
          onFaceDetected={handleMarkAttendance}
          isProcessing={isProcessing}
          buttonText="Mark Present"
          error={status.type === 'error' ? status.message : ''}
        />
      </div>
    </div>
  );
};

export default Attendance;

