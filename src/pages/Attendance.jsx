/**
 * @file Attendance.jsx
 * @description Page component allowing students to mark their attendance using facial recognition.
 * Validates if the current time matches the selected class schedule before allowing marking.
 */

import React, { useState } from 'react';
import WebcamFaceBox from '../components/WebcamFaceBox';
import { getLoggedInUser, markAttendance, getDailySchedule } from '../utils/storageUtils';
import { matchFace } from '../utils/faceUtils';

/**
 * Attendance Component
 * @returns {JSX.Element} The Attendance interface
 */
const Attendance = () => {
  // Fetch required data from storage
  const user = getLoggedInUser();
  const schedule = getDailySchedule();
  
  // State for displaying success/error messages
  const [status, setStatus] = useState({ type: '', message: '' });
  
  // State for indicating background processing
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for tracking the currently selected class dropdown value
  const [selectedClass, setSelectedClass] = useState(schedule[0]?.name || '');

  /**
   * Helper function: Converts a time string (e.g. "01:30 PM") to total minutes from midnight.
   * Useful for comparing if the current time falls within class duration.
   * @param {string} timeStr - Time string in format "HH:MM AM/PM"
   * @returns {number} Time expressed as total minutes since 00:00
   */
  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    
    // Convert 12-hour format to 24-hour format
    if (hours === 12) hours = 0;
    if (modifier === 'PM') hours += 12;
    
    return hours * 60 + minutes;
  };

  /**
   * Helper function: Checks if the current system time falls within the given class time range.
   * @param {string} timeStr - Time range string (e.g. "09:00 AM - 10:30 AM")
   * @returns {boolean} True if class is currently ongoing, false otherwise
   */
  const isClassActive = (timeStr) => {
    const [startStr, endStr] = timeStr.split(' - ');
    const startMins = parseTime(startStr);
    const endMins = parseTime(endStr);
    
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    
    // Check if current time falls between start and end boundaries
    return currentMins >= startMins && currentMins <= endMins;
  };

  /**
   * Event Handler: Processes the face descriptor returned from the Webcam component.
   * Matches it against stored profile data to record attendance.
   * @param {Array|null} liveDescriptor - The face feature array captured from the webcam
   */
  const handleMarkAttendance = async (liveDescriptor) => {
    // Reset status and start processing state
    setStatus({ type: '', message: '' });
    setIsProcessing(true);

    // Validation: Ensure a class is selected
    if (!selectedClass) {
      setStatus({ type: 'error', message: 'Please select a class first.' });
      setIsProcessing(false);
      return;
    }

    // Validation: Ensure the selected class is currently active (time constraint)
    const selectedClassObj = schedule.find(c => c.name === selectedClass);
    if (selectedClassObj && !isClassActive(selectedClassObj.time)) {
      setStatus({ type: 'error', message: `Attendance can only be marked during the scheduled class time (${selectedClassObj.time}).` });
      setIsProcessing(false);
      return;
    }

    // Validation: Ensure a face was successfully captured
    if (!liveDescriptor) {
      setStatus({ type: 'error', message: 'Face not clearly detected. Please try again.' });
      setIsProcessing(false);
      return;
    }

    try {
      // Perform facial recognition match
      const savedDescriptor = user.faceDescriptor;
      const { matched, distance } = matchFace(liveDescriptor, savedDescriptor);

      if (matched) {
        // Face verified successfully, proceed to mark attendance in storage
        try {
            markAttendance(user, selectedClass);
            setStatus({ type: 'success', message: `Attendance marked successfully for ${selectedClass}!` });
        } catch (storageErr) {
            // Handle specific storage errors (like "already marked today")
            setStatus({ type: 'info', message: storageErr.message });
        }
      } else {
        // Face didn't match the registered profile
        setStatus({ type: 'error', message: `Face not matched. Distance: ${distance.toFixed(2)}` });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'An error occurred during processing.' });
    } finally {
      // End processing state regardless of outcome
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
        
        {/* Display visual list of classes for reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          {schedule.map(cls => (
            <div key={cls.id} className="p-3 bg-dark-lighter rounded-md" style={{background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem'}}>
              <div className="font-semibold">{cls.name}</div>
              <div className="text-muted text-sm">{cls.time}</div>
            </div>
          ))}
        </div>
        
        {/* Dropdown for selecting which class to mark attendance for */}
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
        {/* Status notification banner */}
        {status.message && (
          <div className={`alert alert-${status.type}`}>
            {status.message}
          </div>
        )}

        {/* Reusable webcam component for capturing the face */}
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
