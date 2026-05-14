// src/pages/Attendance.jsx
import React, { useState } from 'react';
import WebcamFaceBox from '../components/WebcamFaceBox';
import { getLoggedInUser, markAttendance } from '../utils/storageUtils';
import { matchFace } from '../utils/faceUtils';

const Attendance = () => {
  const user = getLoggedInUser();
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMarkAttendance = async (liveDescriptor) => {
    setStatus({ type: '', message: '' });
    setIsProcessing(true);

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
            markAttendance(user);
            setStatus({ type: 'success', message: 'Attendance marked successfully for today!' });
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
        <p className="page-subtitle">Look at the camera to mark your daily attendance</p>
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
